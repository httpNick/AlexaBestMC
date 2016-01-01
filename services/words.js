var https = require('https');
var request = require('request');
var WordPOS = require('wordpos');

var wordPos = new WordPOS();

exports.getRelatedWords = function(topic, callback) {
  var urlPath = '/associations/?entry=' + topic;

  var options = {
    url: 'https://twinword-word-associations-v1.p.mashape.com/associations/?entry=' + topic,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Mashape-Key': 'dEaZCcpGenmshiXmhCynJRUQn3rBp1Qt5ibjsnM1mPTNhV3qYR'
    }
  };

  request(options, function(err, response, body) {
    if(err) {
      callback(err);
    }

    var result = JSON.parse(body);

    callback(null, result.associations_array);
  });
}

exports.getPartsOfSpeech = function(words, callback) {
  wordPos.getPOS(words, function(partsOfSpeech) {
    console.log("getPartsOfSpeech() called");
    callback(partsOfSpeech);
  });
}
/*
exports.getPartsOfSpeech = function(word, callback) {
  var options = {
    url: 'http://dictionaryapi.net/api/definition/' + word,
    method: 'GET'
  };

  request(options, function(err, response, body) {
    if(err) {
      callback(err);
    }

    var result = JSON.parse(body);

    var partsOfSpeech = [];
    result.forEach(function(element) {
      partsOfSpeech.push(element.PartOfSpeech);
    });

    callback(null, partsOfSpeech);
  });
}
*/
