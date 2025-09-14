package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	host := "localhost"
	port := 5432
	user := "postgres"
	password := "postgres"
	dbname := "postgres"
	sslmode := "disable"

	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode,
	)
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database not reachable: ", err)
	}
	log.Println("Connected to Postres")
}
