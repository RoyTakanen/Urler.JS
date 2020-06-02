# Urler.JS
 Urler.JS on urlien lyhennysohjelma, joka käyttää Node.JS:ää ja MySQL:ää.

## Käyttäminen (Docker)

Siirrä alla oleva data tiedostoon nimeltä stack.yml:
```
version: '3.1'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: tVDYetk3Ms #Vaihda
       MYSQL_DATABASE: urlerjs
       MYSQL_USER: urlerjs
       MYSQL_PASSWORD: tVDYetk3Ms #Vaihda

   urlerjs:
     depends_on:
       - db
     image: kaikkitietokoneista/urlerjs:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       DB_HOST: db
       DB_USER: urlerjs
       DB_PASSWORD: tVDYetk3Ms
       DB_NAME: urlerjs
volumes:
    db_data: {}
```

```bash
docker-compose -f stack.yml up
```
