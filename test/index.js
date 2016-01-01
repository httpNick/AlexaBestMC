var mainHandler = require('../index');

var intentRequest = {
  "intent": {
    "slots": {
      "Color": {
        "name": "Color",
        "value": "blue"
      },
      "Topic": {
          "name": "Topic",
          "value": "Programming"
      }
    },
    "name": "RapAbout"
  },
  "type": "IntentRequest",
  "requestId": "request5678"
};

var session = {
  "new": false,
  "sessionId": "session1234",
  "attributes": {},
  "user": {
    "userId": null
  },
  "application": {
    "applicationId": "amzn1.echo-sdk-ams.app.[unique-value-here]"
  }
};

mainHandler._onIntent(intentRequest, session, function(sessionAttributes, speechletResponse) {
  console.log('=================================================');
  console.log('----------SPEECHLET RESPONSE----------');
  console.log(speechletResponse);
  console.log('=================================================');
  console.log("SUCCESS - No syntax errors");
})

