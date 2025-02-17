package routers

import (
	"backend/common"
	"backend/config"
	"backend/controllers"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"net/http"
	"strings"
)

func AlwaysCORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 设置你需要的 CORS 响应头
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // 或者指定特定域名
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// 如果是预检请求，则直接返回204状态码
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func InitRouter() *gin.Engine {

	router := gin.Default()
	router.Use(AlwaysCORS())

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
			UserGroup.DELETE("/me", authMiddleware(), controllers.DeleteMe)
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
		var invalidToken = config.JudgeTokenInvalid(tokenString)
		if err != nil || !token.Valid || invalidToken {
			c.JSON(http.StatusUnauthorized, response)
			c.Abort()
			return
		}

		// 如果需要，可以将用户信息写入上下文
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("uid", claims["uid"].(string))
			c.Set("token", tokenString)
		} else if !ok {
			c.JSON(http.StatusUnauthorized, response)
		}
		c.Next()
	}
}
