package config

import (
	"github.com/patrickmn/go-cache"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"time"
)

var DB *gorm.DB

var Cache *cache.Cache

func ConnectDatabase() {
	//change device, missing db.
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to database")
}

func SetupCache() {
	Cache = cache.New(5*time.Minute, 10*time.Minute)
}

func Init() {
	ConnectDatabase()
	SetupCache()
}
