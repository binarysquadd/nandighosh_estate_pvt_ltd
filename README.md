### Run the server

```
make server-up
```

### Manage up the local db

```
make db-up
make db-down
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