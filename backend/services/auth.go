package services

import (
	"backend/common"
	"backend/models"
	"fmt"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"log"
	"math/rand"
	"net/smtp"
	"time"

	"backend/config"
	"github.com/golang-jwt/jwt"
	"github.com/patrickmn/go-cache"
)

func genCode() string {
	rand.Seed(time.Now().UnixNano())
	code := rand.Intn(900000) + 100000
	return fmt.Sprintf("%04d", code)
}

var c = config.Cache

func SendOtp(toEmail string) (string, error) {
	//config setup
	from := "yongwenzhou2022@gmail.com"
	password := config.GmailPassword
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	//content
	verificationCode := genCode()
	subject := "Subject: secret-note verificationCode\r\n"
	body := verificationCode
	message := []byte(subject + "\r\n" + body)

	// 设置认证信息
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// 发送邮件
	// 只负责发送给SMTP服务器，目标邮箱是否合法不是这个代码的负责内容，是SMTP服务器负责的
	//todo: sending time interval
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, message)
	if err != nil {
		log.Fatal("send email failed:", err)
	}
	fmt.Println("send email success")

	//var Cache = cache.New(5*time.Minute, 10*time.Minute)
	// cause cache.New return a point, so var Cache is a point
	// so var c is a point
	// no need use & (take the address of a variable)
	// * is pointer dereferencing
	// ?wrong todo  line21 can not use, why

	var otpFlowId = uuid.New().String()
	config.Cache.Set(otpFlowId, verificationCode, cache.DefaultExpiration)
	return otpFlowId, err
}

func VerifyOtp(otpFlow models.OtpFlow) int {
	if trueCode, found := config.Cache.Get(otpFlow.OtpFlowId); found {
		if cacheCode, ok := trueCode.(string); ok {
			fmt.Println(cacheCode)
		}
		if trueCode == otpFlow.Otp {
			fmt.Println("verify otpFlow success")
			config.Cache.Delete(otpFlow.OtpFlowId)
			return common.Success
		} else {
			fmt.Println("verify otpFlow fail")
			return common.WrongOtp
		}
	} else {
		fmt.Printf("user %s otpFlow not found or expired\n", otpFlow.Otp)
		return common.WrongOtpFlowIdOrExpired
	}
}

func Signin(request models.LoginRequest) (models.UserResponse, string, int) {
	var user models.User
	//sql inject?
	err := config.DB.Where("email = ?", request.Email).First(&user).Error
	var userResponse models.UserResponse
	if err := copier.Copy(&userResponse, user); err != nil {
		return models.UserResponse{}, "", common.Error
	}
	if err != nil {
		log.Println("Failed to get user with email: %s: %v", request.Email, err)
		return userResponse, "WrongEmail", common.WrongEmail
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		log.Println("wrong password: %v", err)
		return userResponse, "WrongPassword", common.WrongPassword
	}
	var tokenString = genToken(user.Uid, request.Email)
	userResponse.Token = tokenString
	return userResponse, tokenString, common.Success
}

func SignByOauth(accessToken string, name string) models.OauthResp {
	provider, err := models.ProviderFactory(name)
	if err == nil {
		OauthResp := provider.Authenticate(accessToken)
		return OauthResp
	}
	return models.OauthResp{}
}

func genToken(uid string, email string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"uid":   uid,
		"email": email,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	})
	tokenString, err := token.SignedString(config.JwtSecret)
	if err != nil {
		return "error"
	}
	return tokenString
}
