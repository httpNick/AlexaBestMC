var gg, JSONStream, fs, es, completeSentenceChoice, nlp;
gg = require('grammar-graph');
JSONStream = require('JSONStream');
fs = require('fs');
es = require('event-stream');
nlp = require('nlp_compromise');
completeSentenceChoice = 'Grammar';

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

  grammar.RhymingWords = words.rhymingWords;
  grammar.Noun = words.nouns;
  grammar.Verb = words.verbs;
  grammar.Adjective = words.adjectives;
  grammar.Adverb = words.adverbs;
  if (grammar.Rest) grammar.Rest = words.Rest;
  grammar.TopicWord = words.topic;
  var conjugatedVerbs = conjugateVerbs(words.verbs);
  grammar.VerbPast = conjugatedVerbs.past;
  grammar.VerbPerfect = conjugatedVerbs.perfect;
  grammar.VerbPresent = conjugatedVerbs.present;
  grammar.VerbProgressive = conjugatedVerbs.progressive;

  var wordTypeDictionary = {};
  var wordTypes = {
    Noun: "Noun",
    PronounNominative: "PronounNominative",
    PronounAccusative: "PronounAccusative",
    PronounPossessive: "PronounPossessive",
    Verb: "Verb",
    VerbPast: "VerbPast",
    VerbPerfect: "VerbPerfect",
    VerbProgressive: "VerbProgressive",
    Adjective: "Adjective",
    Adverb: "Adverb",
    LocativeAdverb: "LocativeAdverb"
  };
  addWordsToDictionary(wordTypeDictionary, grammar.Noun, wordTypes.Noun);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounNominative, wordTypes.PronounNominative);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounAccusative, wordTypes.PronounAccusative);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounPossessive, wordTypes.PronounPossessive);
  addWordsToDictionary(wordTypeDictionary, grammar.Verb, wordTypes.Verb);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPast, wordTypes.VerbPast);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPerfect, wordTypes.VerbPerfect);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbProgressive, wordTypes.VerbProgressive);
  addWordsToDictionary(wordTypeDictionary, grammar.Adjective, wordTypes.Adjective);
  addWordsToDictionary(wordTypeDictionary, grammar.Adverb, wordTypes.Adverb);
  addWordsToDictionary(wordTypeDictionary, grammar.LocativeAdverb, wordTypes.LocativeAdverb);

  console.log(wordTypeDictionary);

  var recognizer = new gg(grammar).createRecognizer(completeSentenceChoice);


  while (constructedSentences.length < numberOfSentences) {
    var currSentence = '';
    var guide = new gg(grammar).createGuide(completeSentenceChoice);

    //handle various inflection rules
    var previousWord = '';

    while (!recognizer.isComplete(currSentence)) {
      /*
      console.log("CONS " + guide.construction() + '\n');
      console.log("STRUCTS " + guide.constructs() + '\n');
      console.log("CHOCIES " + guide.choices() + '\n');
      */
      var choice = guide.choices()[Math.floor(Math.random()*guide.choices().length)];
      /*
      if(splitCurrSentence.length >= 2) {
        var typeofCurrentChoice = splitCurrSentence.pop();
        var previousWord = splitCurrSentence.pop();

        switch(typeofCurrentChoice) {
          case 'Noun':
            choice = inflectNounByNumber(previousWord, choice);
            break;
        }
      }     
*/
      


      guide.choose(choice);

      //this doesn't actually select another path, but rather ensures that the graph goes to the end of a possible path
      currSentence = guide.constructs()[Math.floor(Math.random()*guide.constructs().length)];
    }

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

var addWordsToDictionary = function(dictionary, wordsList, type) {
  wordsList.forEach(function(element) {
    if(dictionary.hasOwnProperty(element)) {
      dictionary[element].push(type);
    } else {
      dictionary[element] = [type];
    }
  });
};
