var verseConverter = require('../components/verseConverter');
var verses = [
    [
        "Lay me down a sick beat while I rap about a topic",
        "I'll take any subject and return an Object",
        "From the bottom of the barrel yeah I lock it and I clock it ",
        "From the bottom to the top unless you think you can top it"
    ],
    [
        "Relating words left and rhyming words right",
        "This second verse will be as fly as the first",
        "Rapping through the day and on through the night",
        "Alexa's got the fire to set this place alight"

    ],
    [
        "A third first line will go right here",
        "on subject on topic on load on point",
        "rapping like this every day month and year",
        "wrapping all around like Chewbacca's bandoleer"
    ],
    [
        "Wrap it up rapping with verse number four",
        "Making rhymes making money making lines making green",
        "Going yellow going red like a traffic semaphore",
        "Gotta stop now but you can always ask for more"
    ]
];

verseConverter.convertVersesToOutput(verses, function(outputs){
    console.log(outputs.ssml);
});