/*******************************************************************************
 * Author: Tyler Freitas
 * Date: 11-05-2018
 * Description: This program reads in a utf8 endcoded text file specified by the
 user as a command line argument. It compiles a list of the words present in the
 text file along with the number of times each word appears and the starting
 indices of each occurrence of each word.

 A word is defined as a sequence of valid characters. A character's validity is
 determined using the testChar function that is passed to wordCount(). The
 current test function is isValidCharacter(), which defines a valid character as
 one that is either a lowercase alphabetical character or an apostrophe.

 Words are delimited by characters that are not valid in words.

 The current implementation is equipped to handle apostrophes as parts of words,
 however it does not handle single quotes outside of words. This means that
 text files are not allowed to contain the ' character unless it is being used
 as an apostrophe.

 File size is restricted by the limitations of readFile().
*******************************************************************************/
var fs = require('fs');


/*******************************************************************************
 * Description: This function opens a text file with the name that was
 passed as a command line argument and counts the number of times each word
 appears in the file. It also keeps track of the starting indices of each
 occurrence of each word. After processing the file, it print each word found
 in the file, the number of times it occurred, and the indices where it
 occurred. This function must be passed a testChar function, which will
 determine if a character is allowed to be in a word.
 * Preconditions:
    - The user provides a valid filename for a text file.
    - The file uses utf8 encoding.
    - The function receives a testChar function that returns true if a character
    is valid in words and false otherwise.
 * Postconditions:
    - Each word in the file is printed to the console along with the number of
    times it appears and the indices where it appears.
*******************************************************************************/
function wordCount(testChar){
    // Read in the user specified file.
    fs.readFile(process.argv[2], 'utf8', function (err, data){
        // If an error occurs, display its message.
        if(err){
            console.log(err.message);
        }
        // If the file read was successful, process the text and display the
        // results.
        else{
            var wordCounts = processText(data, testChar);
            displayWordCount(wordCounts);
        }
    });
}


/*******************************************************************************
 * Description: This class describes the meta data associated with each word in
 a text file. It is composed of the word's frequency (count) and an array of
 the indices where the word occurs (location).
*******************************************************************************/
class WordMetaData {
    constructor(location){
        this.count = 1;
        this.location = [location + 1];
    }
}

/*******************************************************************************
 * Description: This function tests to see if the character passed as an
 argument is a valid character in a word. Words may be composed of lowercase
 alphabetical characters or apostrophes. The function returns true if the
 character is valid in a word and false otherwise.
 * Preconditions:
    - The function receives a character argument.
 * Postconditions:
    - The function returns true if the character is a lowercase
    alphabetical character or if it is an apostrophe. It returns false
    otherwise.
*******************************************************************************/
function isValidCharacter(char){
    return (char >= 'a' && char <= 'z') || char === '\'';
}

/*******************************************************************************
 * Description: This function converts a string to lowercase and counts the
 occurrence of each word in the string. It keeps track of this frequency as
 well as the indices of each occurrence or each word.
 * Preconditions:
    - This function is passed a string.
    - This function is passed a function to test if a character is allowed to be
    part of a word.
 * Postconditions:
    - This function returns an object mapping each word to another object
    composed of the number of times the word occurred in the text and an array
    holding the indices where it occured.
*******************************************************************************/
function processText(text, testChar){
    // Convert the string to lowercase.
    text = text.toLowerCase();
    text += " ";

    var start = 0;
    var end = 0;
    var words = {};
    var word;

    // Walk through the string until a non-alphabetical character is reached.
    // and record the word that occurred before that point.
    while(end < text.length){
        // If the current character is alphabetical, extend end.
        if(testChar(text[end])){
            end++;
        }
        // If the current character is not alphabetical and a word is currently
        // being tracked, record the word's count and location and update start
        // and end to be the next unchecked character.
        else if(end > start){
            word = text.substring(start, end);

            if(word in words){
                words[word].count++;
                words[word].location.push(start + 1);
            }
            else{
                words[word] = new WordMetaData(start);
            }

            end++;
            start = end;
        }
        // If the current character is not alphabetical and a word is NOT being
        // tracked, update start and end to the next unchecked character.
        else{
            end++;
            start = end;
        }
    }

    return words;
}


/*******************************************************************************
 * Description: This function takes an object mapping words to metadata. It
 displays each word, its count, and a list of the locations where it occurred.
 * Preconditions:
    - The funciton is passed an object that maps words to metadata of type
    WordMetaData.
 * Postconditions:
    - Each word is displayed along with its metadata.
*******************************************************************************/
function displayWordCount(words){
    for(var word in words){
        // Create comma separated list of each word's starting indices.
        var locationString = JSON.stringify(words[word].location);
        locationString = locationString.substring(1,locationString.length - 1);

        var countString = JSON.stringify(words[word].count);
        // Output each word, the number of times it occurred, and the list of
        // its starting indices.
        var outputString = word.padEnd(15, ' ') +
            countString.padEnd(10, ' ') +
            locationString;

        console.log(outputString);
    }
}

wordCount(isValidCharacter);
