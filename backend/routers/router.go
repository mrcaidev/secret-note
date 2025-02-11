package routers

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {

	router := gin.Default()

	apiV1 := router.Group("api/v1")
	{
		AuthGroup := apiV1.Group("auth")
		{
			AuthGroup.GET("")
		}
		UserGroup := apiV1.Group("/")
		{
			UserGroup.POST("/users", controllers.CreateUser)
			UserGroup.GET("/me", controllers.GetUser)
		}
	}
	return router
}
