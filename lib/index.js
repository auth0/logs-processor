'use strict';

/*jshint node:true */

var Auth0 = require('auth0');
var request = require('request');
var urlJoin = require('url-join');

var URL_TEMPLATE = '/api/logs?from={checkpointId}&take=200';

exports.create = function(options){
  if (!options.domain) { throw new Error('Must provide Auth0 domain'); }
  if (!options.clientId) { throw new Error('Must provide Auth0 clientId'); }
  if (!options.clientSecret) { throw new Error('Must provide Auth0 clientSecret'); }

  var baseUrl = 'https://' + options.domain;

  return {
    __iterate: function(token){
      var self = this;
      var url = urlJoin(baseUrl, URL_TEMPLATE.replace('{checkpointId}', self.checkpoint || ''));
      console.log(url);
      request.get({
        url: url,
        auth: {
          'bearer': token
        },
        json: true
      }, function(err, resp, logs){
        if (err) { throw err; }

        if (self.each){
          logs.forEach(self.each);
        }

        if (logs.length < 200){
          self.done();
        } else {
          self.checkpoint = logs[logs.length - 1]._id;
          process.nextTick(function(){
            self.__iterate(token);
          });
        }
      });
    },
    done: function(cb){
      this.done = cb;
    },
    each: function(cb){
      this.each = cb;
    },
    start: function(){
      var self = this;
      var api = new Auth0({
        domain:       options.domain,
        clientID:     options.clientId,
        clientSecret: options.clientSecret
      });

      api.getAccessToken(function (err, token) {
        if (err) { throw err; }
        self.__iterate(token);
      });
    }
  };
};