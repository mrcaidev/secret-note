package controllers

import (
	"backend/common"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

// todo: slow sql
// maybe it's because of cheap aws server
// when using local database, not slow sql
// todo: check if the email pass the otp check.
func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, common.BadRequest())
		return
	}

	newUser, duplicateUser := services.CreateUser(&user)
	if duplicateUser {
		response := common.Response{
			Code:    common.EmailExists,
			Message: "email exists",
		}
		c.JSON(http.StatusConflict, response)
	} else {
		response := common.Response{
			Code:    common.Success,
			Message: "success",
			Data:    newUser,
		}
		c.JSON(http.StatusOK, response)
	}
}

func Test(c *gin.Context) {
	c.JSON(http.StatusOK, "pong")
}

func GetUser(c *gin.Context) {
	if uid, exist := c.Get("uid"); !exist {
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
				Code:    common.InvalidUid, // 假设你定义了这个错误码
				Message: "invalid uid",
			}
			c.JSON(http.StatusUnauthorized, response)
			return
		}
		userRes := services.GetUser(uidStr)
		response := common.Response{
			Code:    common.Success,
			Message: "success",
			Data:    userRes,
		}
		c.JSON(http.StatusOK, response)
		return
	}
}
