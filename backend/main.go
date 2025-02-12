package main

import (
	"backend/config"
	"backend/routers"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
)

func main() {
	config.ConnectDatabase()
	router := routers.InitRouter()
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

// SetupRouter 用于初始化并返回一个 Gin 路由实例
func SetupRouter() *gin.Engine {
	// 建议在测试模式下运行 Gin，可以避免一些无关日志输出
	gin.SetMode(gin.TestMode)

	router := gin.Default()

	// 定义一个简单的路由
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	return router
}

// TestPingRoute 是一个测试示例，不需要启动服务，只调用路由处理函数
func TestPingRoute(t *testing.T) {
	// 获取初始化后的路由
	router := SetupRouter()

	// 构造一个 GET 请求，请求路径为 /ping
	req, err := http.NewRequest("GET", "/ping", nil)
	if err != nil {
		t.Fatalf("构造请求失败: %v", err)
	}

	// 使用 httptest.NewRecorder 模拟响应
	w := httptest.NewRecorder()

	// 将请求发送给 Gin 引擎进行处理
	router.ServeHTTP(w, req)

	// 检查状态码是否为 200
	assert.Equal(t, http.StatusOK, w.Code, "状态码应为 200")

	// 检查返回的 JSON 数据是否正确
	expected := `{"message":"pong"}`
	assert.JSONEq(t, expected, w.Body.String(), "返回的 JSON 数据应一致")
}
