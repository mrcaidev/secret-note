package controllers

import (
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
	otp, err := services.SendOtp(email.Email)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
	}
}

func VerifyOtp(c *gin.Context) {
	var otpFlow models.OtpFlow
	if err := c.ShouldBindJSON(&otpFlow); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.VerifyOtp(otpFlow)
}
