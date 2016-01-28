var gg, JSONStream, fs, es, completeSentenceChoice, nlp, conjugate;
gg = require('grammar-graph');
JSONStream = require('JSONStream');
fs = require('fs');
es = require('event-stream');
nlp = require('nlp_compromise');
conjugate = require('conjugate');
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
  LocativeAdverb: "LocativeAdverb",
  DeterminerSingular: "DeterminerSingular",
  DeterminerPlural: "DeterminerPlural",
  AuxiliaryVerbBe: "AuxiliaryVerbBe",
  NounRhyming: "NounRhyming",
  AdjectiveRhyming: "AdjectiveRhyming",
  AdverbRhyming: "AdverbRhyming",
  LocativeAdverbRhyming: "LocativeAdverbRhyming",
  VerbPastRhyming: "VerbPastRhyming",
  VerbPerfectRhyming: "VerbPerfectRhyming",
  VerbPresentRhyming: "VerbPresentRhyming",
  VerbProgressiveRhyming: "VerbProgressiveRhyming"
};
var wordTypeDictionary = {};

var constructSentences = (words, grammar, numberOfSentences) => {

    grammar.RhymingWords = words.rhymingWords;
    grammar.Noun = grammar.Noun.concat(words.nouns);
    grammar.Verb = grammar.Verb.concat(words.verbs);
    grammar.Adjective = grammar.Adjective.concat(words.adjectives);
    grammar.Adverb = grammar.Adverb.concat(words.adverbs);
    if (grammar.Rest) grammar.Rest = words.Rest;
    grammar.TopicWord = words.topic;
    var conjugatedVerbs = conjugateVerbs(grammar.Verb);
    grammar.VerbPast = conjugatedVerbs.past;
    grammar.VerbPerfect = conjugatedVerbs.perfect;
    grammar.VerbPresent = conjugatedVerbs.present;
    grammar.VerbProgressive = conjugatedVerbs.progressive;
    grammar.NounRhyming = words.NounRhyming;
    grammar.AdjectiveRhyming = words.AdjectiveRhyming;
    grammar.AdverbRhyming = words.AdverbRhyming;
    /*
    var conjugatedRhymeVerbs = conjugateVerbs(words.VerbRhyming);
    //grammar.LocativeAdverbRhyming
    grammar.VerbPastRhyming = conjugatedRhymeVerbs.past;
    grammar.VerbPerfectRhyming = conjugatedRhymeVerbs.perfect;
    grammar.VerbPresentRhyming = conjugatedRhymeVerbs.present;
    grammar.VerbProgressiveRhyming = conjugatedRhymeVerbs.progressive;
*/
    //clear it before each use
    wordTypeDictionary = {};

  addWordsToDictionary(wordTypeDictionary, grammar.Noun, wordTypes.Noun);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounNominative, wordTypes.PronounNominative);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounAccusative, wordTypes.PronounAccusative);
  addWordsToDictionary(wordTypeDictionary, grammar.PronounPossessive, wordTypes.PronounPossessive);
  addWordsToDictionary(wordTypeDictionary, grammar.Verb, wordTypes.Verb);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPresent, wordTypes.VerbPresent);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPast, wordTypes.VerbPast);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPerfect, wordTypes.VerbPerfect);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbProgressive, wordTypes.VerbProgressive);
  addWordsToDictionary(wordTypeDictionary, grammar.Adjective, wordTypes.Adjective);
  addWordsToDictionary(wordTypeDictionary, grammar.Adverb, wordTypes.Adverb);
  addWordsToDictionary(wordTypeDictionary, grammar.LocativeAdverb, wordTypes.LocativeAdverb);
  addWordsToDictionary(wordTypeDictionary, grammar.DeterminerPlural, wordTypes.DeterminerPlural);
  addWordsToDictionary(wordTypeDictionary, grammar.DeterminerSingular, wordTypes.DeterminerSingular);
  addWordsToDictionary(wordTypeDictionary, grammar.AuxiliaryVerbBe, wordTypes.AuxiliaryVerbBe);

/*
  addWordsToDictionary(wordTypeDictionary, grammar.NounRhyming, wordTypes.NounRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.AdjectiveRhyming, wordTypes.AdjectiveRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.AdverbRhyming, wordTypes.AdverbRhyming);
//addWordsToDictionary(wordTypeDictionary, grammar.LocativeAdverbRhyming, wordTypes.LocativeAdverbRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPastRhyming, wordTypes.VerbPastRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPerfectRhyming, wordTypes.VerbPerfectRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPresentRhyming, wordTypes.VerbPresentRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbProgressiveRhyming, wordTypes.VerbProgressiveRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.ModalVerb, wordTypes.ModalVerb);
*/

/*
NounRhyming
AdjectiveRhyming
AdverbRhyming
LocativeAdverbRhyming
VerbPastRhyming
VerbPerfectRhyming
VerbPresentRhyming
VerbProgressiveRhyming

    var sentencesToBeSentToVerses = [];
    for (var i = 0; i < 8; i++) {
        //concat two sentences to the final list of sentences that will total 16.
        sentencesToBeSentToVerses.concat(
            generateTwoSentences(grammar)
        );
        //reset topicword
        grammar.TopicWord[0] = chooseANewTopic(grammar.Noun);
        // get rhymingwords for new topic

        // get pos types for new rhyming words
        // re-inject the grammar
    }
    return sentencesToBeSentToVerses;
    */

  return generateTwoSentences(grammar);
};


var generateTwoSentences = (grammar) => {
    var constructedSentences = [];

    var recognizer = new gg(grammar)
        .createRecognizer(
            completeSentenceChoice
        );

    while (constructedSentences.length < 15) {
        var currSentence = '';
        var outputSentence = '';
        var guide = new gg(grammar).createGuide(completeSentenceChoice);

        //for handling various inflection rules
        var previousWord = '';
        var previousDeterminer = '';
        var modalPresent = false;

        while (!recognizer.isComplete(currSentence)) {
            var choice = guide.choices()[Math.floor(Math.random()*guide.choices().length)];

            //progress through the graph, call choose() prior to inflection since it may not be a valid choice afterward
            guide.choose(choice);

            if(wordTypeDictionary.hasOwnProperty(choice) && wordTypeDictionary.hasOwnProperty(previousWord)) {
                var types = wordTypeDictionary[choice];

                if(types.indexOf(wordTypes.DeterminerSingular) > -1 || types.indexOf(wordTypes.DeterminerPlural) > -1) {
                    previousDeterminer = choice;
                }
                if(types.indexOf(wordTypes.ModalVerb) > -1) {
                    modalPresent = true;
                } 

                if((types.indexOf(wordTypes.Noun) > -1 || types.indexOf(wordTypes.NounRhyming) > -1) && previousDeterminer.length > 0) {
                    choice = declineNounByNumber(choice, previousDeterminer);
                }
                else if(types.indexOf(wordTypes.VerbPresent) > -1 || types.indexOf(wordTypes.VerbPresentRhyming) > -1) {
                    choice = conjugateVerbPresentByPerson(choice, previousWord, modalPresent);
                    if(modalPresent) {
                      modalPresent = false;
                    }
                }
                else if(types.indexOf(wordTypes.AuxiliaryVerbBe) > -1) {
                    choice = conjugateAuxiliaryVerbBeByPerson(choice, previousWord);
                }
            }

            //build the sentence being generated one word at a time
            outputSentence += choice + ' ';

            //this doesn't actually select another path, but rather ensures that the graph goes to the end of a possible path
            currSentence = guide.constructs()[Math.floor(Math.random()*guide.constructs().length)];

            previousWord = choice;
        }
        //make sure to get the last word of the generated sentence
        var lastWord = currSentence.split(' ').pop();

        /*
         //just go with the first type if it has more than one
         var typeOfLastWord = wordTypeDictionary[lastWord][0];
         typeOfLastWord += 'Rhyming';

         //the last word in the sentence will be one that rhymes but is the same part of speech as the one it replaces
         lastWord = grammar[typeOfLastWord][Math.floor(Math.random()*grammar[typeOfLastWord].length)]
         */
        outputSentence += lastWord;
        constructedSentences.push(outputSentence);
    }
    return constructedSentences;
};

var chooseANewTopic = (relatedNouns) => {

    var chosenIndex = Math.floor(Math.random()*relatedNouns.length);
    return relatedNouns.splice(chosenIndex, 1);
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

var addWordsToDictionary = (dictionary, wordsList, type) => {
  wordsList.forEach(function(element) {
    if(dictionary.hasOwnProperty(element)) {
      dictionary[element].push(type);
    } else {
      dictionary[element] = [type];
    }
  });
};

var declineNounByNumber = (word, previousDeterminer) => {
  console.log(previousDeterminer);
  console.log(wordTypeDictionary[previousDeterminer]);
  if(wordTypeDictionary[previousDeterminer].indexOf(wordTypes.DeterminerSingular) > -1) {
    console.log("SINGULARIZE: " + word);
    return nlp.noun(word).singularize();
  } 
  else if (wordTypeDictionary[previousDeterminer].indexOf(wordTypes.DeterminerPlural) > -1) {
    console.log("PLURALIZE: " + word);
    return nlp.noun(word).pluralize();
  }
  return word;
};

var conjugateVerbPresentByPerson = (word, previousWord, modalPresent) => {
  var nonThirdPersonPronouns = ['I', 'you', 'we', 'they'];
  if(nonThirdPersonPronouns.indexOf(previousWord) > -1 || modalPresent) {
    console.log("CONJUGATE VP REST: " + word);
    return conjugate('you', word);
  }
  console.log("CONJUGATE VP 3rd P: " + word);
  return conjugate('it', word);
};

var conjugateAuxiliaryVerbBeByPerson = (word, previousWord) => {
  if(wordTypeDictionary[previousWord].indexOf(wordTypes.PronounNominative) > -1) {
    var werePronouns = ['you', 'we', 'they'];
    if(word == 'be') {
      console.log("CONJUGATE BE: " + word);
      return conjugate(previousWord, word);
    } 
    else if(word == 'was' && werePronouns.indexOf(previousWord) > -1) {
      //neither the nlp_compromise nor conjugate module can conjugate the past tense of 'be' by person, so we have to do it manually
      console.log("CONJUGATE WAS: " + word);
      return 'were';
    }
  }
  return word;
};