package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type OauthReq struct {
	AccessToken string `json:"accessToken"`
}

type GoogleProviderResp struct {
	FamilyName    string `json:"family_name"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	GivenName     string `json:"given_name"`
	ID            string `json:"id"`
	VerifiedEmail bool   `json:"verified_email"`
}

type OauthResp struct {
}

func GetProviderUrl(provider string) string {
	if provider == "google" {
		return "https://www.googleapis.com/oauth2/v2/userinfo"
	}
	return ""
}

type Provider interface {
	Authenticate(token string) (GoogleProviderResp, bool)
}

// GoogleProvider implements the Provider interface for Google.
type GoogleProvider struct{}

func (g *GoogleProvider) Authenticate(token string) (GoogleProviderResp, bool) {
	// Google-specific authentication logic.
	fmt.Println("Authenticating using Google Provider")
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		log.Println("Failed to create request: %v", err)
		return GoogleProviderResp{}, false
	}
	req.Header.Add("Authorization", "Bearer "+token)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println("Failed to do request: %v", err)
		return GoogleProviderResp{}, false
	}
	//todo: learn more about defer
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := ioutil.ReadAll(resp.Body)
		//log.Fatalf will stop the service
		log.Println("Failed to get user info from Google provider: %v, %v", resp.StatusCode, string(bodyBytes))
		return GoogleProviderResp{}, false
	}

	var OauthResp GoogleProviderResp
	if err := json.NewDecoder(resp.Body).Decode(&OauthResp); err != nil {
		log.Println("Failed to decode response: %v", err)
		return GoogleProviderResp{}, false
	}

	return OauthResp, true
}

// ProviderFactory returns an instance of Provider based on the provider name.
func ProviderFactory(providerName string) (Provider, error) {
	switch providerName {
	case "google":
		return &GoogleProvider{}, nil
	default:
		return nil, errors.New("unsupported provider")
	}
}
