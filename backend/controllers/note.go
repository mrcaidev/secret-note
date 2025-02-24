package controllers

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetNote(c *gin.Context) {

	nid := c.Param("id")

	services.

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
		tokenString, _ := c.Get("token")
		services.DeleteMe(uidStr, tokenString.(string))
		response := common.Response{
			Code:    common.Success,
			Message: "success",
			Data:    0,
		}
		c.JSON(http.StatusOK, response)
		return
	}
}

func GetAllNotes(c *gin.Context) {

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
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.Response{
			Code:    common.Error,
			Message: common.ErrCodeToString(common.Error),
			Data:    err.Error(),
		})
	}
	c.JSON(http.StatusOK, common.Response{
		Code:    common.Success,
		Message: common.ErrCodeToString(common.Success),
		Data:    notesResp,
	})
}

// 验证方式
func DeleteNote(c *gin.Context) {}
