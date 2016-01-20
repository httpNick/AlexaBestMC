var gg, JSONStream, fs, es, completeSentenceChoice;
gg = require('grammar-graph');
JSONStream = require('JSONStream');
fs = require('fs');
es = require('event-stream');
completeSentenceChoice = 'TestSentence';

module.exports = {

  /**
  Takes in a blob of words, number of sentences to be generated and a callback that should accept a list of sentences..
  @param {Object} words: Object that at least contains a list of nouns/verbs.
  @param {callback} cb: callback to use once this function is finished executing.
  @param {int} numberOfSentences: number of sentences to be generated.
  */
  generateSentences : (words, numberOfSentences, cb) => {

    fs.createReadStream(
      __dirname + '/res/grammarconfig.json'
    ).pipe(
      JSONStream.parse()
    ).pipe(
      es.mapSync((grammarData) => {
        cb(
          constructSentences(words, grammarData, numberOfSentences)
        );
      })
    );
  }

};

var constructSentences = (words, grammar, numberOfSentences) => {

  var constructedSentences = [];

  grammar.Noun = words.nouns;
  grammar.Verb = words.verbs;
  grammar.Adjective = words.adjectives;
  grammar.Adverb = words.adverbs;
  grammar.Rest = words.Rest;
  grammar.TopicWord = words.topic;

  var recognizer = new gg(grammar).createRecognizer(completeSentenceChoice);


  while (constructedSentences.length < numberOfSentences) {

    var currSentence = '';
    var guide = new gg(grammar).createGuide(completeSentenceChoice);

    while (!recognizer.isComplete(currSentence)) {

      guide.choose(
        guide.choices()[
          Math.floor(Math.random()*guide.choices().length)
        ]
      );
      currSentence = guide.constructs()[
        Math.floor(Math.random()*guide.constructs().length)
      ];
    }
    constructedSentences.push(currSentence);
  }

  return constructedSentences;
};
