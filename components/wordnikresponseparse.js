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
            if (res[i].relationshipType) {

                    if (res[i].relationshipType === 'equivalent') {
                        relationships.equivalent = res[i].words;
                    } else if (res[i].relationshipType === 'hypernym') {
                        relationships.hypernym = res[i].words;
                    } else if (res[i].relationshipType === 'cross-reference') {
                        relationships.crossReference = res[i].words;
                    } else if (res[i].relationshipType === 'etymologically-related-term') {
                        relationships.etymologicallyRelatedTerm = res[i].words;
                    } else if (res[i].relationshipType === 'synonym') {
                        relationships.synonym = res[i].words;
                    } else if (res[i].relationshipType === 'rhyme') {
                        relationships.rhyme = res[i].words;
                    } else if (res[i].relationshipType === 'unknown') {
                        relationships.unknown = res[i].words;
                    } else if (res[i].relationshipType === 'same-context') {
                        relationships.sameContext = res[i].words;
                    }
            }
        }
        return relationships;
    }
};