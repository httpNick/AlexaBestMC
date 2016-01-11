/**
 * Created by Chris on 1/10/16.
 */
var rhyme = require('rhyme-plus');
var willRhyme = ["Rake","Smite","Bake","Cookies"]

/**
 * Given we have a word
 * Can we find words that rhyme with the given word?
 */
rhyme(function (r) {
    console.log("Finding all the words that rhyme with car")
    console.log(r.rhyme('car').join(' '));
    console.log()
});

/**
 * Given we have a word
 * Can we find words that are alliterations of the given word?
 */
rhyme(function (r) {
    console.log("Finding all alliterations of car ")
    console.log(r.alliteration('car').join(' '));
    console.log()
});


/**
 * Given we have a word
 * can we find the syllable count of that word?
 */
rhyme(function (r) {
    console.log("Pronunciation and Syllable count for alliteration")
    console.log(r.pronounce('alliteration'))
    console.log(r.syllables('alliteration'));
    console.log()
});

/**
 * Given we input an array of our own words
 * Can we fine a pair in that list that rhyme?
 */
rhyme(function (r) {
    console.log("Which words rhyme in: " + willRhyme)
    console.log(r.findRhymes(willRhyme));
    console.log()
});
