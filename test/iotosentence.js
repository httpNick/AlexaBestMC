var gg = require('grammar-graph')
, JSONStream = require('JSONStream')
, fs = require('fs')
, es = require('event-stream')
, services = require('./servicetesting')
, topic = '';
process.stdin.setEncoding('utf8')

var generateSentencePool = (grammar, cb) => {
  process.stdout.write('topic is: ' + topic)
  topic = topic.replace(/(\r\n|\n|\r)/gm,"")
  grammar.TopicWord.push(topic);
  var guide = new gg(grammar).createGuide('OneLine')
  , recog = new gg(grammar).createRecognizer('OneLine')
  , currSentence = '';
  services.topicRequest(topic, (results) => {
    console.log(results);
    grammar.RhymesWithTopic.push(results.)
    while (!recog.isComplete(currSentence)) {
      guide.choose(
        guide.choices()[
          Math.floor(Math.random()*guide.choices().length)
        ]
      );

      currSentence = guide.constructs()[
        Math.floor(Math.random()*guide.constructs().length)
      ];
    }

    cb(currSentence);
  });
}

var parser = JSONStream.parse()
, sentenceGenerator = es.mapSync((data) => {
  generateSentencePool(data, (resultSentence) => {
    console.log(resultSentence);
    return resultSentence;
  })
})

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    topic = chunk;
    var rStream = fs.createReadStream(
      __dirname + '/res/simplerhymerules.json'
    ).pipe(
      parser
    ).pipe(
      sentenceGenerator
    );
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end')
});
