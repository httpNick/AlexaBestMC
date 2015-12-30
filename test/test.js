var rhyme = require('rhyme-plus');
var gg = require('grammar-graph');

var grammar = {
  Sentence: ['NounPhrase VerbPhrase'],
  NounPhrase: [
    'the Noun',
    'the Noun RelativeClause'
  ],
  VerbPhrase: [
    'Verb',
    'Verb NounPhrase'
  ],
  RelativeClause: ['that VerbPhrase'],
  Noun: [
    'dog',
    'cat',
    'bird',
    'squirrel'
  ],
  Verb: [
    'befriended',
    'loved',
    'ate',
    'attacked'
  ]
}

var graph = new gg(grammar);
console.log(graph.vertices());
