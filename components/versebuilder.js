
module.exports = {

  generateVerses : (Sentences, cb) => {

    cb(buildVersesV2(Sentences));

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
// ex [[a,b],[c,d],[e,f],[g,h],[i,j],[k,l],[m,n],[o,p],[q,r],[s,t]] => [[],[],[],[]]
function buildVersesV2(tupleOfSentencesThatRhyme){
  //combine four times
  var song = [];
  for(var x = 0; x < 8; x+=2){
    var sentence1 = tupleOfSentencesThatRhyme[x][0];
    var sentence2 = tupleOfSentencesThatRhyme[x][1];
    var sentence3 = tupleOfSentencesThatRhyme[x + 1][0];
    var sentence4 = tupleOfSentencesThatRhyme[x + 1][1];
    var verse = [sentence1, sentence3, sentence2, sentence4];
    song.push(verse);
  }
  return song;
};
