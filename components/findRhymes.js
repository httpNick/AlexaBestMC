/**
 * This module will be in charge of finding rhyming sentences
 * based off of the last words of the sentence.
 *
 * Created by Chris Fahlin on 1/22/16.
 */
var rhyme = require('rhyme-plus');

/**
 * This function will take in an array of sentences
 * and return an array of sentences grouped by rhyming last words.
 *
 * @param sentenceInput The array of sentences to find rhyming words
 * @param callback The callback function to capture the rhyming words
 *
 * @return an array of paired sentences with the layout [[a,b],[c,d]]
 */
function findRhymingSentences(sentenceInput, callback) {
    rhyme(function findRhymeList(r) {
        var lastWords = findAllLastWords(sentenceInput)
        var rhymingList = r.findRhymes(lastWords);
        var rhymingSentences = []

        for (var i = 0; i < rhymingList.length; i++) {
            var rhymingWords = rhymingList[i];
            var rhymingSentencePair = [] //reset the list
            for (var j = 0; j < rhymingWords.length; j++) {
                for (var k = 0; k < sentenceInput.length; k++) {
                    if(sentenceInput[k].search(rhymingWords[j]) != -1) //The word is in the sentence
                        rhymingSentencePair.push(sentenceInput[k]);
                }
            }
            rhymingSentences.push(rhymingSentencePair);
        }

        return callback(rhymingSentences)
    })


    //Private function that finds the last word of a sentence
    function findAllLastWords(sentenceList) {
        var lastWords = [];
        for(var i = 0; i < sentenceList.length; i++) {
            lastWords[i] = (""+sentenceList[i]).replace(/[\s\-\.]+$/,'').split(/[\s-]/).pop();
        }

        return lastWords;
    }; //End findAllLastWords
};


/*This is test code, can be removed*/
var testSentences = ["This is a test rake", "This is another bake", "Third saying", "This is a cat", "That is a hat"]
findRhymingSentences(testSentences, function(rhymes) {
    console.log(rhymes);
});

/*End test code*/