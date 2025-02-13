package common

import "strconv"

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	// `json:"data,omitempty"` omitempty means omit when it's empty
	Data interface{} `json:"data"`
}

const (
	EmailExists             = 1001
	WrongOtp                = 1002
	WrongOtpFlowIdOrExpired = 1003
	SendMailFailed          = 1004
	Success                 = 0
	Error                   = -1
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
	default:
		return strconv.Itoa(code)
	}
}
