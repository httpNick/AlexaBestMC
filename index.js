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
function onIntent(intentRequest, session, callback) {
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
    var cardTitle = intent.name;
    var rapTopicSlot = intent.slots.Topic;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(rapTopicSlot) {
        var rapTopic = rapTopicSlot.value;

        if(rapTopic) {
            wordsService.getRelatedWords(rapTopic, function(err, words) {
                wordsService.getPartsOfSpeech(words, function(pos)) {
                    console.log("Related Words: " + words);

                    var here = pos.nouns[Math.floor(Math.random() * pos.nouns.length)];
                    var bottom = pos.nouns[Math.floor(Math.random() * pos.nouns.length)];
                    var chosenVerb = pos.verbs[Math.floor(Math.random() * pos.verbs.length)];
                    
                    sessionAttributes = createRapTopic(rapTopic);

                    speechOutput = "Lay me down a sick beat while I rap about " + rapTopic + 
                                    ". We " + chosenVerb + " from the " + bottom + " and now we're " + here;
                    repromptText = "Yo give me another word so I can spit some rhymes.";

                    callback(sessionAttributes,
                         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
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
