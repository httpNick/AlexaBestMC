var words = require('../services/words.js');

module.exports = {

    extractRelationshipTypesFromWordnik : (res) => {
        var relationships = {

            equivalent : [],
            hypernym : [],
            crossReference : [],
            etymologicallyRelatedTerm : [],
            synonym : [],
            rhyme : [],
            unknown : [],
            sameContext : []

        };

        for (var i = 0; i < res.length; i++) {
            switch (res[i].relationshipType) {

                case 'equivalent' :
                    relationships.equivalent = res[i].words;
                    break;
                case 'hypernym' :
                    relationships.hypernym = res[i].words;
                    break;
                case 'cross-reference':
                    relationships.crossReference = res[i].words;
                    break;
                case 'etymologically-related-term' :
                    relationships.etymologicallyRelatedTerm = res[i].words;
                    break;
                case 'synonym' :
                    relationships.synonym = res[i].words;
                    break;
                case 'rhyme' :
                    relationships.rhyme = res[i].words;
                    break;
                case 'unknown' :
                    relationships.unknown = res[i].words;
                    break;
                case 'same-context' :
                    relationships.sameContext = res[i].words;
                    break;
            }

        }
        return relationships;
    }

};