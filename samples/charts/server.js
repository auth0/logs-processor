var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var _ = require('lodash');

var processor = require('auth0-logs-processor').create({
  domain: 'MY_AUTH0_DOMAIN',
  clientId: 'MY_AUTH0_CLIENT',
  clientSecret: 'MY_AUTH0_SECRET'
});

var entries = [], groups;

processor.each(function(entry){
  entries.push(entry);
});

processor.done(function(){
  groups = _.chain(entries)
    .filter(function(e){
      return e.type === 's'
    })
    .groupBy(function(e){
      return e.strategy;
    })
    .value();

  console.log('server ready!!!');
});

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  if (!groups) { return res.end(500); }
  var data = [];
  _.forOwn(groups, function(value, key) {
    data.push({ label: key, value: value.length });
  });

  fs.readFile(path.join(__dirname, 'pie.html'), function (err, template) {
    if (err) { throw err; }
    res.end(template.toString().replace('{{data}}', JSON.stringify(data)));
  });
})

var server = app.listen(11111, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('server listening at http://%s:%s, please wait...', host, port)
});

processor.start();