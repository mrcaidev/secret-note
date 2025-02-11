package controllers

import (
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

	newUser := services.CreateUser(user)
	//c
	c.JSON(http.StatusOK, gin.H{"data": newUser})
}

func GetUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": services.GetUser("guohezu")})
}
