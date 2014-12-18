var fs = require('fs');

var processor = require('../lib').create({
  domain: 'MY_AUTH0_DOMAIN',
  clientId: 'MY_AUTH0_CLIENT',
  clientSecret: 'MY_AUTH0_SECRET'
});

fs.unlinkSync('logs.txt');

processor.each(function(entry){
  fs.appendFileSync('logs.txt', JSON.stringify(entry) + '\n');
});

processor.done(function(){
  console.log('Complete');
});

processor.start();