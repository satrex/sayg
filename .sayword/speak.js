#!/usr/local/bin/node
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();
// Import other required libraries
const fs = require('fs');
const util = require('util');
const player = require('play-sound')(opts = {player = 'afplay'});
async function main() {
  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();

  // The text to synthesize
  const text = process.argv[2];

  console.log(text);
  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'ja-JP', ssmlGender: 'FEMALE'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const audioFile = 'output.mp3';
  await writeFile(audioFile, response.audioContent, 'binary');

  player.play(audioFile, err => {
    if (err) throw err
  });
  console.log('Audio content written to file: output.mp3');
}
main();
