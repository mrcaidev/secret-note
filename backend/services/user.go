package services

import (
	"backend/config"
	"backend/models"
	"errors"
	"fmt"
	"github.com/go-sql-driver/mysql"
	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"log"
	"time"
)

func CreateUser(user *models.User) (userRes models.UserResponse, existUser bool) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.UserResponse{}, false
	}
	user.Password = string(hashedPassword)
	user.Provider = "email"
	fmt.Println("Inserted User: %d", user)
	result := config.DB.Create(&user)
	if result.Error != nil {
		log.Println(result.Error)
		//try to transfer from result.Error to MySQLError, it's possible wrong so use 'ok' to receive the transfer result
		//if ok, means transition success.
		//if mysqlError, ok := result.Error.(*mysql.MySQLError); ok && mysqlError.Number == 1062 {
		//}
		var mysqlError *mysql.MySQLError
		if errors.As(result.Error, &mysqlError) && mysqlError.Number == 1062 {
			return models.UserResponse{}, true
		}
	}

	var ret models.UserResponse
	if err := copier.Copy(&ret, user); err != nil {
		return models.UserResponse{}, false
	}
	ret.Token = genToken(user.Uid, user.Email)
	return ret, false

}

func GetUser(uid string) (models.UserResponse, error) {
	//get user by uid.
	var user models.User
	err := config.DB.Where("uid = ?", uid).First(&user).Error
	if err != nil {
		log.Printf("Error fetching user with uid: %s: %v", uid, err)
		return models.UserResponse{}, err
	}
	var ret models.UserResponse
	if err := copier.Copy(&ret, user); err != nil {
		return models.UserResponse{}, err
	}
	return ret, err
}

var DELEATED = "DELETED_AT"

func DeleteMe(uid string, token string) {
	var user models.User
	config.DB.First(&user, "uid = ?", uid)
	// 如果user为空，会尝试删除所有，但是因为安全检查所以不会删
	config.DB.Model(&user).Updates(map[string]interface{}{
		"email":      user.Email + DELEATED + time.Now().String(), // 你想更新的字段
		"deleted_at": time.Now(),                                  // 软删除字段（注意：确保你的模型 DeletedAt 字段类型为 gorm.DeletedAt）
	})

	//不同于ThreadLocal，c的上下文必须显式传递
	config.SetInvalidToken(token)
}
