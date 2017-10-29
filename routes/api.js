module.exports = function(app) {
  var express = require('express');
  var router = express.Router();
  var client = require('../connection.js');
  /* GET users listing. */
  router.get('/d', function(req, res, next) {
    client.search({
      index: 'tab',
      type: 'page',
      body: {
        sort : "_timestamp",
        size : 10000,
        fields: ["_timestamp", "_source"],
        query: {
          match_all : {}
        },
      }
    }, function(error, response, status) {
      if (error) {
        console.log("search error: " + error)
      } else {
        res.send(JSON.stringify(response.hits.hits))
      }
    });
  });

  router.get('/tab/length', function(req, res, next) {
    client.search({
      index: 'tab',
      type: 'page',
      body: {
        sort : "_timestamp",
        size : 10000,
        fields: ["_timestamp", "_source"],
        query: {
          match_all : {}
        },
      }
    }, function(error, response, status) {
      if (error) {
        console.log("search error: " + error)
      } else {
        res.send(JSON.stringify(response.hits.hits.length))
      }
    });
  });

  router.get('/datetime', function(req, res, next) {
    var q = req.query.q;
    client.search({
      index: 'tab',
      type: 'page',
      body: {
        sort : "_timestamp",
        size : 10000,
        fields: ["_timestamp", "_source"],
        query: {
          match: {
            "DateTime": {
              "query": q,
              "operator": "or",
              "minimum_should_match": 10,
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
        var total = response.hits.total;
        res.send(JSON.stringify(response.hits.hits))
      }
    });
  });

  return router;
}
