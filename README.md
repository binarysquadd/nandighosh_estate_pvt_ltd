### Run the server

```
make server-up
```

### Set up the local db

```
make db-up
make migrate-up
```

### Get the single file of Tailwind CSS

```
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v4.1.13/tailwindcss-linux-x64
chmod +x tailwindcss-linux-x64
./tailwindcss-linux-x64 -o tailwind-complete.css --content "**/*.{html,js,go}" --minify
```

### Get the siongle file of JQuery

```
curl -o jquery.min.js https://code.jquery.com/jquery-3.7.1.min.js
```

### The flow in which the project has been setup

```
DB schema first (light draft only) → defines the data you’ll manage.
API contract second → how the frontend will talk to backend.
Backend handlers next → implement API to hit the DB.
UI last → build on top of real APIs (not mocks).
```

### Setup golang-migrate CLI

```
curl -L https://github.com/golang-migrate/migrate/releases/latest/download/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/
migrate -version
```

### Database setup guide

- spinup the instance
- spinup a db in the instance
- setup the initial schema
- setup the seed data
- connect everything in docker compose and makefile

### Docs to look for

- Git commit standard - https://cbea.ms/git-commit/