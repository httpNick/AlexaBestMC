var sentencebuilder, partofspeechseparator, randomwords;
sentencebuilder = require('../components/sentencebuilder');
words = require('../services/words.js');
randomwords = require('random-words');
rhyme = require('../components/findRhymes');

var mainTest = (topic, cb) => {
    words.getRelatedWords(topic, (err, res) => {
        if (err) {
            cb(err)
        } else {
            if (res) {
                words.getPartsOfSpeech(res, (posDict) => {
                    posDict.topic = [topic];
                    sentencebuilder.generateSentences(posDict, 10, (results) => {
                        rhyme.findRhymingSentences(results, (rhymes) => {
                          cb(null, rhymes);
                        });
                    });
                })
            } else {
                cb(new Error("No related words found."), null);
            }
        }
    });
};

mainTest('apple', (err, res) => {
   if (err) {
       console.log(err);
   } else {
       console.dir(res);
   }
});
