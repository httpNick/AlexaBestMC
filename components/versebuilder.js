
module.exports = {

  generateVerses : (Sentences, cb) => {

    cb(buildVerses(Sentences));

  }
};



function buildVerses(listOfSentencesThatRhyme){
  //always have 16 sentences 
  var song = [];
  var count = 0;
  for(var x = 0;x < 4;x++){
    var verse = [];
    song[x] = verse;
    for(var y = 0; y < 4; y++){
      verse[y] = listOfSentencesThatRhyme[count];
      count++;
    }
  }
  return song;
};
