package main

import (
	"backend/config"
	"backend/routers"
	"log"
)

func main() {
	config.ConnectDatabase()
	router := routers.InitRouter()
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
