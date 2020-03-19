const http = require('http');
const url = require('url');
const mysql = require('mysql');
const urlExists = require("url-exists");
const fs = require('fs');

const port = process.env.PORT || 8888;

function yhdistaluojatapa(id, newurl) {

  const yhdistys = mysql.createConnection({
    host: "54.37.8.79",
    user: "admin__urler",
    password: "bGkeEemdRS",
    database: "admin__urler"
  });

  yhdistys.connect(function(err) {
    if (err) throw err;

    var sql = "INSERT INTO urlit (lyhennetty, oikeaosoite) VALUES ('" + id + "', '" + newurl + "')";
    yhdistys.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Uusi Urler.JS urli tehty! :D");
      yhdistys.destroy();
    });
  });
}

function yhdistaetsijatapa(id, callback) {
  const yhdistys = mysql.createConnection({
    host: "54.37.8.79",
    user: "admin__urler",
    password: "bGkeEemdRS",
    database: "admin__urler"
  });

  yhdistys.connect(function(err) {
    if (err) throw err;

    var sql = "SELECT * FROM urlit WHERE lyhennetty='" + id + "';";
    yhdistys.query(sql, function (err, result, fields) {
      if (err) throw err;
      yhdistys.destroy();
      return callback(result[0].oikeaosoite);
    });
  });
}

function yhdistaetsiosajatapa(callback) {
  const yhdistys = mysql.createConnection({
    host: "54.37.8.79",
    user: "admin__urler",
    password: "bGkeEemdRS",
    database: "admin__urler"
  });

  yhdistys.connect(function(err) {
    if (err) throw err;

    var sql = "SELECT * FROM urlit ORDER BY oikeaosoite LIMIT 20;";
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
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Siirrä muutkin funktioiksi

http.createServer(function(req, res) {

  var query = url.parse(req.url, true)
  if (query.search != null) {
    if (query.query.new != null) {

      var newurl = query.query.new;

      urlExists(newurl, function(err, exists) {
        if (exists) {
          var id = luoid(6)

          yhdistaluojatapa(id, newurl);

          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write("Tehdään uutta lyhennettyä urlia osoitteelle: " + newurl + "\nOsoite: " + id);
          res.end("");
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('URLia ei ole olemassa');
          res.end('')
        }
      });
    } else if (query.query.go != null) {
      yhdistaetsijatapa(query.query.go, function(vastaus) {
        if (vastaus != undefined) {
          res.writeHead(301, {'Location' : vastaus});
          res.end('');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('Lyhennettyä Urlerl.JS urlia ei ole olemassa');
          res.end('');
        }
      });
    } else if (query.query.list != null) {
      yhdistaetsiosajatapa(function(vastaus) {
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.write(" " + JSON.stringify(vastaus));
        res.end("");
      })
    }
  } else {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync('index.html','utf8'))
    res.end("");

  }
}).listen(port);
