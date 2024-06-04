const prompt = require("prompt-sync")({ sigint: true });
const convert = require("xml-js");
const nlp = require("compromise");
const qs = require("qs");
const axios = require('axios');

// Part of Speech Tags Mapping
const partOfSpeechMap = {
    "NN": "Noun",
    "NNS": "Noun (plural)",
    "NNP": "Proper Noun",
    "NNPS": "Proper Noun  ",
    "PRP": "Pronoun",
    "VB": "Verb",
    "VBD": "Verb  ",
    "VBG": "Verb  ",
    "VBN": "Verb  ",
    "VBP": "Verb  ",
    "VBZ": "Verb  ",
    "RB": "Adverb",
    "RBR": "Adverb  ",
    "RBS": "Adverb  ",
    "JJ": "Adjective",
    "JJR": "Adjective  ",
    "JJS": "Adjective  ",
    "IN": "Preposition",
    "DT": "Determiner",
    "CC": " Conjunction",
    "CD": "Cardinal Number",
    "FW": "Foreign Word",
    "LS": "List Item Marker",
    "MD": "Modal",
    "PDT": "Predeterminer",
    "POS": "Possessive Ending",
    "RP": "Particle",
    "SYM": "Symbol",
    "TO": "to",
    "UH": "Interjection",
    "WDT": "Wh-determiner",
    "WP": "Wh-pronoun",
    "WP$": "Possessive Wh-pronoun",
    "WRB": "Wh-adverb"
     
};

// Function to generate the Fibonacci series up to a certain number
function generateFibonacciSeriesBetween(start, end, callback) {
    let firstNumber = 0,
        secondNumber = 1,
        nextTerm;

    const series = [];

    nextTerm = firstNumber + secondNumber;

    // Generate Fibonacci series up to the upper limit
    while (nextTerm <= end) {
        if (nextTerm >= start) {
            series.push(nextTerm);
        }
        firstNumber = secondNumber;
        secondNumber = nextTerm;
        nextTerm = firstNumber + secondNumber;
    }

    callback(series);
}

// Callback function to display the series
function displaySeries(series) {
    if (series.length === 0) {
        console.log("No Fibonacci numbers in the given range.");
    } else {
        console.log("Fibonacci Series in the given range:");
        series.forEach((term) => console.log(term));
    }
}


// Curried function for converting XML to JSON
const convertXmlToJson = (xmlData) => (options) => {
    return convert.xml2json(xmlData, options);
};

const options = {
    compact: true,
    spaces: 2,
};

// Higher-order function to create a part of speech finder
const createPartOfSpeechFinder = (axiosInstance) => {
    return async (text) => {
        const apiKey = '7600cb7dd7716d78150be2aa102a75154f41b251203004ad966d6bb6'; // Replace with your actual API key
        const url = 'https://api.textrazor.com/';

        try {
            const response = await axiosInstance.post(url, qs.stringify({
                extractors: 'words',
                text
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-textrazor-key': apiKey
                }
            });

            const data = response.data;
            console.log('Full response:', JSON.stringify(data, null, 2)); // Pretty print the full response for better readability

            // Explore the response structure to find the correct path to 'words'
            if (data.response && data.response.sentences) {
                const partOfSpeechTags = data.response.sentences.flatMap(sentence =>
                    sentence.words.map(word => ({
                        word: word.token,
                        tag: partOfSpeechMap[word.partOfSpeech] || word.partOfSpeech
                    }))
                );
                console.log('Part of Speech Tags:', partOfSpeechTags);
            } else {
                console.log('No Part of Speech tags found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
};

// IIFE function to handle user inputs and selections
(  async function() {
    const users = [];
    const polls = [];

    function addUser(firstName, lastName, phoneNumber, emailAddress) {
        const newUser = { firstName, lastName, phoneNumber, emailAddress };
        let foundDuplicate = false;
        const relatedUsers = [];

        users.forEach(user => {
            if (user.phoneNumber === phoneNumber || user.emailAddress === emailAddress || user.lastName === lastName || user.firstName === firstName) {
                foundDuplicate = true;
                relatedUsers.push(user);
            }
        });

        if (!foundDuplicate) {
            // If no duplicate is found, add the new user
            users.push(newUser);
            console.log(`User added: ${JSON.stringify(newUser)}`);
        } else {
            // If a duplicate is found, handle duplicates
            relatedUsers.forEach(user => polls.push({ user }));
            polls.push({ user: newUser });
            console.log(`Duplicate user detected. Created entries for duplicates.`);

            // Ensure the new user is included in the main users list
            if (!users.includes(newUser)) {
                users.push(newUser);
            }
        }
    }

    function promptUserForDetails() {
        const firstName = prompt('Enter first name: ');
        const lastName = prompt('Enter last name: ');
        const phoneNumber = prompt('Enter phone number: ');
        const emailAddress = prompt('Enter email address: ');

        addUser(firstName, lastName, phoneNumber, emailAddress);
    }

    const key = prompt(
        "Which Function you want to execute: \n(1) Callback (Fibonacci) (2) Curry (XML to JSON)(3) IIFE (word counter) (4) HOF (part of speech) (5) HOF (Add User)\n"
    );

    switch (key) {
        case "1":
          

            const start = parseInt(prompt("Enter the start number of the range: "));
            const end = parseInt(prompt("Enter the end number of the range: "));
            
            if (isNaN(start) || isNaN(end)) {
                console.log("Please enter valid numbers.");
            } else {
                generateFibonacciSeriesBetween(start, end, displaySeries);
            }
            break;
        case "2":
            const xmlData = prompt('Please enter XML data: ');

            // Convert XML to JSON
            const jsonResult = convertXmlToJson(xmlData)(options);

            console.log('Converted JSON:');
            console.log(jsonResult);
            break;
        case "3":
            const wordCount = (() => {
                return function(input) {
                    const words = input.split(" ");
                    const result = {};
                    words.forEach((word) => {
                        result[word] = result[word] + 1 || 1;
                    });
                    return result;
                };
            })();

            const inputParagraph = prompt("Enter the paragraph: ");
            const counts = wordCount(inputParagraph);
            console.log(counts);
            break;
        case "4":
            const findPartOfSpeech = createPartOfSpeechFinder(axios);
            const sentence = prompt("Enter the sentence: ");
            await findPartOfSpeech(sentence);
            break;
        case "5":
            let moreUsers = true;
            while (moreUsers) {
                promptUserForDetails();
                const more = prompt('Do you want to add another user? (yes/no): ').toLowerCase();
                moreUsers = (more === 'yes');
            }
            console.log('All users:', users);
            console.log('Entries for duplicate users:', polls);
            break;
        default:
            console.log("Invalid choice.");
    }
})();
