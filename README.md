# Urler.JS
 Urler.JS on urlien lyhennysohjelma, joka käyttää Node.JS:ää ja MySQL:ää.

## Käyttäminen (Docker)

Siirrä alla oleva data tiedostoon nimeltä stack.yml:
```yml
version: '3.1'

services:
   db:
     container_name: Urler.JS-MySQL
     image: mysql:5.7
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: tVDYetk3Ms #Vaihda
       MYSQL_DATABASE: urlerjs
       MYSQL_USER: urlerjs
       MYSQL_PASSWORD: tVDYetk3Ms #Vaihda

   urlerjs:
     container_name: Urler.JS-HTTP
     depends_on:
       - db
     image: kaikkitietokoneista/urlerjs:latest
     ports:
       - "8888:8888"
     restart: always
     environment:
       DB_HOST: db
       DB_USER: urlerjs
       DB_PASSWORD: tVDYetk3Ms
       DB_NAME: urlerjs
```

```bash
docker-compose -f stack.yml up
```
