package controllers

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func GetNote(c *gin.Context) {

	nid := c.Param("id")
	password := c.Query("password")
	var req models.GetNoteReq
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("no password input")
	}

	if uid, exist := c.Get(config.UID); !exist {
		response := common.Response{
			Code:    common.NotExistUser,
			Message: common.ErrCodeToString(common.NotExistUser),
		}
		c.JSON(http.StatusUnauthorized, response)
		return
	} else {

		uidStr, ok := uid.(string)
		if !ok {
			response := common.Response{
				Code:    common.InvalidUid,
				Message: "invalid uid",
			}
			c.JSON(http.StatusUnauthorized, response)
			return
		}
		//if req is nil?
		ret, code := services.GetNote(nid, uidStr, password)

		response := common.Response{
			Code:    code,
			Message: common.ErrCodeToString(code),
			Data:    ret,
		}
		if code == 0 {
			c.JSON(http.StatusOK, response)
		} else {
			c.JSON(http.StatusInternalServerError, response)
		}
	}
}

// todo: don't use short link now
func CreateNote(c *gin.Context) {
	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, common.BadReq)
		return
	}
	note.AuthorID = c.GetString(config.UID)
	notesResp, err := services.CreateNotes(note)
	if notesResp.Receivers == nil {
		notesResp.Receivers = []string{}
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.Response{
			Code:    common.Error,
			Message: common.ErrCodeToString(common.Error),
			Data:    err.Error(),
		})
	}
	c.JSON(http.StatusCreated, common.Response{
		Code:    common.Success,
		Message: common.ErrCodeToString(common.Success),
		Data:    notesResp,
	})
}

func GetAllNotes(c *gin.Context) {

	limitStr := c.Query("limit")
	cursor := c.Query("cursor")

	// 解析 limit 参数，默认值设为 10
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	uid, _ := c.Get(config.UID)

	var notes []models.Note
	query := config.DB.Preload("Author").Where("author_id = ?", uid).Limit(limit).Order("created_at DESC")
	if cursor != "" {
		query = query.Where("nid >= ?", cursor)
	}
	if err := query.Find(&notes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, common.Response{
			Code:    common.Error,
			Message: common.ErrCodeToString(common.Error),
			Data:    err.Error(),
		})
		return
	}

	// 判断是否有下一页数据
	var nextCursor string
	if len(notes) > limit {
		// 存在下一页，记录 nextCursor 为第 limit+1 条记录的 ID
		nextCursor = notes[limit].Nid
		// 截取前 limit 条记录
		notes = notes[:limit]
	} else {
		nextCursor = ""
	}

	// 预加载 Author 信息，并查询 AuthorID 等于 uid 的 Note
	//if err := config.DB.Preload("Author").Where("author_id = ?", uid).Find(&notes).Error; err != nil {
	//	c.JSON(http.StatusInternalServerError, common.Response{
	//		Code:    common.Error,
	//		Message: common.ErrCodeToString(common.Error),
	//		Data:    err.Error(),
	//	})
	//	return
	//}

	// 构造返回数据，只保留需要的字段
	list := make([]models.GetAllNoteResp, 0)
	for _, note := range notes {
		list = append(list, models.GetAllNoteResp{
			ID:        note.Nid,
			Title:     note.Title,
			Author:    note.Author, // 此处直接使用 models.Author，因其 JSON 标签已设置好
			CreatedAt: note.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, common.Response{
		Code:    common.Success,
		Message: common.ErrCodeToString(common.Success),
		Data: models.GetAllNoteListResp{
			Notes:      list,
			NextCursor: nextCursor,
		},
	})
}

// 验证方式
func DeleteNote(c *gin.Context) {}
