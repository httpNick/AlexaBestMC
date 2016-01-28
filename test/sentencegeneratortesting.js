/*
A testing file for how we can construct sentences.
*/
var rhyme = require('rhyme-plus')
, gg = require('grammar-graph')
, JSONStream = require('JSONStream')
, fs = require('fs')
, es = require('event-stream')

var generateSentencePool = (grammar) => {

  var guide = new gg(grammar).createGuide('grammar')
  , recog = new gg(grammar).createRecognizer('grammar')
  , currSentence = '';
  //var num = 0;
  while (!recog.isComplete(currSentence)) {
    var choice =  guide.choices()[
        Math.floor(Math.random()*guide.choices().length)
      ];
      //console.log("CHOICE: " + choice);
    guide.choose(
     choice
    );
    //console.log("CONSTRUCTS: " + guide.constructs());
    currSentence = guide.constructs()[
      Math.floor(Math.random()*guide.constructs().length)
    ];
    //console.log("CURR: " + currSentence);
    //num++;
  }
  //console.log("NUM: " + num);

  return currSentence;
}

var parser = JSONStream.parse()
, sentenceGenerator = es.mapSync((data) => {
  var x = generateSentencePool(data)
  console.log(x);
  return x;
})
, rStream = fs.createReadStream(
  __dirname + '/../components/res/GrammarRulesConfig.json'
).pipe(
  parser
).pipe(
  sentenceGenerator
);

/*
PronounDeterminer can only come before Noun or adjectivephrase
Get rid of Preposition PrepositionalPhrase to reduce nonsensical combination of prepositions
Remove recursive rules due to how the grammar graph works
Separated Degree words into DegreeAdjective and DegreeAdverb
Removed some words that were prone to nonsense

Fixed rules for PrepositionalPhrase so that the only verbs that prepositions can come before are progressive verbs
Removed a ConjunctiveSpecial word
Added another rule for Sentence to join three clauses

Tweaked PrepositionalPhrase and AdverbPhrase placements in NounPhrase and VerbPhrase
Moved some words in Conjunction to ConjunctionSpecial
Moved PrepositionalPhrase out of NounPhrase to prevent it from coming before modal or auxilary verb if the NounPhrase is before a VerbPhrase

Split locative adverbs out into their own rule
Gave Noun, Verb, Adjective, and Adverb default values
Removed AdverbPhrase from being at the beginning
*/