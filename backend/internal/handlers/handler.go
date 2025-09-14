package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"nandighosh_real_estates.com/backend/internal/db"
	"nandighosh_real_estates.com/backend/internal/models"
)

// GET /projects
func GetProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(db.QueryGetAllProjects)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Name, &p.Location, &p.Status, &p.StartDate, &p.EndDate); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// GET /projects/{id}
func GetProjectByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid project ID", 400)
		return
	}

	var p models.Project
	err = db.DB.QueryRow(db.QueryGetProjectByID, id).
		Scan(&p.ID, &p.Name, &p.Location, &p.Status, &p.StartDate, &p.EndDate)
	if err != nil {
		http.Error(w, "Project not found", 404)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}
