package controllers

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetNote(c *gin.Context) {}

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
