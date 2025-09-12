package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func serveIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join("frontend", "index.html"))
}

func main() {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Serve index.html at root
	r.Get("/", serveIndex)

	// Serve all static files under /static/*
	fileServer := http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join("frontend", "static"))))
	r.Handle("/static/*", fileServer)

	// Start server
	log.Println("Server starting on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
