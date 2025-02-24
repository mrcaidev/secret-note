package services

import (
	"backend/config"
	"backend/models"
	"errors"
	"fmt"
	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"log"
	"time"
)

const URL_PREFIX = "http://100.24.244.186:8080/api/v1/notes"

func CreateNotes(note models.Note) (models.CreateNoteResp, error) {

	note.Nid = uuid.New().String()
	note.Link = URL_PREFIX + note.Nid

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
	return ret, nil
}

func getNote(nid string, uid string) (models.GetNoteResp, error) {
	return models.GetNoteResp{}, nil
}
