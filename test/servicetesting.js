var wordsService = require('../services/words.js');
var request = require('request');
var keychain = require('../config.keys.json');

function wordsService_getRelatedWords() {
  wordsService.getRelatedWords('apple', function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
}

function wordnikTest() {
  var options = {
    url: 'http://api.wordnik.com:80/v4/word.json/hello/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=' + keychain.wordnik,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  request(options, function(err, response, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(JSON.parse(body));
    }
  });
}


var setSearchTopic = (topic) => {
  return "http://api.wordnik.com:80/v4/word.json/"+ topic +"/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=" + keychain.wordnik;
};

module.exports = {
  topicRequest: (topic, cb) => {
    var options = {
      url: setSearchTopic(topic),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var value = request(options, (err, response, body) => {
      if (err) {
        cb(JSON.parse(body));
      } else {
        cb(JSON.parse(body));
      }
    });
  }
};
/*
module.exports.topicRequest("apple", (data) => {
   console.log(data);
});
*/

var options = {
    url: "http://rhymebrain.com/talk?function=getRhymes&word=apple",
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

request(options, (err, response, body) => {
   console.log(body);
});

