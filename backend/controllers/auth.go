package controllers

import (
	"backend/common"
	"backend/models"
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type EmailRequest struct {
	Email string `json:"email"` // tag要跟前端字段对应
}

func SendOtp(c *gin.Context) {

	var email EmailRequest
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	otpFlowId, err := services.SendOtp(email.Email)
	if err != nil {
		response := common.Response{
			Code:    common.SendMailFailed,
			Message: err.Error(),
		}
		c.JSON(http.StatusOK, response)
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
