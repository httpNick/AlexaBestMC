/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var rhymes = require('rhyme-plus');
var wordsService = require('./services/words');

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
    } else if ("WhatsMyTopic" === intentName) {
        getTopicFromSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
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
    var speechOutput = "Welcome please tell me a word to create rap verses for by saying, " +
      "rap about bagels";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what to rap about by saying, " +
        "rap about bagels";
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

    if(rapTopicSlot) {
        console.log("Topic slot exists");

        var rapTopic = rapTopicSlot.value;

        if(rapTopic) {
            wordsService.getRelatedWords(rapTopic, function(err, words) {
                console.log("Related Words: " + words);
                wordsService.getPartsOfSpeech(words, function(pos) {
                    var topicNouns = ['missing nouns'];
                    var topicVerbs = ['missing verbs'];
                    var topicAdjectives = ['missing adjectives'];
                    var topicAdverbs = ['missing adverbs'];
                    var topicRest = ['missing rest'];

                    if(pos) {
                        topicNouns = pos.nouns;
                        topicVerbs = pos.verbs;
                        topicAdjectives = pos.adjectives;
                        topicAdverbs = pos.adverbs;
                        topicRest = pos.rest;
                    }

                    wordsService.getRandomWordsByPos(function(randomWordsPos) {
                        var randomNouns = ['missing nouns'];
                        var randomVerbs = ['missing verbs'];
                        var randomAdjectives = ['missing adjecetives'];
                        var randomAdverbs = ['missing adverbs'];
                        var randomRest = ['missing rest'];

                        if(randomWordsPos) {
                            randomNouns = randomWordsPos.nouns;
                            randomVerbs = randomWordsPos.verbs;
                            randomAdjectives = randomWordsPos.adjectives;
                            randomAdverbs = randomWordsPos.adverbs;
                            randomRest = randomWordsPos.rest;
                        }

                        var getNoun = function() {
                            return getRandomValueFromCollection(randomNouns, 0);
                        };
                        var getVerb = function() {
                            return getRandomValueFromCollection(randomVerbs, 0);
                        };
                        var getAdjective = function() {
                            return getRandomValueFromCollection(randomAdjectives, 0);
                        };
                        var getAdverb = function() {
                            return getRandomValueFromCollection(randomAdverbs, 0);
                        };
                        var getMisc = function() {
                            return getRandomValueFromCollection(randomRest, 0);
                        };
                        /*
                        var getPronoun = function() {
                            return getRandomValueFromCollection(randomPronouns, 0);
                        };
                        var getAuxVerb = function() {
                            return getRandomValueFromCollection(randomAuxVerbs, 0);
                        };
                        */

                        var getTopicNoun = function() {
                            return getRandomValueFromCollection(topicNouns, 0);
                        };
                        var getTopicVerb = function() {
                            return getRandomValueFromCollection(topicVerbs, 0);
                        };
                        var getTopicAdjective = function() {
                            return getRandomValueFromCollection(topicAdjectives, 0);
                        };
                        var getTopicAdverb = function() {
                            return getRandomValueFromCollection(topicAdverbs, 0);
                        };
                        var getMisc = function() {
                            return getRandomValueFromCollection(topicRest, 0);
                        };                        

                        sessionAttributes = createRapTopic(rapTopic);

                        speechOutput = "Lay me down a sick beat while I rap about " + rapTopic + 
                                        getTopicVerb() + " from the " + getTopicNoun() + " now we're " + getTopicNoun() + ". " +
                                        getTopicVerb() + " from the " + getTopicNoun() + " now my whole team " + getVerb() + " " + getTopicNoun() + ". " +
                                        getVerb() + " from the " + getTopicAdjective() + " " + getTopicNoun() + " and now we're " + getNoun() + ". ";

                        repromptText = "Yo give me another word so I can spit some rhymes.";

                        callback(sessionAttributes,
                             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });
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