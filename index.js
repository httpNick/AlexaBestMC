/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var rhymes = require('rhyme-plus');
var verseConverter = require('./components/verseConverter');
var sentencebuilder, versebuilder, randomwords, words;
sentencebuilder = require('./components/sentencebuilder');
versebuilder = require('./components/versebuilder');
words = require('./services/words.js');
randomwords = require('random-words');
var Q = require('q');

var $ = module.exports;

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
var onIntent = function(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("RapAbout" === intentName) {
        setTopicInSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else {
        throw "Invalid intent";
    }
}
$._onIntent = onIntent;

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "You can give me a one word topic and I’ll rap about it. What should I freestyle about?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what to rap about by saying, " +
        "rap about bagels";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "Here are some things you can say: " +
        "freestyle about Topic, " +
        "rap about Topic ";

    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setTopicInSession(intent, session, callback) {
    console.log("setTopicInSession() called");
    var cardTitle = intent.name;
    var rapTopicSlot = intent.slots.Topic;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var verses = [];
    var outputs = {};

    if(rapTopicSlot) {
        console.log("Topic slot exists");

        var rapTopic = rapTopicSlot.value;

        if(rapTopic) {

            Q.all([

                words.getRelatedWords(rapTopic),
                words.getRelatedWordsFromWordnik(rapTopic),
                words.getRhymingWordsFromRhymeBrain(rapTopic)

            ]).then(function(response) {
                /**
                 * response[0] is the response for twinword
                 * response[1] is the response for wordnik
                 * response[2] is the response of rhyming words from RhymeBrain.
                 */
                if (response[0].associations_array && response[1]) {
                    // Using a set to ensure no duplicates.
                    listWithNoDupes = [];
                    listOfAll =  response[0].associations_array
                        .concat(response[1].sameContext)
                        .concat(response[1].synonym)
                        .concat(response[1].unknown);
                    listOfAll.forEach(function(item) {
                        if(listWithNoDupes.indexOf(item) < 0) {
                            listWithNoDupes.push(item);
                        }
                    });

                    words.getPartsOfSpeech(listWithNoDupes).then(function(posDict) {
                        posDict.topic = [rapTopic];
                        posDict.rhymingWords = response[1].rhyme;
                        words.getPartsOfSpeech(response[1].rhyme.concat(response[2]))
                            .then(function(rhymePosDict) {
                                posDict.NounRhyming = rhymePosDict.nouns;
                                posDict.AdjectiveRhyming = rhymePosDict.adjectives;
                                posDict.AdverbRhyming = rhymePosDict.adverbs;
                                posDict.VerbRhyming = rhymePosDict.verbs;
                                if (response[2]) {
                                    posDict.rhymingWords = posDict.rhymingWords.concat(response[2]);
                                }
                                chooseSevenOtherTopicsAndGetTheRhymingWords(posDict.nouns)
                                    .then(function(result) {
                                        posDict.RelatedWordRhymes = result;
                                        sentencebuilder.generateSentences(posDict, 16, function(results) {
                                            console.log(results);
                                            var verses = [[]];
                                            versebuilder.generateVerses(results, function(resultVerses){
                                                console.log(resultVerses);
                                                verses = resultVerses;
                                            });
                                            verseConverter.convertVersesToOutput(verses, function(outputs) {

                                                sessionAttributes = createRapTopic(rapTopic);

                                                repromptText = "Yo give me another word so I can spit some rhymes.";

                                                callback(sessionAttributes,
                                                    buildSpeechletSSMLResponse(cardTitle, outputs, repromptText, shouldEndSession));
                                            });
                                        });
                                    });
                            });
                    });
                }

            });

        } else {
            speechOutput = "I'm not sure what you want me to rap about. Please try again";
            repromptText = "I'm not sure what you want me to rap about. You can tell me what to " +
                "rap about by saying, rap about bagels";

            callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    } else {
        callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}


/**
 * Finds up to 7 nouns related to the original topic.
 * Get rhyming words for each and spread into different parts of speech.
 */
function chooseSevenOtherTopicsAndGetTheRhymingWords(relatedNouns){
    var randomChoices = [];
    var randomNouns = [];
    if (relatedNouns.length > 7) {
        for(var i = 0; i < 7; i++) {
            var pushed = false;
            while (!pushed) {
                var randomChoice = Math.floor(Math.random()*relatedNouns.length);
                if (randomChoices.indexOf(randomChoice)  <= -1) {
                    pushed = true;
                    randomChoices.push(randomChoice);
                    randomNouns.push(relatedNouns[randomChoice]);
                }
            }
        }
    }  else {
        randomNouns = relatedNouns;
    }
    return Q.Promise(function(resolve, reject) {
        if (randomNouns.length === 7) {
            Q.all([
                words.getRhymingWordsFromRhymeBrain(randomNouns[0]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[1]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[2]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[3]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[4]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[5]),
                words.getRhymingWordsFromRhymeBrain(randomNouns[6])
            ]).then(
                function(response) {
                    var finalResultOfRhymeDictionaries = [];
                    Q.all([
                        words.getPartsOfSpeech(response[0]),
                        words.getPartsOfSpeech(response[1]),
                        words.getPartsOfSpeech(response[2]),
                        words.getPartsOfSpeech(response[3]),
                        words.getPartsOfSpeech(response[4]),
                        words.getPartsOfSpeech(response[5]),
                        words.getPartsOfSpeech(response[6])
                    ]).then( function(finalResult)
                        {
                            for (var i = 0; i < 7; i++) {
                                finalResultOfRhymeDictionaries.push(
                                    {
                                        NounRhyming : finalResult[i].nouns,
                                        AdjectiveRhyming : finalResult[i].adjectives,
                                        AdverbRhyming : finalResult[i].adverbs,
                                        VerbRhyming : finalResult[i].verbs,
                                        TopicWord : [randomNouns[i]]
                                    }
                                );
                            }
                            resolve(finalResultOfRhymeDictionaries);
                        }
                    );
                    //console.log(finalResultOfRhymeDictionaries[0].NounRhyming.length);
                });
        } else /*if it reaches here, there are less than 7 related nouns.*/{
            // Make a request for each related topic
        }
    });
};

function createRapTopic(rapTopic) {
    return {
        rapTopic: rapTopic
    };
}

function getTopicFromSession(intent, session, callback) {
    var rapTopic;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        rapTopic = session.attributes.rapTopic;
    }

    if (favoriteColor) {
        speechOutput = "Your topic is " + rapTopic + ". Goodbye.";
        shouldEndSession = true;
    } else {
        speechOutput = "I'm not sure what your rap topic is, you can say, rap about " +
            " potatoes";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletSSMLResponse(title, outputs, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            text: outputs.ssml
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + outputs.text
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

// --------------------- Other helpers ------------------------

function getRandomValueFromCollection(collection, lowerbound) {
    return collection[Math.floor(Math.random() * collection.length) + lowerbound];
}