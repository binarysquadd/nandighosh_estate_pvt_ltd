db-up:
	docker compose up -d

db-down:
	docker compose down

server-up:
	go run ./backend/cmd/server
