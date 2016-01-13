var sentencebuilder, partofspeechseparator, randomwords;
sentencebuilder = require('../components/sentencebuilder');
partofspeechseparator = require('../components/partofspeechseparator');
randomwords = require('random-words');

var mainTest = (listofwords, cb) => {
    partofspeechseparator.createPOSDictionary(listofwords, (posDict) => {
        sentencebuilder.generateSentences(posDict, 2, (results) => {
           cb(results);
       });
    });
};

mainTest(randomwords(10), (results) => {
   console.log(results);
});
