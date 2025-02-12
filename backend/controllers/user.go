package controllers

import (
	"backend/common"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newUser, duplicateUser := services.CreateUser(user)
	if duplicateUser {
		response := common.Response{
			Code:    common.ErrCodeEmailExists,
			Message: "email exists",
		}
		c.JSON(http.StatusOK, response)
	} else {
		response := common.Response{
			Code:    common.Success,
			Message: "success",
			Data:    newUser,
		}
		c.JSON(http.StatusOK, response)
	}
}

func GetUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": services.GetUser("guohezu")})
}
