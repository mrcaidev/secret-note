package services

import (
	"backend/config"
	"backend/models"
	"errors"
	"fmt"
	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"log"
)

const URL_PREFIX = "http://100.24.244.186:8080/api/v1/notes"

func CreateNotes(note models.Note) (models.CreateNoteResp, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(note.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.CreateNoteResp{}, err
	}
	note.Password = string(hashedPassword)
	note.Nid = uuid.New().String()
	note.Link = URL_PREFIX + note.Nid

	fmt.Println("Inserted Note: %d", note)
	result := config.DB.Create(&note)
	if result.Error != nil {
		log.Println(result.Error)
		var mysqlError *mysql.MySQLError
		if errors.As(result.Error, &mysqlError) && mysqlError.Number == 1062 {
			return models.CreateNoteResp{}, err
		}
	}

	var ret models.CreateNoteResp
	if err := copier.Copy(&ret, note); err != nil {
		return models.CreateNoteResp{}, err
	}
	return ret, nil
}
