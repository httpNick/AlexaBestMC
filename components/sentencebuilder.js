var gg, JSONStream, fs, es, completeSentenceChoice, nlp;
gg = require('grammar-graph');
JSONStream = require('JSONStream');
fs = require('fs');
es = require('event-stream');
nlp = require('nlp_compromise');
completeSentenceChoice = 'Sentence';

module.exports = {

  /**
  Takes in a blob of words, number of sentences to be generated and a callback that should accept a list of sentences..
  @param {Object} words: Object that at least contains a list of nouns/verbs.
  @param {callback} cb: callback to use once this function is finished executing.
  @param {int} numberOfSentences: number of sentences to be generated.
  */
  generateSentences : (words, numberOfSentences, cb) => {

    fs.createReadStream(
      __dirname + '/res/GrammarRulesConfig.json'
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
  grammar.Adjective = grammar.Adjective.concat(words.adjectives);
  grammar.Adverb = grammar.Adverb.concat(words.adverbs);
  grammar.Rest = words.Rest;
  grammar.TopicWord = words.topic;
  var conjugatedVerbs = conjugateVerbs(words.verbs);
  grammar.VerbPast = conjugatedVerbs.past;
  grammar.VerbPerfect = conjugatedVerbs.perfect;
  grammar.VerbPresent = conjugatedVerbs.present;
  grammar.VerbProgressive = conjugatedVerbs.progressive;


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
/*
    constructedSentences.push(
      nlp.sentence(currSentence).to_past().str
    );
*/
    constructedSentences.push(currSentence);

  }

  return constructedSentences;
};

var conjugateVerbs = (verbs) => {
  var conjugatedVerbs = {
    past : [],
    perfect: [],
    present: [],
    progressive: []
  },
    currVerbConjugated = {};
  for (var i = 0; i < verbs.length; i++) {
    currVerbConjugated = nlp.verb(verbs[i]).conjugate();
    conjugatedVerbs.past.push(currVerbConjugated.past);
    conjugatedVerbs.perfect.push(currVerbConjugated.perfect.split(' ')[1]); //exclude the modal verb at index zero
    conjugatedVerbs.present.push(currVerbConjugated.present);
    conjugatedVerbs.progressive.push(currVerbConjugated.gerund);
  }
  return conjugatedVerbs;
};
