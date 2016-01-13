var research = require("suboptimal-research-tool");
research("bagel", function(err, subject){
	if(err){
		return console.error(err);
	}
	console.log(
		subject.singular, // "bat"
		subject.plural, // "bats"
		subject.adjectives, // ["scary", etc.]
		subject.verbs // ["hibernate", etc.]
	);
});
