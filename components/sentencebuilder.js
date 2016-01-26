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
  grammar.Adjective = words.adjectives;
  grammar.Adverb = words.adverbs;
  grammar.Rest = words.Rest;
  grammar.TopicWord = words.topic;
  var conjugatedVerbs = conjugateVerbs(words.verbs);
  grammar.VerbPast = conjugatedVerbs.past;
  grammar.VerbPerfect = conjugatedVerbs.perfect;
  grammar.VerbPresent = conjugatedVerbs.present;


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
    present: []
  },
    currVerbConjugated = {};
  for (var i = 0; i < verbs.length; i++) {
    currVerbConjugated = nlp.verb(verbs[i]).conjugate();
    conjugatedVerbs.past.push(currVerbConjugated.past);
    conjugatedVerbs.perfect.push(currVerbConjugated.perfect);
    conjugatedVerbs.present.push(currVerbConjugated.present);
    /*todo What should VerbProgressive be?*/
  }
  return conjugatedVerbs;
};
