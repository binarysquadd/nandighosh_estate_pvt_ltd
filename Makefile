server-up:
	go run ./backend/cmd/server

db-up:
	docker compose up -d

db-down:
	docker compose down

DB_URL=postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable
MIGRATIONS_PATH=backend/internal/db/migrations

migrate-up:
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up

migrate-down:
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down 1

migrate-new:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $$name

seed-up:
	psql $(DB_URL) -f backend/internal/db/dev.sql

db-reset:
	docker compose down -v
	docker compose up -d postgres
	sleep 3 # wait for DB
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up
