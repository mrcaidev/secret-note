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
)

func CreateUser(user *models.User) (userRes models.UserResponse, existUser bool) {

	//todo:pwd salt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.UserResponse{}, false
	}
	user.Password = string(hashedPassword)
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
	ret.Token = genToken(user.Email)
	return ret, false

}

func GetUser(uid string) models.User {
	//get user by uid.
	var user models.User
	err := config.DB.Where("uid = ?", uid).First(&user).Error
	if err != nil {
		log.Printf("Error fetching user with uid: %s: %v", uid, err)
		return models.User{}
	}
	return user
}
