package db

const (
	QueryGetAllProjects = `
		SELECT id, name, location, status, start_date, end_date
		FROM projects;
	`

	QueryGetProjectByID = `
		SELECT id, name, location, status, start_date, end_date
		FROM projects WHERE id = $1;
	`

	QueryInsertProject = `
		INSERT INTO projects (name, location, status, start_date, end_date)
		VALUES ($1, $2, $3, $4, $5) RETURNING id;
	`

	QueryUpdateProject = `
		UPDATE projects
		SET name = $1, location = $2, status = $3, start_date = $4, end_date = $5
		WHERE id = $6;
	`

	QueryDeleteProject = `
		DELETE FROM projects WHERE id = $1;
	`
)
