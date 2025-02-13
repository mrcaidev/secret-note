package common

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
	Success                 = 0
)
