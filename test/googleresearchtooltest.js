var research = require("suboptimal-research-tool");
research("bats", function(err, subject){
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
