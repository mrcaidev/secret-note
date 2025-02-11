package services

import (
	"backend/config"
	"backend/models"
	"log"
)

func CreateUser(newUser models.User) models.User {
	//insert into database
	return newUser
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
