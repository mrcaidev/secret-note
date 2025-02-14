package common

import "strconv"

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	// `json:"data,omitempty"` omitempty means omit when it's empty
	Data interface{} `json:"data"`
}

const (
	Success                 = 0
	Error                   = -1
	EmailExists             = 1001
	WrongOtp                = 1002
	WrongOtpFlowIdOrExpired = 1003
	SendMailFailed          = 1004
	WrongEmail              = 1005
	WrongPassword           = 1006
	NotExistUser            = 1007
	InvalidUid              = 1008
	StatusUnauthorized      = 1009
)

func ErrCodeToString(code int) string {
	switch code {
	case EmailExists:
		return "EmailExists"
	case WrongOtp:
		return "WrongOtp"
	case WrongOtpFlowIdOrExpired:
		return "WrongOtpFlowIdOrExpired"
	case SendMailFailed:
		return "SendMailFailed"
	case Success:
		return "Success"
	case Error:
		return "Error"
	case WrongEmail:
		return "WrongEmail"
	case WrongPassword:
		return "WrongPassword"
	case NotExistUser:
		return "NotExistUser"
	case InvalidUid:
		return "InvalidUid"
	case StatusUnauthorized:
		return "StatusUnauthorized"
	default:
		return strconv.Itoa(code)
	}
}
