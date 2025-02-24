package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type User struct {
	Uid       string         `json:"id" gorm:"type:char(36);primary_key"`
	Email     string         `json:"email"`
	Nickname  string         `json:"nickname"`
	Password  string         `json:"password"`
	AvatarUrl string         `json:"avatarUrl"`
	CreatedAt time.Time      `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt"`
	//Token     string         `json:"token" gorm:"-"`
}

type UserResponse struct {
	Uid       string         `json:"id" gorm:"type:char(36);primary_key"`
	Email     string         `json:"email"`
	Nickname  string         `json:"nickname"`
	AvatarUrl string         `json:"avatarUrl"`
	CreatedAt time.Time      `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt"`
	Token     string         `json:"token" gorm:"-"`
}

func TransferFromGoogleRespToUser(resp GoogleProviderResp) User {
	user := User{
		Email:     resp.Email,
		Nickname:  resp.Name,
		AvatarUrl: resp.Picture,
	}
	return user
}

func (u *User) BeforeCreate(_ *gorm.DB) (err error) {
	if u.Uid == "" {
		u.Uid = uuid.New().String()
	}
	return
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
