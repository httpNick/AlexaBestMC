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
module.exports = {

    findRhymingSentences : function(sentenceInput, callback) {

        //Checks for malicious input and crashes if an array of sentences isnt passed in
        console.assert(sentenceInput instanceof Array, "Please enter a valid array of sentences");
        //End of check for malicious input
        rhyme(function findRhymeList(r) {
            var lastWords = findAllLastWords(sentenceInput);
            var rhymingList = r.findRhymes(lastWords);
            var rhymingSentences = [];

            for (var i = 0; i < rhymingList.length; i++) {
                var rhymingWords = rhymingList[i];
                var rhymingSentencePair = []; //reset the list
                for (var j = 0; j < rhymingWords.length; j++) {
                    for (var k = 0; k < sentenceInput.length; k++) {
                        if (sentenceInput[k].search(rhymingWords[j]) != -1) //The word is in the sentence
                            rhymingSentencePair.push(sentenceInput[k]);
                    }
                }
                rhymingSentences.push(rhymingSentencePair);
            }

            callback(rhymingSentences)
        });


        //Private function that finds the last word of a sentence
        function findAllLastWords(sentenceList) {
            var lastWords = [];
            for (var i = 0; i < sentenceList.length; i++) {
                lastWords[i] = ("" + sentenceList[i]).replace(/[\s\-\.]+$/, '').split(/[\s-]/).pop();
            }

            return lastWords;
        } //End findAllLastWords
    }
};