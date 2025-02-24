package routers

import (
	"backend/common"
	"backend/config"
	"backend/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"net/http"
	"strings"
)

func InitRouter() *gin.Engine {

	router := gin.Default()
	router.Use(cors.Default())

	apiV1 := router.Group("api/v1")
	{

		// /oauth/{provider}/token
		AuthGroup := apiV1.Group("/auth")
		{
			AuthGroup.POST("/otp/send", controllers.SendOtp)
			AuthGroup.POST("/otp/verify", controllers.VerifyOtp)
			AuthGroup.POST("/token", controllers.Sign)
			AuthGroup.DELETE("/token", authMiddleware(), controllers.SignOut)
		}
		UserGroup := apiV1.Group("/")
		{
			UserGroup.POST("/users", controllers.CreateUser)
			UserGroup.GET("/me", authMiddleware(), controllers.GetUser)
		}
		OauthGroup := apiV1.Group("/oauth")
		{
			OauthGroup.POST("/:provider/token", controllers.SignByOauth)
		}
		TestGroup := apiV1.Group("/test")
		{
			TestGroup.GET("/", controllers.Test)
		}
	}
	return router
}

// JWT 认证中间件：用于保护需要登录验证的路由
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从请求头中获取 token
		tokenString := c.GetHeader("Authorization")
		tokenString = strings.TrimSpace(strings.TrimPrefix(tokenString, "Bearer "))

		response := common.Response{
			Code:    common.StatusUnauthorized,
			Message: common.ErrCodeToString(common.StatusUnauthorized),
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, response)
			c.Abort()
			return
		}

		// 解析 token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// 验证签名算法是否正确
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return config.JwtSecret, nil
		})
		var _, invalidToken = config.Cache.Get(config.INVALID_TOKEN + tokenString)
		if err != nil || !token.Valid || invalidToken {
			c.JSON(http.StatusUnauthorized, response)
			c.Abort()
			return
		}

		// 如果需要，可以将用户信息写入上下文
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("uid", claims["uid"].(string))
		} else if !ok {
			c.JSON(http.StatusUnauthorized, response)
		}
		c.Next()
	}
}
