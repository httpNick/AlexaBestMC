var https = require('https');
var request = require('request');
var WordPOS = require('wordpos');
var randomWords = require('random-words');
var wordPos = new WordPOS();
var keychain = require('../config.keys.json');
var wordnikparse = require('../components/wordnikresponseparse');

exports.getRelatedWords = function(topic) {
  var urlPath = '/associations/?entry=' + topic;

  var options = {
    url: 'https://twinword-word-associations-v1.p.mashape.com/associations/?entry=' + topic,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Mashape-Key': 'dEaZCcpGenmshiXmhCynJRUQn3rBp1Qt5ibjsnM1mPTNhV3qYR'
    }
  };

  return new Promise(function(resolve, reject) {
      request(options, function(err, response, body) {
          if(err) {
              reject(err);
          }

          var result = JSON.parse(body);
          resolve(result);
        });
    });
};

exports.getRelatedWordsFromWordnik = function(topic) {
    var options = {
        url: setWordNikSearchTopic(topic),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return new Promise( function(resolve, reject) {
        request(options, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    wordnikparse.extractRelationshipTypesFromWordnik(
                        JSON.parse(body)
                    )
                );
            }
        });
    });
};

exports.getRhymingWordsFromRhymeBrain = function(topic) {
    var options = {
        url: setRhymeBrainTopic(topic),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return new Promise(function(resolve, reject) {
        request(options, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(
                    toListOfWords(JSON.parse(body))
                );
            }
        });
    });

};

var setWordNikSearchTopic = function(topic) {
    return "http://api.wordnik.com:80/v4/word.json/"
        + topic +
        "/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key="
        + keychain.wordnik;
};

var setRhymeBrainTopic = function(topic) {
    return "http://rhymebrain.com/talk?function=getRhymes&word="
        + topic;
};

var getPartsOfSpeech = function(words) {
  return new Promise(function(resolve, reject) {
    wordPos.getPOS(words, function(partsOfSpeech) {
        resolve(partsOfSpeech);
    })
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

var toListOfWords = function(res) {
    var allWords = [];
    res.forEach(function(responseObject) {
        allWords.push(responseObject.word);
    });
    return allWords;
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
