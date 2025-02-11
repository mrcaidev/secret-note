package models

import (
	"time"
)

type User struct {
	Uid       string    `json:"id" gorm:"type:char(36);primary_key"`
	Email     string    `json:"email"`
	Nickname  string    `json:"nickname"`
	AvatarUrl string    `json:"avatarUrl"`
	CreatedAt time.Time `json:"createdAt"`
	DeletedAt time.Time `json:"deletedAt"`
	Token     string    `json:"token"`
}
