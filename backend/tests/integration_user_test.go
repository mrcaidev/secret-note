package tests

import (
	"backend/config"
	"backend/controllers"
	"backend/models"
	"backend/routers"
	"backend/services"
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

var router *gin.Engine
var db *gorm.DB

func SetupDatabase(t *testing.T) {
	// 初始化测试数据库
	config.InitTestDatabase()

	// 清空数据库中的相关表
	err := config.DB.Migrator().DropTable(&models.User{})
	if err != nil {
		t.Fatalf("Failed to clean user table: %v", err)
	}

	err = config.DB.Migrator().DropTable(&models.Note{}) // 清空 Note 表
	if err != nil {
		t.Fatalf("Failed to clean notes table: %v", err)
	}

	// 执行自动迁移，创建 User 和 Note 表
	err = config.DB.AutoMigrate(&models.User{}, &models.Note{})
	if err != nil {
		t.Fatalf("Failed to migrate models: %v", err)
	}

	// 初始化 router
	router = gin.Default()
	routers.InitRouter() // 注册路由
}

func TestSetupDatabase(t *testing.T) {
	// 在测试函数内部调用 SetupDatabase
	SetupDatabase(t)

	// 你可以继续编写其他测试逻辑，确保数据库已成功初始化
	log.Println("Database setup completed successfully")
}

func TestCreateUserWithWeakPassword(t *testing.T) {
	// 初始化测试数据库
	TestSetupDatabase(t)

	// 设置 Gin 测试路由
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/v1/users", controllers.CreateUser)

	// 构造测试请求的 JSON 数据
	userData := map[string]string{
		"email":    "weakpassworduser@example.com",
		"nickname": "Weak Password User",
		"password": "weak", // 密码强度太低
	}
	jsonData, _ := json.Marshal(userData)

	// 创建 HTTP 请求
	req, _ := http.NewRequest("POST", "/api/v1/users", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	// 使用 httptest 记录 HTTP 响应
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// 检查 HTTP 状态码是否为 400（密码太弱）
	assert.Equal(t, http.StatusBadRequest, w.Code, "Expected HTTP 400")

	// 解析 JSON 响应
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err, "Response should be valid JSON")

	// 检查返回的错误消息
	assert.Equal(t, "Password is too weak. It must be at least 8 characters long, contain letters, numbers, and special characters.", response["error"], "Error message should indicate password weakness")
}

func TestCreateUserWithStrongPassword(t *testing.T) {
	// 初始化测试数据库
	TestSetupDatabase(t)

	// 设置 Gin 测试路由
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/v1/users", controllers.CreateUser)

	// 构造测试请求的 JSON 数据
	userData := map[string]string{
		"email":    "strongpassworduser@example.com",
		"nickname": "Strong Password User",
		"password": "SecureP@ssw0rd123!", // 强密码
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

	// 检查返回的消息
	assert.Equal(t, "success", response["message"], "Response message should be 'success'")
	assert.NotNil(t, response["data"], "Response should contain user data")

	// 检查数据库是否正确插入用户
	var createdUser models.User
	config.DB.Where("email = ?", "strongpassworduser@example.com").First(&createdUser)
	assert.Equal(t, "strongpassworduser@example.com", createdUser.Email, "User should be created in database")
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

// 测试创建 Note

// 模拟加密验证
// 假设这个是你实际的 HTTP 处理函数
func CreateNoteHandler(w http.ResponseWriter, r *http.Request) {
	// 解析请求体
	var reqData models.CreateNoteReq
	err := json.NewDecoder(r.Body).Decode(&reqData)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// 如果请求中的 Receivers 是一个有效的 JSON 数组，将其直接使用
	receiversJSON, err := json.Marshal(reqData.Receivers) // 假设 reqData.Receivers 是一个数组
	if err != nil {
		http.Error(w, "Error marshalling receivers", http.StatusInternalServerError)
		return
	}

	// 创建 note 实例
	note := models.Note{
		Title:     reqData.Title,
		Content:   reqData.Content,
		Password:  reqData.Password, // 你可以填充其他字段
		TTL:       reqData.TTL,
		Burn:      reqData.Burn,
		Receivers: receiversJSON, // 将 Receivers 填充为 JSON 格式
	}

	// 调用 services.CreateNotes 来处理业务逻辑
	resp, err := services.CreateNotes(note)
	if err != nil {
		http.Error(w, "Error creating note", http.StatusInternalServerError)
		return
	}

	// 将响应写入 http.ResponseWriter
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func encryptAndEncode(content string, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// 执行 AES-GCM 加密
	ciphertext := aesGCM.Seal(nonce, nonce, []byte(content), nil)

	// Base64 编码
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// 在测试时，你可以通过 httptest 来测试这个处理函数
func TestCreateNoteWithEncryption(t *testing.T) {

	TestSetupDatabase(t)
	config.EncryptionKey = []byte("01234567890123456789012345678901")

	// encryptedContent, err := encryptAndEncode("This is a test note content", config.EncryptionKey)
	// fmt.Println("加密后的内容:", encryptedContent)

	// require.NoError(t, err, "Content 加密失败")
	// 模拟请求数据
	requestData := map[string]interface{}{
		"title":     "Test Title",
		"content":   "context test",
		"password":  "abcd",
		"burn":      false,
		"receivers": []string{"example@example.com"},
		"ttl":       7,
	}
	reqBodyBytes, _ := json.Marshal(requestData)

	req := httptest.NewRequest(http.MethodPost, "/notes", bytes.NewBuffer(reqBodyBytes))
	req.Header.Set("Content-Type", "application/json")

	// 模拟响应
	rr := httptest.NewRecorder()

	// 这里调用 CreateNoteHandler，而不是直接使用 CreateNotes
	handler := http.HandlerFunc(CreateNoteHandler)
	handler.ServeHTTP(rr, req)
	fmt.Println("Response body:", rr.Body.String())

	// 验证响应状态码
	require.Equal(t, http.StatusOK, rr.Code, "Expected HTTP 200 OK but got %d", rr.Code)

	// 验证响应体内容
	var resp map[string]interface{}
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	// 确保返回的响应包含必要的字段
	assert.NotNil(t, resp["nid"])
	assert.Equal(t, resp["title"], "Test Title")
}
