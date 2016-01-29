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
  generateSentences : function(words, numberOfSentences, cb) {

    fs.createReadStream(
      __dirname + '/res/GrammarRulesConfig.json'
    ).pipe(
      JSONStream.parse()
    ).pipe(
      es.mapSync(function(grammarData) {
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
  VerbPresent: "VerbPresent",
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
  VerbProgressiveRhyming: "VerbProgressiveRhyming",
  ModalVerb: "ModalVerb"
};
var wordTypeDictionary = {};

var constructSentences = function(words, grammar, numberOfSentences) {

  grammar.RhymingWords = words.rhymingWords;
  grammar.Noun = words.nouns;
  grammar.Verb = words.verbs;
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
  var conjugatedRhymeVerbs = conjugateVerbs(words.VerbRhyming);
  grammar.VerbPastRhyming = conjugatedRhymeVerbs.past;
  grammar.VerbPerfectRhyming = conjugatedRhymeVerbs.perfect;
  grammar.VerbPresentRhyming = conjugatedRhymeVerbs.present;
  grammar.VerbProgressiveRhyming = conjugatedRhymeVerbs.progressive;
  grammar.LocativeAdverbRhyming = grammar.LocativeAdverb;
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
  addWordsToDictionary(wordTypeDictionary, grammar.ModalVerb, wordTypes.ModalVerb);

  addWordsToDictionary(wordTypeDictionary, grammar.NounRhyming, wordTypes.NounRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.AdjectiveRhyming, wordTypes.AdjectiveRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.AdverbRhyming, wordTypes.AdverbRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.LocativeAdverbRhyming, wordTypes.LocativeAdverbRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPastRhyming, wordTypes.VerbPastRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPerfectRhyming, wordTypes.VerbPerfectRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbPresentRhyming, wordTypes.VerbPresentRhyming);
  addWordsToDictionary(wordTypeDictionary, grammar.VerbProgressiveRhyming, wordTypes.VerbProgressiveRhyming);
  

/*
NounRhyming
AdjectiveRhyming
AdverbRhyming
LocativeAdverbRhyming
VerbPastRhyming
VerbPerfectRhyming
VerbPresentRhyming
VerbProgressiveRhyming
<<<<<<< HEAD
*/
  var sentencesToBeSentToVerses = [];
    //concat two sentences to the final list of sentences that will total 16.
    sentencesToBeSentToVerses.push(
        generateTwoSentences(grammar)
    );
    sentencesToBeSentToVerses.push(
        generateTwoSentences(grammar)
    );
    sentencesToBeSentToVerses.push(
        generateTwoSentences(grammar)
    );
    sentencesToBeSentToVerses.push(
        generateTwoSentences(grammar)
    );
    /*
  for (var i = 0; i < 7; i++) {
      //reset topicword

      grammar.AdjectiveRhyming = [];
      grammar.AdjectiveRhyming = words.RelatedWordRhymes[i].AdjectiveRhyming;
      addWordsToDictionary(wordTypeDictionary, grammar.AdjectiveRhyming, wordTypes.AdjectiveRhyming);

      grammar.AdverbRhyming = [];
      grammar.AdverbRhyming = words.RelatedWordRhymes[i].AdverbRhyming;
      addWordsToDictionary(wordTypeDictionary, grammar.AdverbRhyming, wordTypes.AdverbRhyming);

      grammar.NounRhyming = [];
      grammar.NounRhyming = words.RelatedWordRhymes[i].NounRhyming;
      addWordsToDictionary(wordTypeDictionary, grammar.NounRhyming, wordTypes.NounRhyming);

      var conjugatedNewRhymeVerbs = conjugateVerbs(words.RelatedWordRhymes[i].VerbRhyming);

      grammar.VerbPastRhyming = [];
      grammar.VerbPastRhyming = conjugatedNewRhymeVerbs.past;
      addWordsToDictionary(wordTypeDictionary, grammar.VerbPastRhyming, wordTypes.VerbPastRhyming);

      grammar.VerbPerfectRhyming = [];
      grammar.VerbPerfectRhyming = conjugatedNewRhymeVerbs.perfect;
      addWordsToDictionary(wordTypeDictionary, grammar.VerbPerfectRhyming, wordTypes.VerbPerfectRhyming);

      grammar.VerbPresentRhyming = [];
      grammar.VerbPresentRhyming = conjugatedNewRhymeVerbs.present;
      addWordsToDictionary(wordTypeDictionary, grammar.VerbPresentRhyming, wordTypes.VerbPresentRhyming);

      grammar.VerbProgressiveRhyming = [];
      grammar.VerbProgressiveRhyming = conjugatedNewRhymeVerbs.progressive;
      addWordsToDictionary(wordTypeDictionary, grammar.VerbProgressiveRhyming, wordTypes.VerbProgressiveRhyming);
//console.log(words.RelatedWordRhymes[i].TopicWord);
//console.log(generateTwoSentences(grammar));
      sentencesToBeSentToVerses.push(
          generateTwoSentences(grammar)
      );
  }
  */
  return sentencesToBeSentToVerses;
};
/*
 NounRhyming
 AdjectiveRhyming
 AdverbRhyming
 LocativeAdverbRhyming
 VerbPastRhyming
 VerbPerfectRhyming
 VerbPresentRhyming
 VerbProgressiveRhyming
 */

var generateTwoSentences = function(grammar) {
    var constructedSentences = [];

    var recognizer = new gg(grammar)
        .createRecognizer(
            completeSentenceChoice
        );

    while (constructedSentences.length < 2) {
        var currSentence = '';
        var outputSentence = '';
        var guide = new gg(grammar).createGuide(completeSentenceChoice);

        //for handling various inflection rules
        var previousChoice = '';
        var previousDeterminer = '';
        var modalPresent = false;

        while (!recognizer.isComplete(currSentence)) {
            var choice = guide.choices()[Math.floor(Math.random()*guide.choices().length)];
            var currentWord = choice;

            //progress through the graph, call choose() prior to inflection since it may not be a valid choice afterward
            guide.choose(choice);

            if(wordTypeDictionary.hasOwnProperty(choice) && wordTypeDictionary.hasOwnProperty(previousChoice)) {
                var types = wordTypeDictionary[choice];
                  console.log(types);
                if(types.indexOf(wordTypes.DeterminerSingular) > -1 || types.indexOf(wordTypes.DeterminerPlural) > -1) {
                    previousDeterminer = choice;
                }
                if(types.indexOf(wordTypes.ModalVerb) > -1) {
                    modalPresent = true;
                } 

                if((types.indexOf(wordTypes.Noun) > -1 || types.indexOf(wordTypes.NounRhyming) > -1) && previousDeterminer.length > 0) {
                    currentWord = declineNounByNumber(choice, previousDeterminer);
                }
                else if(types.indexOf(wordTypes.VerbPresent) > -1 || types.indexOf(wordTypes.VerbPresentRhyming) > -1) {
                    currentWord = conjugateVerbPresentByPerson(choice, previousChoice, modalPresent);
                    if(modalPresent) {
                      modalPresent = false;
                    }
                }
                else if(types.indexOf(wordTypes.AuxiliaryVerbBe) > -1) {
                    currentWord = conjugateAuxiliaryVerbBeByPerson(choice, previousChoice);
                }
            }

            //build the sentence being generated one word at a time
            outputSentence += currentWord + ' ';

            //this doesn't actually select another path, but rather ensures that the graph goes to the end of a possible path
            currSentence = guide.constructs()[Math.floor(Math.random()*guide.constructs().length)];

            previousChoice = choice;
        }

        //the last word in the sentence will be one that rhymes but is the same part of speech as the one it replaces

        //make sure to get the last word of the generated sentence
        currSentenceArray = currSentence.split(' ');
        var lastChoice = currSentenceArray.pop();
        var finalWord = lastChoice;

        //just go with the first type if it has more than one
        var typeOfLastWord = wordTypeDictionary[lastChoice][0];
        typeOfLastWord += 'Rhyming';       

        //if there's a list of words in the same part of speech that rhyme, then pick a random one from that list
        if(grammar.hasOwnProperty(typeOfLastWord) && grammar[typeOfLastWord].length > 0) {
          finalWord = grammar[typeOfLastWord][Math.floor(Math.random()*grammar[typeOfLastWord].length)];
          //console.log(typeOfLastWord + ' ----- ' + 'RHYMES');
        }

        outputSentence += finalWord;

        constructedSentences.push(outputSentence);
    }
    return constructedSentences;
};

var conjugateVerbs = function(verbs) {
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

var declineNounByNumber = function(word, previousDeterminer) {
  console.log(previousDeterminer + "       " + word);
  if((word[word.length - 1] === 's') && (wordTypeDictionary[previousDeterminer].indexOf(wordTypes.DeterminerSingular) > -1)) {
    console.log("SINGULAR: " + word);
    return word.substring(0, word.length - 1);
  } 
  else if ((word[word.length - 1] !== 's') && wordTypeDictionary[previousDeterminer].indexOf(wordTypes.DeterminerPlural) > -1) {
    console.log("PLURAL: " + word);
    return word + 's';
  }
  return word;
};

var conjugateVerbPresentByPerson = function(word, previousWord, modalPresent) {
  var nonThirdPersonPronouns = ['I', 'you', 'we', 'they'];
  if(nonThirdPersonPronouns.indexOf(previousWord) > -1 || modalPresent) {
    if(word === 'be') {
      //console.log("CONJUGATE VP REST: " + word);
      //console.log("CONJUGATED - " + conjugate('you', word));
      return conjugate('you', word);
    } 
    if(word[word.length - 1] === 's') {
      //console.log("CONJUGATE VP REST: " + word);
      //console.log("CONJUGATED - " + word.substring(0, word.length - 1));
      console.log(word.substring(0, word.length - 1));
      return word.substring(0, word.length - 1); //truncate the s manually since the module doesn't unless it's an easy and common one -.-
    }
  }
  else {
    if(word === 'be') {
      //console.log("CONJUGATE VP 3rd P: " + word);
      //console.log("CONJUGATED - " + conjugate('it', word));
      return conjugate('it', word);
    } 
    if(word[word.length - 1] !== 's') {
      //console.log("CONJUGATE VP 3rd P: " + word);
      //console.log("CONJUGATED - " + word + 's');
      return word + 's'; //add the s manually since the module only deals with common and easy words -.-
    }
  }
};

var conjugateAuxiliaryVerbBeByPerson = function(word, previousWord) {
  if(wordTypeDictionary[previousWord].indexOf(wordTypes.PronounNominative) > -1) {
    var werePronouns = ['you', 'we', 'they'];
    if(word === 'be') {
     // console.log("CONJUGATE BE: " + word);
      return conjugate(previousWord, word);
    } 
    else if(word === 'was' && werePronouns.indexOf(previousWord) > -1) {
      //neither the nlp_compromise nor conjugate module can conjugate the past tense of 'be' by person, so we have to do it manually
      return 'were';
    }
  }
  return word;
};