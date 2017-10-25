var client = require('./connection.js');

client.indices.create({
  index: 'tab',
  body: {
    "mappings": {
        "_default_": {
          "_timestamp": {
            "enabled": true,
            "store": true,
            "_field_names": "_timestamp"
          }
        }
    }
  }
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});
