module.exports = function(app) {
  var express = require('express');
  var router = express.Router();
  var mysql = require('mysql');
  var dbconfig = require('../database.js');
  var conn = mysql.createConnection(dbconfig);
  const screenshot = require('screenshot-stream');
  const stream = require('stream');
  var MetaInspector = require('node-metainspector');
  var request = require('request').defaults({
    encoding: null
  });
  //var screenshot = require('url-to-screenshot');
  var client = require('../connection.js');
  var fs = require('fs');

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    client.search({
      index: 'tab',
      type: 'page',
      body: {
        sort : "_score",
        size : 10000,
        query: {
          match_all : {}
        },
      }
    }, function(error, response, status) {
      if (error) {
        console.log("search error: " + error)
      } else {
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        console.log(response.hits.hits)
        var total = response.hits.total;
        res.render('index', {
          title: '탭스토리지',
          total : total
        });
      }
    });
  });
  router.get('/ex', function(req, res, next) {
    res.send('df')
  });

  router.get('/show', function(req, res, next) {
    var sql = "SELECT * FROM tab";

    conn.query(sql, function(error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.render('show', {
          tabs: results
        });
      }
    });
  });

  router.post('/pages', function(req, res, next) {
    var tabs = req.body.pages;
    var length = tabs.length;
    console.log(tabs[0].url)
    for (var i = 0; i < length; i++) {
      var title = tabs[i].title;
      var url = tabs[i].url;
      client.index({
        index: 'tab',
        type: 'page',
        body: {
          "PageTitle": title,
          "PageUrl": url
        }
      }, function(err, resp, status) {
        console.log(resp);
      });
    }
    res.end('{"success" : "Updated Successfully", "status" : 200}');
  });

  router.get('/search', function(req, res, next) {
    var q = req.query.q;
    console.log(q);
    client.search({
      index: 'tab',
      type: 'page',
      body: {
        sort : "_score",
        query: {
          match: {
            "PageTitle": {
              "query" : q,
              "operator": "or",
              "minimum_should_match": 2,
              "fuzziness": "AUTO"
            }
          }
        },
      }
    }, function(error, response, status) {
      if (error) {
        console.log("search error: " + error)
      } else {
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        console.log(response.hits.hits)
        res.render('search', {
          tabs: response.hits.hits
        });
        /*
        response.hits.hits.forEach(function(hit) {
          console.log(hit);
        })
        */
      }
    });
  });

  router.get('/img', function(req, res, next) {
    var url = req.query.url;
    var nullImage = 'http://support.yumpu.com/en/wp-content/themes/qaengine/img/default-thumbnail.jpg'
    var client = new MetaInspector(url, {
      timeout: 5000
    });

    client.on("fetch", function() {
      //console.log("image: " + client.image);
      //res.end(client.image);
      if (client.image) {
        request(client.image).on('error', function(chunk) {})
        request(client.image).pipe(res);
      } else {
        request(nullImage).on('error', function(chunk) {})
        request(nullImage).pipe(res);
      }

    });

    client.on("error", function(err) {
      console.log("err!!!" + err);
      request(nullImage).on('error', function(chunk) {})
      request(nullImage).pipe(res);
    });

    client.fetch();

    /*
    const roundedCornerResizer =
      sharp()
        .resize(256, 192)
    const stream = screenshot(url, '1024x768', {crop: true});
    //console.log(stream)
    stream.on('error', function(chunk) {
      res.end()
    })
    stream.pipe(roundedCornerResizer).pipe(res);
    */

    /*
    screenshot.prototype.sslCertificatesPath = function(url) {
      this._sslCertificatesPath = url;
      return this;
    };
    screenshot(url)
      .clip()
      .capture(function(err, img) {
        //if (err) throw err;
        //fs.writeFileSync(__dirname + '/example.png', img);
        res.end(img)
        console.log(img);
      });
      */
  });
  return router;
}
