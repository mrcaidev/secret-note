package config

import (
	"encoding/base64"
	"github.com/joho/godotenv"
	"github.com/patrickmn/go-cache"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

const UID = "UID"
const TOKEN = "TOKEN"
const VALID = "VALID"

var DB *gorm.DB

var Cache *cache.Cache
var JwtSecret []byte
var GmailPassword string
var dsn string
var EncryptionKey []byte

const INVALID_TOKEN = "INVALID_TOKEN"

func connectDatabase() {
	//change device, missing db.
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to database")
}

func setupCache() {
	Cache = cache.New(5*time.Minute, 720*time.Hour)
}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	GmailPassword = os.Getenv("GMAIL_PASSWORD")
	dsn = os.Getenv("DSN")
	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	EncodedEncryptionKey := os.Getenv("ENCRYPTION_KEY")
	EncryptionKey, err = base64.StdEncoding.DecodeString(EncodedEncryptionKey)
	if err != nil {
		panic(err)
	}
}

func SetInvalidToken(token string) {
	Cache.Set(INVALID_TOKEN+token, "invalid token", time.Hour*72)
}
func JudgeTokenInvalid(tokenString string) bool {
	var _, invalidToken = Cache.Get(INVALID_TOKEN + tokenString)
	return invalidToken
}

func Init() {
	loadEnv()
	connectDatabase()
	setupCache()
}
