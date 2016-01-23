/**
 * Created by Chris on 1/22/16.
 */
function findLastWord(o) {
    return (""+o).replace(/[\s\-\.]+$/,'').split(/[\s-]/).pop();
};

console.log(findLastWord("What is the last word of this sentence."))