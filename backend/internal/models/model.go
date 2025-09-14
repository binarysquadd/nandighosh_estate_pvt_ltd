package models

type Project struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Location  string `json:"location"`
	Status    string `json:"status"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type Tenant struct {
	ID        int    `json:"id"`
	ProjectID int    `json:"project_id"`
	Name      string `json:"name"`
	Contact   string `json:"contact"`
}

type Payment struct {
	ID        int     `json:"id"`
	ProjectID int     `json:"project_id"`
	TenantID  int     `json:"tenant_id"`
	Amount    float64 `json:"amount"`
	DueDate   string  `json:"due_date"`
	PaidAt    *string `json:"paid_at"`
	Status    string  `json:"status"`
}

type Document struct {
	ID        int    `json:"id"`
	ProjectID int    `json:"project_id"`
	FilePath  string `json:"file_path"`
	Uploaded  string `json:"uploaded_at"`
}
