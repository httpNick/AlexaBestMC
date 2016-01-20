var sentencebuilder, partofspeechseparator, randomwords;
sentencebuilder = require('../components/sentencebuilder');
words = require('../services/words.js');
randomwords = require('random-words');

var mainTest = (topic, cb) => {
    words.getRelatedWords(topic, (err, res) => {
        if (err) {
            cb(err)
        } else {
            words.getPartsOfSpeech(res, (posDict) => {
                posDict.topic = [ topic ];
                sentencebuilder.generateSentences(posDict, 2, (results) => {
                    cb(null, results);
                });
            })
        }
    });
};

mainTest('apple', (err, res) => {
   if (err) console.log(err);
    console.log(res);
});
