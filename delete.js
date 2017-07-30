var client = require('./connection.js');

client.indices.delete({index: 'tab'},function(err,resp,status) {
  console.log("delete",resp);
});
