var mainHandler = require('../index');

var intent = {
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
};

mainHandler._setTopicInSession(intent, null, function() {
  console.log("SUCCESS - No syntax errors");
})

