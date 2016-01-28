/**
 * Created by ianb on 1/25/2016.
 */
exports.convertVersesToOutput = function(songVerses, callback) {
        var audioName = 'fly-guy';
        var audioPath = '/audio/' + audioName + '/' + 0 + '.mp3';
        var outputText = '';
        var outputSSML = '<speak>';

        outputSSML += '<audio src="'+audioPath+'" />';
        for(var verseIndex = 1; verseIndex <= songVerses.length; verseIndex ++){
            var verse = songVerses[verseIndex];
            for(var lineIndex = 1; lineIndex <= verse.length; lineIndex ++){
                line = verse[lineIndex];
                outputSSML += '<p>' + line + '</p>';
                outputText += line;
            }
            audioPath = '/audio/' + audioName + '/' + verseIndex + '.mp3';
            outputSSML += '<audio src="'+audioPath+'" />';

        }

        outputSSML += '</speak>'

        var outputs = {
            "text":outputText,
            "ssml":outputSSML
        };

        callback(outputSpeech);
    }
