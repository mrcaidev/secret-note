package controllers

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"unicode"
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

	validPass := isValidPassword(user.Password)
	if !validPass {
		c.JSON(http.StatusBadRequest, common.Response{
			Code:    common.InvalidPassword,
			Message: common.ErrCodeToString(common.InvalidPassword),
		})
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
				Code:    common.InvalidUid, // 假设你定义了这个错误码
				Message: "invalid uid",
			}
			c.JSON(http.StatusUnauthorized, response)
			return
		}
		userRes, err := services.GetUser(uidStr)
		if err != nil {
			response := common.Response{
				Code:    common.Error,
				Message: err.Error(),
			}
			c.JSON(http.StatusUnauthorized, response)
			return
		}
		response := common.Response{
			Code:    common.Success,
			Message: "success",
			Data:    userRes,
		}
		c.JSON(http.StatusOK, response)
		return
	}
}

func DeleteMe(c *gin.Context) {
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
				Code:    common.InvalidUid, // 假设你定义了这个错误码
				Message: "invalid uid",
			}
			c.JSON(http.StatusUnauthorized, response)
			return
		}
		tokenString, _ := c.Get(config.TOKEN)
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

func UpdateNickName(c *gin.Context) {
	var newName models.UpdateNicknameRequest
	if err := c.ShouldBindJSON(&newName); err == nil {
		c.JSON(http.StatusBadRequest,
			common.Response{
				Code:    common.BadReq,
				Message: common.ErrCodeToString(common.BadReq),
			})
	}

}

func isValidPassword(password string) bool {

	if len(password) < 8 || len(password) > 20 {
		return false
	}

	var hasUpper, hasLower, hasDigit bool

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasDigit = true
		}
		// Early exit if all conditions are met
		if hasUpper && hasLower && hasDigit {
			return true
		}
	}

	return hasUpper && hasLower && hasDigit
}
