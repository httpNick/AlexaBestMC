var WordPos;
WordPos = require('wordpos');

module.exports = {

    /**
     * Module to separate parts of speech into a dictionary for a passed in Array.
     * @param {Array} words : Array of words to be separated into a dictionary indexed on POS.
     * @param {Function} cb : Function to be called after this function completes.
     */
    createPOSDictionary : (words, cb) => {
        new WordPos().getPOS(words, (result) => {
            cb(result);
        });
    }

};