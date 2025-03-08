package tests

import (
	"backend/config"
	"backend/controllers"
	"backend/models"
	"backend/routers"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var router *gin.Engine
var db *gorm.DB

func SetupDatabase(t *testing.T) {
	// 初始化测试数据库
	config.InitTestDatabase()

	// 清空数据库
	err := config.DB.Migrator().DropTable(&models.User{})
	if err != nil {
		t.Fatalf("Failed to clean database: %v", err)
	}

	err = config.DB.AutoMigrate(&models.User{})
	if err != nil {
		t.Fatalf("Failed to migrate models: %v", err)
	}

	router = gin.Default()
	routers.InitRouter() // Ensure routes are registered
}

func TestSetupDatabase(t *testing.T) {
	// 在测试函数内部调用 SetupDatabase
	SetupDatabase(t)

	// 你可以继续编写其他测试逻辑，确保数据库已成功初始化
	log.Println("Database setup completed successfully")
}

func TestCreateUser(t *testing.T) {
	// 初始化测试数据库
	TestSetupDatabase(t)

	// 设置 Gin 测试路由
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/v1/users", controllers.CreateUser)

	// 构造测试请求的 JSON 数据
	userData := map[string]string{
		"email":    "testuser@example.com",
		"nickname": "Test User",
		"password": "securepassword",
	}
	jsonData, _ := json.Marshal(userData)

	// 创建 HTTP 请求
	req, _ := http.NewRequest("POST", "/api/v1/users", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	// 使用 httptest 记录 HTTP 响应
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// 检查 HTTP 状态码是否为 200
	assert.Equal(t, http.StatusOK, w.Code, "Expected HTTP 200")

	// 解析 JSON 响应
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err, "Response should be valid JSON")

	// 检查返回的 JSON 结构
	assert.Equal(t, "success", response["message"], "Response message should be 'success'")
	assert.NotNil(t, response["data"], "Response should contain user data")

	// 检查数据库是否正确插入用户
	var createdUser models.User
	config.DB.Where("email = ?", "testuser@example.com").First(&createdUser)
	assert.Equal(t, "testuser@example.com", createdUser.Email, "User should be created in database")
}

func TestGetNonExistentUser(t *testing.T) {
	TestSetupDatabase(t)

	// Attempt to get a user who does not exist in the database
	req, _ := http.NewRequest("GET", "/api/v1/users/12345", nil) // Non-existent user ID
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Expect a 404 Not Found response since the user doesn't exist
	assert.Equal(t, http.StatusNotFound, w.Code, "Trying to get a non-existent user should return a 404 Not Found error")
}

func getAuthToken(t *testing.T, r *gin.Engine) string {
	// 用户的登录数据
	loginData := map[string]string{
		"email":    "testuser@example.com",
		"password": "securepassword",
	}

	// 将数据转为 JSON
	jsonData, err := json.Marshal(loginData)
	if err != nil {
		t.Fatalf("Error marshalling login data: %v", err)
	}

	// 创建请求
	req, err := http.NewRequest("POST", "/api/v1/auth/token", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Error creating request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// 发送请求并获取响应
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// 解析响应中的 Token
	var response map[string]interface{}
	err = json.NewDecoder(w.Body).Decode(&response)
	if err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	// 获取 token
	token, ok := response["token"].(string)
	if !ok {
		t.Fatalf("Token not found in response")
	}

	return token
}

func TestDeleteUser(t *testing.T) {
	// Set up the database and router
	SetupDatabase(t)

	// Initialize the Gin engine
	r := gin.Default()
	routers.InitRouter() // Ensure routes are registered

	// 获取 token
	token := getAuthToken(t, r)
	fmt.Println("Obtained Token:", token)

	// 准备删除用户的请求
	userID := 1
	req, err := http.NewRequest("DELETE", fmt.Sprintf("/api/v1/users/%d", userID), nil)
	if err != nil {
		t.Fatalf("Error creating request: %v", err)
	}
	req.Header.Set("Authorization", "Bearer "+token) // 设置 Authorization 头部
	req.Header.Set("Content-Type", "application/json")

	// 模拟发送请求
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// 检查删除用户请求的响应
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code to be 200")

	// 解析并验证响应内容
	var deleteResponse map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &deleteResponse)
	if err != nil {
		t.Fatalf("Error unmarshalling response: %v", err)
	}

	// 验证响应字段
	code, ok := deleteResponse["code"].(float64) // 或者根据后端返回类型修改
	if !ok || code != 0 {
		t.Fatalf("Expected code 0 for success, got: %v", code)
	}
	message, ok := deleteResponse["message"].(string)
	if !ok || message != "success" {
		t.Fatalf("Expected success message, got: %v", message)
	}
}
