auth0-logs-processor
========
A small module that simplifies the processing of Auth0 logs.

>The amount of days logs are available depends on your Auth0 plan.

Installing
------------
```Shell
npm install auth0-logs-processor
```

Usage
------------
If you want to count how many logs you have
```javascript
var processor = require('auth0-logs-processor').create({
    domain: 'MY_AUTH0_DOMAIN',
    clientId: 'MY_AUTH0_CLIENT',
    clientSecret: 'MY_AUTH0_SECRET',
});

var count = 0;

processor.each(function(log){
    count++;
});

processor.done(function(){
    console.log(count);
});

processor.start();
```

Available in the [samples](samples) folder, monthly signup per app:
```javascript
var processor = require('auth0-logs-processor').create({
  domain: 'MY_AUTH0_DOMAIN',
  clientId: 'MY_AUTH0_CLIENT',
  clientSecret: 'MY_AUTH0_SECRET',
});

var months = {};

processor.each(function(entry){
  // discard non signup events
  if (entry.type !== 'ss') { return; }

  var date = new Date(entry.date);

  var monthKey = date.getUTCFullYear() + '-' + date.getUTCMonth();

  if (!months[monthKey]){
    months[monthKey] = {};
  }

  if (!months[monthKey][entry.client_id]){
    months[monthKey][entry.client_id] = 0;
  }

  months[monthKey][entry.client_id]++;
});

processor.done(function(){
  Object.keys(months).forEach(function(m){
    console.log('Month:' + m);
    Object.keys(months[m]).forEach(function(c){
      console.log('Client ' + c + ':' + months[m][c]);
    });
  })
});

processor.start();
```

And the same as above assuming your logs fit into memory (dedicated to [@woloski](https://github.com/woloski)):
```javascript
var _ = require('lodash');

var processor = require('auth0-logs-processor').create({
  domain: 'MY_AUTH0_DOMAIN',
  clientId: 'MY_AUTH0_CLIENT',
  clientSecret: 'MY_AUTH0_SECRET',
});

var entries = [];

processor.each(function(entry){
  entries.push(entry);
});

processor.done(function(){
  var groups = _.chain(entries)
    .filter(function(e){
      return e.type === 'ss'
    })
    .groupBy(function(e){
      var date = new Date(e.date);

      return date.getUTCFullYear() + '-' + date.getUTCMonth() + ' ' + e.client_id;
    })
    .value();

  _.forOwn(groups, function(value, key) {
    console.log(key + ': ' + value.length);
  });
});

processor.start();
```

Charts
------
Charts are cool, and you can use the data to create your own :smiley:.

See [samples/charts](samples/charts) for a pie chart displaying logins per identity provider. It looks like this:

![](https://cldup.com/5frJxl3soL.png)

>Shoutout to [d3pie](hhttp://d3pie.org).

Put some of these together and create custom dashboards :fireworks: :boom: :zap:.

Contributing
------------
Feel free to add new samples by sending PRs.
