package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"nandighosh_real_estates.com/backend/internal/db"
	"nandighosh_real_estates.com/backend/internal/handlers"
)

func serveIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join("frontend", "index.html"))
}

func main() {
	db.Connect()
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Get("/", serveIndex)
	r.Route("/projects", func(r chi.Router) {
    r.Get("/", handlers.GetProjects)       // list
    // r.Post("/", handlers.CreateProject)    // create
    r.Get("/{id}", handlers.GetProjectByID) // get one
    // r.Put("/{id}", handlers.UpdateProject)  // update
    // r.Delete("/{id}", handlers.DeleteProject) // delete
})


	// Serve all static files under /static/*
	fileServer := http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join("frontend", "static"))))
	r.Handle("/static/*", fileServer)

	// Start server
	log.Println("Server starting on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
