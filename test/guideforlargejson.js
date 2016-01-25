var grammar = require('../components/res/GrammarRulesConfig.json'),
  gg = require('grammar-graph');


var guide = new gg(grammar).createGuide('grammar');
