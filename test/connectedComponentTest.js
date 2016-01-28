var sentencebuilder, partofspeechseparator, randomwords, words;
sentencebuilder = require('../components/sentencebuilder');
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
                        var finalResultOfRhymeDictionaries = [];
                            Promise.all([
                                words.getPartsOfSpeech(response[0]),
                                words.getPartsOfSpeech(response[1]),
                                words.getPartsOfSpeech(response[2]),
                                words.getPartsOfSpeech(response[3]),
                                words.getPartsOfSpeech(response[4]),
                                words.getPartsOfSpeech(response[5]),
                                words.getPartsOfSpeech(response[6])
                            ]).then( (finalResult) =>
                                {
                                    for (var i = 0; i < 7; i++) {
                                        finalResultOfRhymeDictionaries.push(
                                            {
                                                NounRhyming : finalResult[i].nouns,
                                                AdjectiveRhyming : finalResult[i].adjectives,
                                                AdverbRhyming : finalResult[i].adverbs,
                                                VerbRhyming : finalResult[i].verbs,
                                                TopicWord : [randomNouns[i]]
                                            }
                                        );
                                    }
                                    resolve(finalResultOfRhymeDictionaries);
                                }
                            );
                        //console.log(finalResultOfRhymeDictionaries[0].NounRhyming.length);
                });
        } else /*if it reaches here, there are less than 7 related nouns.*/{
            // Make a request for each related topic
        }
    });
};

chooseSevenOtherTopicsAndGetTheRhymingWords(
    [
        'apple', 'street', 'table', 'cat',
        'hat', 'chair', 'city'
    ]
).then((result) => {
    for(var i = 0; i < result.length; i++) {
        console.log(result[i].TopicWord);
    }
});
