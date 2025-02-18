package controllers

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"time"
)

type EmailRequest struct {
	Email string `json:"email"` // tag要跟前端字段对应
}

func SendOtp(c *gin.Context) {

	var email EmailRequest
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, common.BadRequest())
		return
	}
	otpFlowId, err := services.SendOtp(email.Email)
	if err != nil {
		response := common.Response{
			Code:    common.SendMailFailed,
			Message: err.Error(),
		}
		c.JSON(http.StatusBadGateway, response)
	} else {
		response := common.Response{
			Code:    common.Success,
			Message: "otp flow successfully",
			Data:    otpFlowId,
		}
		c.JSON(http.StatusOK, response)
	}
}

func VerifyOtp(c *gin.Context) {
	var otpFlow models.OtpFlow
	if err := c.ShouldBindJSON(&otpFlow); err != nil {
		c.JSON(http.StatusBadRequest, common.BadRequest())
		return
	}
	ret := services.VerifyOtp(otpFlow)
	response := common.Response{
		Code:    ret,
		Message: common.ErrCodeToString(ret),
		Data:    ret,
	}
	c.JSON(http.StatusOK, response)
}

func Sign(c *gin.Context) {
	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, common.BadRequest())
	}
	var user, token, code = services.Signin(loginReq)
	response := common.Response{
		Code:    code,
		Message: common.ErrCodeToString(code),
		Data:    user,
	}
	// 将 token 添加到响应头，通常建议加上 Bearer 前缀
	c.Header("Authorization", "Bearer "+token)
	c.JSON(http.StatusOK, response)
}

func SignByOauth(c *gin.Context) {
	provider := c.Param("provider")
	var OauthReq models.OauthReq
	if err := c.ShouldBindJSON(&OauthReq); err != nil {
		c.JSON(http.StatusBadRequest, common.BadRequest())
	}
	resp, code := services.SignByOauth(OauthReq.AccessToken, provider)
	if code == common.FailedToRequestFromProvider {
		c.JSON(http.StatusBadGateway, common.Response{
			Code:    code,
			Message: common.ErrCodeToString(code),
		})
		return
	}
	c.JSON(http.StatusOK, common.Response{
		Code:    code,
		Message: common.ErrCodeToString(code),
		Data:    resp,
	})
}

func SignOut(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		response := common.Response{
			Code:    common.StatusUnauthorized,
			Message: common.ErrCodeToString(common.StatusUnauthorized),
		}
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	// 去掉前面的 "Bearer " 前缀，并去除可能的首尾空格
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
	config.Cache.Set(config.INVALID_TOKEN+token, "invalid token", time.Hour*72)
	response := common.Response{
		Code:    common.Success,
		Message: common.ErrCodeToString(common.Success),
	}
	c.JSON(http.StatusOK, response)
}
