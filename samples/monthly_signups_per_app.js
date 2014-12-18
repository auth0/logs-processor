var processor = require('../lib').create({
  domain: 'MY_AUTH0_DOMAIN',
  clientId: 'MY_AUTH0_CLIENT',
  clientSecret: 'MY_AUTH0_SECRET'
});

var months = {};

processor.each(function(entry){
  // discard non signup events
  if (entry.type !== 'ss') { return; }

  var date = new Date(entry.date);

  var monthKey = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1);

  if (!months[monthKey]){
    months[monthKey] = {};
  }

  if (!months[monthKey][entry.client_id]){
    months[monthKey][entry.client_id] = 0;
  }

  months[monthKey][entry.client_id]++;
});

processor.done(function(){
  // report
  Object.keys(months).forEach(function(m){
    console.log('Month:' + m);
    Object.keys(months[m]).forEach(function(c){
      console.log('Client ' + c + ':' + months[m][c]);
    });
  })
});

processor.start();