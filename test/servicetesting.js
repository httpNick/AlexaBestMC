var wordService = require('../services/words.js')
// quick and dirty test function for the word services.
, res = wordService.getRelatedWords('apple', (err, result) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log(result);
      return result;
    }
});
