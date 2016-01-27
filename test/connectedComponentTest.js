var sentencebuilder, partofspeechseparator, randomwords;
sentencebuilder = require('../components/sentencebuilder');
words = require('../services/words.js');
randomwords = require('random-words');
rhyme = require('../components/findRhymes');
var testTopic = 'apple';

/*var mainTest = (topic, cb) => {
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

mainTest('school', (err, res) => {
   if (err) {
       console.log(err);
   } else {
       console.dir(res);
   }
});*/

Promise.all([
    words.getRelatedWords(testTopic),
    words.getRelatedWordsFromWordnik(testTopic)
]).then(response => {
    var relatedWords = new Set(
        response[0].associations_array
            .concat(response[1].sameContext)
            .concat(response[1].synonym)
            .concat(response[1].unknown)
    );
    words.getPartsOfSpeech(Array.from(relatedWords), (posDict) => {
        posDict.topic = [testTopic];
        posDict.rhymingWords = response[1].rhyme;
        sentencebuilder.generateSentences(posDict, 10, (results) => {
            console.log(results);
        });
    });

});
