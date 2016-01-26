var words = require('../services/words.js');

module.exports = {

    extractRelationshipTypesFromWordnik : (res) => {
        if (res) {
            res = res[0];
        }
    }

};

test = () => {
    words.getRelatedWordsFromWordnik('apple', (err, data) => {
        console.log(data);
        if (err) {
            console.log(err)
        } else {
            module.exports.extractRelationshipTypesFromWordnik(data);
        }
    });
};

test();