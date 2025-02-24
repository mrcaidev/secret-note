package models

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"time"
)

type Note struct {
	Nid     string `json:"nid"`
	Title   string `json:"title"`
	Content string `json:"content"`

	// 外键字段，关联 User 的 UID
	AuthorID string `gorm:"size:255;not null" json:"author_id"`
	// 指定关联关系，foreignKey 表示当前结构体的外键字段，references 表示关联的 User 表的主键
	Author    Author    `gorm:"foreignKey:AuthorID;references:UID" json:"author"`
	Link      string    `json:"link"`
	CreatedAt time.Time `json:"created_at"`
	Password  string    `json:"password"`
	Burn      bool      `json:"burn"`
	// Number of days before auto-deletion, 1-365. 0 means never expiring.
	TTL       int            `json:"ttl"`
	Receivers datatypes.JSON `gorm:"type:json" json:"receivers"`
}

type Author struct {
	// 被Note的Author关联
	UID       string `json:"uid"`
	NickName  string `json:"nickName"`
	AvatarUrl string `json:"avatarUrl"`
}

type CreateNoteReq struct {
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	Password  string   `json:"password"`
	Burn      bool     `json:"burn"`
	Receivers []string `json:"receivers"`
	TTL       int      `json:"ttl"`
}

type CreateNoteResp struct {
	Nid     string `json:"nid"`
	Title   string `json:"title"`
	Content string `json:"content"`

	// 外键字段，关联 User 的 UID
	AuthorID string `gorm:"size:255;not null" json:"author_id"`
	// 指定关联关系，foreignKey 表示当前结构体的外键字段，references 表示关联的 User 表的主键
	Author   Author    `gorm:"foreignKey:AuthorID;references:UID" json:"author"`
	Link     string    `json:"link"`
	CreateAt time.Time `json:"create_at"`
	Burn     bool      `json:"burn"`
	// Number of days before auto-deletion, 1-365. 0 means never expiring.
	TTL       int      `json:"ttl"`
	Receivers []string `gorm:"type:json" json:"receivers"`
}

type GetNoteResp struct {
	Nid      string    `json:"nid"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Author   Author    `json:"author"`
	Link     string    `json:"link"`
	CreateAt time.Time `json:"create_at"`
}

func (u *Note) BeforeCreate(_ *gorm.DB) (err error) {
	if u.Nid == "" {
		u.Nid = uuid.New().String()
	}
	return
}
