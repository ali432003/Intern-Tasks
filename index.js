// REQUIREMENTS

// 5 functions 1 curry function 1 calback 1 higher order 1 IIFE function 
// 1 function is used to convert xml data to json
//  2 filtering out of repeating words paragraph
//  3 takes sentence and took  out parts of speech 
// 4 fiboonacci series 
//  5 pooling of same data conflict 

import xml2js from "xml2js"
import readline from "readline"

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}



// // Repeating words
// // using simple func
function filterRepeat(para) {
  const wordsArr = para.split(/\s+/);
  const wordCounts = {};

  for (const word of wordsArr) {
    const lowerCaseWord = word.toLowerCase();
    if (wordCounts[lowerCaseWord]) {
      wordCounts[lowerCaseWord]++;
    } else {
      wordCounts[lowerCaseWord] = 1;
    }
  }

  const result = Object.keys(wordCounts).map(word => ({
    word: word,
    count: wordCounts[word]
  }))

  return result;
}

const paraContainingRepeatedWords = async () => {
  try {
    const para = await prompt("Enter paragraph: ");
    const result = filterRepeat(para);
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}


// Function to display the result by calling the iife function to filter out POS

const partsOfSpeechMap = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  prep: 'preposition',
  conj: 'conjunction',
  interj: 'interjection',
  pron: 'pronoun',
  art: 'article'
};

const filterPOS = async (sentence) => {
  try {
    const words = sentence.split(' ');
    const results = [];

    for (const word of words) {
      const url = `https://api.datamuse.com/words?sp=${word}&md=p&max=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0 && data[0].tags && partsOfSpeechMap[data[0].tags[0]]) {
        const result = {
          word: word,
          POS: partsOfSpeechMap[data[0].tags[0]]
        };
        results.push(result);
      } else {
        console.log(`No results found for "${word}"`);
      }
    }

    console.log(results);
    // return results;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// fibonacci series using curry functions
const fibonacciSeriesInRange = (n) => {
  if (n <= 1) {
    return n;
  }

  let a = 0, b = 1, c;
  for (let i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return c;
}

async function FibbonacciUsingCurry() {
  try {
    const start = parseInt(await prompt("Enter start: "));
    const end = parseInt(await prompt("Enter end: "));

    for (let i = start; i <= end; i++) {
      const num = fibonacciSeriesInRange(i)
      if (num >= start && num <= end) {
        console.log(num);
      }
    }

  } catch (err) {
    console.error('Error reading input:', err);
  } finally {
    process.exit()
  }
}


// pool of user
const data = {
  num_of_persons: 0,
  data: []
}


// xml to json
function xmlToJson(xmlString) {
  const parser = new xml2js.Parser();

  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function xmlString() {
  try {
    const xmlString = `<bookstore>
    <book>
      <title>Harry Potter</title>
      <author>J.K. Rowling</author>
    </book>
    <book>
      <title>Lord of the Rings</title>
      <author>J.R.R. Tolkien</author>
    </book>
    <book>
      <title>Chronicles of Narnia</title>
      <author>C.S. Lewis</author>
    </book>
  </bookstore>`

    const jsonString = await xmlToJson(xmlString);
    console.log(`\n\t\t\XML : ${xmlString}\n\t\t ===> \t\t\nJSON : ${JSON.stringify(jsonString, null)}`);
  } catch (err) {
    console.error(err);
  }
}


// calling on user choice 
const calling = async () => {
  try {
    console.log("\x1b[36m"); // Cyan color

    console.log("\n\t\t\x1b[1mWelcome To First TASK\x1b[0m\n");
    console.log("\t\x1b[33mFiltering out of repeating words paragraph (press 1)\x1b[0m\n");
    console.log("\t\x1b[35mFunction takes sentence and took out parts of speech (press 2)\x1b[0m\n");
    console.log("\t\x1b[32mFibonacci series in range (press 3)\x1b[0m\n");
    console.log("\t\x1b[31mpooling of same data conflict (press 4)\x1b[0m\n");
    console.log("\t\x1b[34mXML To JSON (press 5)\x1b[0m\n");
    const userInp = await prompt("\tEnter your choice: ");

    switch (userInp) {
      case "1":
        paraContainingRepeatedWords()
        break;
      case "2":
        (async function () {
          const userInp = await prompt("Enter a sentence : ")
          filterPOS(userInp)
        })()
        break
      case "3":
        FibbonacciUsingCurry()
        break
      case "4":
        (async function () {
          try {
            const data = { num_of_persons: 0, data: [] };

            const num_of_persons = parseInt(await prompt("Enter number of persons: "));
            data.num_of_persons = num_of_persons;
            for (let i = 0; i < num_of_persons; i++) {
              const obj = {};
              obj.name = await prompt(`Enter your name person ${i + 1} : `);
              obj.age = parseInt(await prompt(`Enter your age person ${i + 1} : `));
              obj.number = parseInt(await prompt(`Enter your number person ${i + 1} : `));
              data.data.push(obj);
            }
            const realData = data.data
            const nameSet = new Set();
            const ageSet = new Set();
            const numberSet = new Set();
            const processedObjects = new Set();
            const duplicatesOfName = [];
            const duplicatesOfAge = [];
            const duplicatesOfNumber = [];

            realData.forEach((obj) => {
              const objString = JSON.stringify(obj);

              if (nameSet.has(obj.name) && !processedObjects.has(`${objString}-name`)) {
                duplicatesOfName.push(obj);
                processedObjects.add(`${objString}-name`)
              } else {
                nameSet.add(obj.name);
              }

              if (ageSet.has(obj.age) && !processedObjects.has(`${objString}-age`)) {
                duplicatesOfAge.push(obj);
                processedObjects.add(`${objString}-age`);
              } else {
                ageSet.add(obj.age);
              }

              if (numberSet.has(obj.number) && !processedObjects.has(`${objString}-number`)) {
                duplicatesOfNumber.push(obj);
                processedObjects.add(`${objString}-number`);
              } else {
                numberSet.add(obj.number);
              }
            });

            console.log("Real data:", data);
            console.log("Conflicting data:");
            console.log("Duplicate Names:", duplicatesOfName);
            console.log("Duplicate Ages:", duplicatesOfAge);
            console.log("Duplicate Numbers:", duplicatesOfNumber);
          } catch (err) {
            console.log(err);
          }
        })()
        break
      case "5":
        xmlString()
        break
      default:
        console.log("Invalid input")
        break

    }

  } catch (err) {
    console.log(err)
  }
}


calling()