//var wordService = require('../services/words.js')
// quick and dirty test function for the word services.
/**, res = wordService.getRelatedWords('apple', (err, result) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log(result);
      return result;
    }
});
*/
var request = require('request'),
options = {
  url: 'http://api.wordnik.com:80/v4/word.json/hello/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

request(options, (err, response, body) => {
  if(err) {
    console.log(err);
  } else {
    console.log(JSON.parse(body));
  }
});
