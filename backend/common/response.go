package common

import "strconv"

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	// `json:"data,omitempty"` omitempty means omit when it's empty
	Data interface{} `json:"data"`
}

const (
	Success                     = 0
	Error                       = -1
	EmailExists                 = 1001
	WrongOtp                    = 1002
	WrongOtpFlowIdOrExpired     = 1003
	SendMailFailed              = 1004
	WrongEmail                  = 1005
	WrongPassword               = 1006
	NotExistUser                = 1007
	InvalidUid                  = 1008
	StatusUnauthorized          = 1009
	BadReq                      = 1010
	FailedToRequestFromProvider = 1011
	NoteNotFound                = 1012
	NoteWasBurned               = 1013
	WrongReceivers              = 1014
	NotTargetReceiver           = 1015
	ExpiredNote                 = 1016
	InvalidPassword             = 1017
)

func BadRequest() Response {
	return Response{
		Code:    BadReq,
		Message: "Bad Request",
		Data:    nil,
	}
}

func ErrCodeToString(code int) string {
	switch code {
	case EmailExists:
		return "This email has already been registered"
	case WrongOtp:
		return "Incorrect OTP"
	case WrongOtpFlowIdOrExpired:
		return "OTP has expired"
	case SendMailFailed:
		return "Failed to send email"
	case Success:
		return "Success"
	case Error:
		return "Unknown error. Please try again later"
	case WrongEmail:
		return "This email has not yet been registered"
	case WrongPassword:
		return "Incorrect password"
	case NotExistUser:
		return "This user does not exist"
	case InvalidUid:
		return "Invalid UID"
	case StatusUnauthorized:
		return "Please sign in first"
	case BadReq:
		return "Bad Request"
	case FailedToRequestFromProvider:
		return "Oops! We had some issues communicating with the OAuth provider"
	case NoteNotFound:
		return "This note does not exist"
	case NoteWasBurned:
		return "This note does not exist"
	case WrongReceivers:
		return "This note does not exist"
	case NotTargetReceiver:
		return "This note does not exist"
	case ExpiredNote:
		return "This note does not exist"
	case InvalidPassword:
		return "This note does not exist"
	default:
		return strconv.Itoa(code)
	}
}
