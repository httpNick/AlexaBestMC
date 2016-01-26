var https = require('https');
var request = require('request');
var WordPOS = require('wordpos');
var randomWords = require('random-words');
var wordPos = new WordPOS();
var keychain = require('../config.keys.json');

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
};

exports.getRelatedWordsFromWordnik = (topic, cb) => {
    var options = {
        url: setWordNikSearchTopic(topic),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(options, (err, response, body) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, JSON.parse(body));
        }
    });
};

var setWordNikSearchTopic = () => {
    return "http://api.wordnik.com:80/v4/word.json/"+ topic +"/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=" + keychain.wordnik;
};

var getPartsOfSpeech = function(words, callback) {
  wordPos.getPOS(words, function(partsOfSpeech) {
    callback(partsOfSpeech);
  });
};
exports.getPartsOfSpeech = getPartsOfSpeech;

exports.getRandomWordsByPos = function(callback) {
  var words = [];
  for(var i = 0; i < 50; i++) {
    words.push(randomWords());
  }
  getPartsOfSpeech(words, callback);
};

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
