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
var num = 0;
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
    num++;
  }
//console.log("NUM: " + num);
console.log(currSentence);
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
PronounDeterminer can only come before Noun or adajectivephrase
Get rid of Preposition PrepositionalPhrase to reduce nonsensical combination of prepositions
Remove recursive rule sdue to how the grammar graph works
*/