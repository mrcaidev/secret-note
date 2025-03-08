package models

import (
	"backend/config"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"io"
	"time"
)

type Note struct {
	Nid     string `gorm:"column:nid" json:"id"`
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

func (u *Note) BeforeCreate(_ *gorm.DB) (err error) {
	if u.Nid == "" {
		u.Nid = uuid.New().String()
	}
	return
}

type Author struct {
	// 被Note的Author关联
	UID       string `gorm:"column:uid" json:"id"`
	NickName  string `json:"nickname" gorm:"column:nickname"`
	AvatarUrl string `json:"avatarUrl" gorm:"column:avatar_url"`
}

// related to users table
func (Author) TableName() string {
	return "users"
}

type BurnRecord struct {
	UID       string    `gorm:"column:uid" json:"uid"`
	NID       string    `gorm:"column:nid" json:"nid"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
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
	Nid     string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`

	// 外键字段，关联 User 的 UID
	//AuthorID string `gorm:"size:255;not null" json:"author_id"`
	// 指定关联关系，foreignKey 表示当前结构体的外键字段，references 表示关联的 User 表的主键
	Author    Author     `gorm:"foreignKey:AuthorID;references:UID" json:"author"`
	Link      string     `json:"link"`
	CreatedAt time.Time  `gorm:"created_at"  json:"createdAt"`
	DeletedAt *time.Time `gorm:"deleted_at"  json:"deletedAt"`
	Password  string     `json:"password"`
	Burn      bool       `json:"burn"`
	// Number of days before auto-deletion, 1-365. 0 means never expiring.
	TTL       int      `json:"ttl"`
	Receivers []string `gorm:"type:json" json:"receivers"`
}

type GetNoteReq struct {
	Password string `json:"password"`
}

type GetNoteResp struct {
	Nid       string    `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Author    Author    `json:"author"`
	Link      string    `json:"link"`
	CreatedAt time.Time `gorm:"create_at" json:"createdAt"`
}

type GetAllNoteResp struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Author    Author    `json:"author"`
	CreatedAt time.Time `json:"createdAt"`
}

type GetAllNoteListResp struct {
	Notes      []GetAllNoteResp `json:"notes"`
	NextCursor string           `json:"nextCursor"`
}

func encrypt(plaintext, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nounce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nounce); err != nil {
		return nil, err
	}

	ciphertext := aesGCM.Seal(nounce, nounce, plaintext, nil)
	return ciphertext, nil
}

// decrypt 对密文进行解密，要求密文必须包含生成的 nonce
func decrypt(ciphertext, key []byte) ([]byte, error) {
	// 创建 AES 加密器
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// 使用 GCM 模式
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, fmt.Errorf("密文太短")
	}

	// 分离出 nonce 和真正的密文数据
	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}

func (n *Note) BeforeSave(tx *gorm.DB) (err error) {
	encrypted, err := encrypt([]byte(n.Content), config.EncryptionKey)
	if err != nil {
		return err
	}
	// 将加密结果存储为字符串（或做 base64 编码）
	n.Content = string(encrypted)
	return nil
}

func (n *Note) AfterFind(tx *gorm.DB) (err error) {
	decrypted, err := decrypt([]byte(n.Content), config.EncryptionKey)
	if err != nil {
		return err
	}
	n.Content = string(decrypted)
	return nil
}
