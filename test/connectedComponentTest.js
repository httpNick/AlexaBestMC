var sentencebuilder, partofspeechseparator, randomwords, words;
sentencebuilder = require('../components/sentencebuilder');
versebuilder = require('../components/versebuilder');
words = require('../services/words.js');
randomwords = require('random-words');
rhyme = require('../components/findRhymes');
var testTopic = 'school';

var mainTest = () => {
    Promise.all([

        words.getRelatedWords(testTopic),
        words.getRelatedWordsFromWordnik(testTopic),
        words.getRhymingWordsFromRhymeBrain(testTopic)

    ]).then(response => {

        /**
         * response[0] is the response for twinword
         * response[1] is the response for wordnik
         * response[2] is the response of rhyming words from RhymeBrain.
         */
        if (response[0].associations_array && response[1]) {

            // Using a set to ensure no duplicates.
            var relatedWords = new Set(
                response[0].associations_array
                    .concat(response[1].sameContext)
                    .concat(response[1].synonym)
                    .concat(response[1].unknown)
            );

            words.getPartsOfSpeech(Array.from(relatedWords), (posDict) => {

                posDict.topic = [testTopic];
                //posDict.rhymingWords = response[1].rhyme;
                words.getPartsOfSpeech(response[1].rhyme.concat(response[2]), (rhymePosDict) => {
                    posDict.NounRhyming = rhymePosDict.nouns;
                    posDict.AdjectiveRhyming = rhymePosDict.adjectives;
                    posDict.AdverbRhyming = rhymePosDict.adverbs;
                    posDict.VerbRhyming = rhymePosDict.verbs;
                });
                if (response[2]) {
                    posDict.rhymingWords = posDict
                        .rhymingWords
                        .concat(response[2]);
                }
                sentencebuilder.generateSentences(posDict, 16, (results) => {
                    console.log(results);
                    versebuilder.generateVerses(results, (song) => {
                        console.log(song);
                    });
                });
            });
        }

    });
};

// Sorry I know this method is trash, refactor if there is time. --Nick
/**
 * Finds up to 7 nouns related to the original topic.
 * Get rhyming words for each and spread into different parts of speech.
 */
var chooseSevenOtherTopicsAndGetTheRhymingWords = (relatedNouns) => {
    var finalResultOfRhymeDictionaries = [];
    var randomChoices = [];
    var randomNouns = [];
    if (relatedNouns.length > 7) {
        for(var i = 0; i < 7; i++) {
            var pushed = false;
            while (!pushed) {
                var randomChoice = Math.floor(Math.random()*relatedNouns.length);
                if (randomChoices.indexOf(randomChoice)  <= -1) {
                    pushed = true;
                    randomChoices.push(randomChoice);
                    randomNouns.push(relatedNouns[randomChoice]);
                }
            }
        }
    }  else {
        randomNouns = relatedNouns;
    }
    return new Promise((resolve, reject) => {
        if (randomNouns.length === 7) {
            Promise.all([
                words.getRhymingWordsFromRhymeBrain(randomNouns[0]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[1]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[2]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[3]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[4]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[5]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[6])
            ]).then(
                (response) => {
                        var aTopicWithRhymingPos = {
                            NounRhyming: [],
                            AdjectiveRhyming: [],
                            AdverbRhyming: [],
                            VerbRhyming: []
                        };
                        for (var i = 0; i < response.length; i++) {
                            words.getPartsOfSpeech(response[i], (anotherOne) => {
                                aTopicWithRhymingPos.NounRhyming = anotherOne.nouns;
                                aTopicWithRhymingPos.AdjectiveRhyming = anotherOne.adjectives;
                                aTopicWithRhymingPos.AdverbRhyming = anotherOne.adverbs;
                                aTopicWithRhymingPos.VerbRhyming = anotherOne.verbs;
                            });
                            finalResultOfRhymeDictionaries.push(aTopicWithRhymingPos);
                        }
                        resolve(finalResultOfRhymeDictionaries);
                });
        } else /*if it reaches here, there are less than 7 related nouns.*/{
            // Make a request for each related topic
        }
    });
};

chooseSevenOtherTopicsAndGetTheRhymingWords(
    [
        'apple', 'street', 'table', 'cat',
        'hat', 'chair', 'city', 'dog'
    ]
).then((result) => {
    console.log(result.length);
});
