/**
 * Created by ianb on 1/25/2016.
 */
exports.convertVersesToOutput = function(songVerses, entryText, callback) {
        var audioEndpoints = require('../services/audioEndpoints').audioEndpoints;
        var randomAudioIndex = Math.floor((Math.random() * audioEndpoints.beats.length) + 1) - 1;
        var audioName = audioEndpoints.beats[randomAudioIndex].title;
        var audioPath = audioEndpoints.baseUrl + audioName + '/' + audioName + '-' + 0 + '.mp3';
        var outputText = '';
        var outputSSML = '<speak><p>' + entryText + '</p>';

        outputSSML += "<audio src='"+audioPath+"' />";
        for(var verseIndex = 0; verseIndex < songVerses.length; verseIndex ++){
            var verse = songVerses[verseIndex];
            outputSSML += '<p>';
            for(var lineIndex = 0; lineIndex < verse.length; lineIndex ++){
                line = verse[lineIndex];
                outputSSML += line + '<break time="5ms" />';
                outputText += line + ', ';
            }
            audioPath = audioEndpoints.baseUrl + audioName + '/' + audioName + '-' + (verseIndex + 1) + '.mp3';
            outputSSML += '</p>';
            outputSSML += "<audio src='"+audioPath+"' />";

        }

    outputSSML += '</speak>'

        var outputs = {
            "text":outputText,
            "ssml":outputSSML
        };

        callback(outputs);
    }
