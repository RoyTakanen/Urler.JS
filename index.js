const url = require('url');
const mysql = require('mysql');
const urlExists = require("url-exists");
const fs = require('fs');
const express = require('express');
const path = require('path');


const app = express();
const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env;

const yhdistystiedot = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}

const yhdistys = mysql.createConnection(yhdistystiedot);

yhdistys.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  let createTodos = `CREATE TABLE if not exists urlit (lyhennetty VARCHAR(255), oikeaosoite VARCHAR(255));`;
  yhdistys.query(createTodos, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  yhdistys.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
});


function yhdistaluojatapa(id, newurl) {

  const yhdistys = mysql.createConnection(yhdistystiedot);

  yhdistys.connect(function(err) {
    if (err) throw err;

    let sql = "INSERT INTO urlit (lyhennetty, oikeaosoite) VALUES ('" + id + "', '" + newurl + "')";
    yhdistys.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Uusi Urler.JS urli tehty! :D");
      yhdistys.destroy();
    });
  });
}

function yhdistaetsijatapa(id, callback) {
  const yhdistys = mysql.createConnection(yhdistystiedot);

  yhdistys.connect(function(err) {
    if (err) throw err;

    let sql = "SELECT * FROM urlit WHERE lyhennetty='" + id + "';";
    yhdistys.query(sql, function (err, result, fields) {
      if (err) throw err;
      yhdistys.destroy();
      return callback(result[0].oikeaosoite);
    });
  });
}

function yhdistaetsiosajatapa(callback) {
  const yhdistys = mysql.createConnection(yhdistystiedot);

  yhdistys.connect(function(err) {
    if (err) throw err;

    let sql = "SELECT * FROM urlit ORDER BY oikeaosoite LIMIT 20;";
    yhdistys.query(sql, function (err, result, fields) {
      if (err) throw err;
      yhdistys.destroy();
      return callback(result);
    });
  });
}

/* Testi
yhdistaetsijatapa("CzDxSK", function(vastaus) {
  console.log(vastaus);
}); */

function luoid(length) { //Tee oma versio. Tällä hetkellä kiitos Stackoverflow
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Siirrä muutkin funktioiksi

app.get('/',function (req, res) {
  res.render('index')
});

//app.get('/new/:url',function (req, res) {
//let newurl = req.params.url;
app.get('/new',function (req, res) {
  let newurl = req.query.url;
  urlExists(newurl, function(err, exists) {
    if (exists) {
      let id = luoid(6)

      yhdistaluojatapa(id, newurl);

      res.render('luotu', {
        uri: `https://${host}/go?id=${id}`
      })
    } else {
      res.render('eioleolemassa')
    }
  });
});

//app.get('/go/:id', function (req, res) {
//  if (req.params.id) {
app.get('/go', function (req, res) {
  let id = req.query.id;
  if (id) {
    try {
      yhdistaetsijatapa(id, function(vastaus) {
        if (vastaus != undefined) {
          res.redirect(301,vastaus)
        } else {
          res.render('eioleolemassa')
        }
      });
    } catch (e) {
      res.render('eioleolemassa')
    }
  } else {
    res.redirect(301,'/')
  }
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

console.log("Palvelin portissa " + port);
