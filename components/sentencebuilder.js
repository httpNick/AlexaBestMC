var gg = require('grammar-graph')
, JSONStream = require('JSONStream')
, fs = require('fs')

module.exports = {

  /**
  Takes in a blob of words and a callback.
  @param {Object} words: Object that atleast contains a list of nouns/verbs.
  @param {callback} cb: callback to use once this function is finished executing.
  */
  generateSentences : (words, cb) => {
    var sentences = [];
    
    cb(sentences);
  }

}
