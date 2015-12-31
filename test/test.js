/*
A testing file for how we can construct sentences.
*/
var rhyme = require('rhyme-plus')
, gg = require('grammar-graph')
, JSONStream = require('JSONStream')
, fs = require('fs')
, es = require('event-stream')

var generateSentencePool = (grammar) => {

  var guide = new gg(grammar).createGuide('Sentence')
  , recog = new gg(grammar).createRecognizer('Sentence')
  , currSentence = '';

  while (!recog.isComplete(currSentence)) {
    guide.choose(
      guide.choices()[
        Math.floor(Math.random()*guide.choices().length)
      ]
    );
    
    currSentence = guide.constructs()[
      Math.floor(Math.random()*guide.constructs().length)
    ];
  }

  return currSentence;
}

var parser = JSONStream.parse()
, sentenceGenerator = es.mapSync((data) => {
  var x = generateSentencePool(data)
  console.log(x);
  return x;
})
var rStream = fs.createReadStream(
  __dirname + '/res/sentenceRules.json'
).pipe(
  parser
).pipe(
  sentenceGenerator
);
