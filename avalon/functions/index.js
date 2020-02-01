/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO(DEVELOPER): Import the Cloud Functions for Firebase and the Firebase Admin modules here.
// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();

const avalon = require('./avalon.js')

var debug = false

function initPlayers() {
  if (debug) {
    // debug mode: 8 players added
    players = ['Danh', 'Minh', 'Sang', 'Viet Anh', 'Quin', 'Myp', 'Hen',  'An']
  } else {
    players = []
  }
}

initPlayers()

///////////// KEY ////////////
// SERVER - CLIENT key
var voteKey = 'vote:'

// New player join
var newPlayerKey = 'New player: '

// Game story
var gameStoryKey = 'gameStory:'

// Default user name
var defaultUserName = 'Master of the game'

///////////// KEY ////////////




exports.runAvalonGame = functions.firestore.document('messages/{messageId}').onCreate(
  async (snapshot) => {
    // Notification details.
    const text = snapshot.data().text;
    console.log (text)

    switch (text){
      case 'startNewSession':
        startNewSession()
        break;
      
        case 'startNewGame':
        startNewGame()
        break;
        
      default:
        if (text.includes(newPlayerKey)) {
          onNewPlayerJoined(text)
        }
          break;
    }
  });

function onNewPlayerJoined(text) {
  var player = text.replace(newPlayerKey, '')
  if (!players.includes(player)) {
    players.push(player)
    var message = `New player joined: ${player}, count = ${players.length}: ${players}`    
  } else {
    var message = "Duplicated player."
  }
  saveMessage(message)
}


function startNewSession() {
  console.log('Start a new session, waiting for player to join.');    
  initPlayers()
}

function startNewGame() {
  console.log('Start a new game with '+ players.length + ' players: ' + players.toString())
  var story = avalon.startGame(players)

  try {
    JSON.parse(story)
  } catch (exception) {
    // Invalid players
    saveMessage(story)
    return
  } 

  var message = gameStoryKey + story
  saveMessage(message)
  
  // Chooes the king
  var king = avalon.chooseKing(players)
  message = 'KING is ' + king
  saveMessage(message)
}

function saveMessage(text) {
  console.log(text)
  admin.firestore().collection('messages').add({
    name: defaultUserName,
    profilePicUrl: '', 
    text: text,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

