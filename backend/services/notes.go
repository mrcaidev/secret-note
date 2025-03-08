package services

import (
	"backend/common"
	"backend/config"
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"log"
	"slices"
	"time"
)

const URL_PREFIX = "http://localhost:8081/"

func CreateNotes(note models.Note) (models.CreateNoteResp, error) {

	note.Nid = uuid.New().String()
	note.Link = URL_PREFIX + note.Nid
	content := note.Content
	fmt.Println("Inserted Note: %d", note)
	result := config.DB.Create(&note)
	if result.Error != nil {
		log.Println(result.Error)
		var mysqlError *mysql.MySQLError
		if errors.As(result.Error, &mysqlError) && mysqlError.Number == 1062 {
			return models.CreateNoteResp{}, result.Error
		}
	}
	if note.TTL != 0 {
		config.Cache.Set(note.Nid, config.VALID, time.Hour*24*time.Duration(note.TTL))
	}

	var ret models.CreateNoteResp

	if err := copier.Copy(&ret, note); err != nil {
		return models.CreateNoteResp{}, err
	}
	var author models.Author
	err := config.DB.Where("uid = ?", note.AuthorID).First(&author).Error
	if err != nil {
		return ret, err
	}
	ret.Content = content
	ret.Author = author
	return ret, nil
}

func GetNote(nid string, uid string, password string) (ret models.GetNoteResp, code int) {
	//get note by nid
	var note models.Note
	err := config.DB.Preload("Author").Where("nid = ?", nid).First(&note).Error
	if err != nil {
		log.Printf("Note not found: %s: %v", uid, err.Error())
		return models.GetNoteResp{}, common.NoteNotFound
	}

	//receivers
	receivers, err := GetReceiversArr(note.Receivers)
	if err != nil {
		return models.GetNoteResp{}, common.WrongReceivers
	}
	var user models.User
	err = config.DB.Where("uid = ?", uid).First(&user).Error
	if err != nil {
		log.Printf("wrong uid: %s: %v", uid, err.Error())
	}
	if len(receivers) != 0 && !slices.Contains(receivers, user.Email) && note.AuthorID != uid {
		return models.GetNoteResp{}, common.NotTargetReceiver
	}

	//Password
	if len(note.Password) != 0 && note.Password != password {
		return models.GetNoteResp{}, common.WrongPassword
	}

	//TTL
	expirationTime := note.CreatedAt.AddDate(0, 0, note.TTL)
	if time.Now().After(expirationTime) {
		return models.GetNoteResp{}, common.ExpiredNote
	}

	//judge if has permission
	//burn
	if note.Burn {
		var burnRecord models.BurnRecord
		// 不能写 & 得用AND
		err = config.DB.Where("uid = ? AND nid = ?", uid, nid).First(&burnRecord).Error
		//如果没有找到，burnRecord是什么，是nil吗?
		//burnRecord 是一个结构体的实例，不是指针，所以即使没有找到记录，它也不会是 nil，而是会保持其零值状态
		if errors.Is(err, gorm.ErrRecordNotFound) {
			//not burned, then burn
			config.DB.Create(models.BurnRecord{
				NID: nid, UID: uid, CreatedAt: time.Now(),
			})
		} else if err != nil {
			log.Println(err.Error())
			return models.GetNoteResp{}, common.Error
		} else {
			// was burned
			return models.GetNoteResp{}, common.NoteWasBurned
		}
	}
	err = copier.CopyWithOption(&ret, note, copier.Option{DeepCopy: true})
	if err != nil {
		return models.GetNoteResp{}, common.Error
	}
	return ret, common.Success
}

// GetReceiversArr when write receivers in signature, defines a variable
func GetReceiversArr(jsonData datatypes.JSON) (receivers []string, err error) {
	if err := json.Unmarshal(jsonData, &receivers); err != nil {
		return receivers, err
	}
	return receivers, nil
}

// GetNotesByAuthor 根据指定 uid 获取 Note 列表
