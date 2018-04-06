       // Initialize Firebase
var config = {
    apiKey: "AIzaSyCovVVlsXlrsuqPEpGl2k6F0mIcvRtgex4",
    authDomain: "rps-db-e60f8.firebaseapp.com",
    databaseURL: "https://rps-db-e60f8.firebaseio.com",
    projectId: "rps-db-e60f8",
    storageBucket: "",
    messagingSenderId: "19997797929"
};
firebase.initializeApp(config);

var db = firebase.database();

     
var playerOne;
var playerTwo;

// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s"];

// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var wins = 0;
var losses = 0;
var ties = 0;




// This function is run whenever the user presses a key.
document.onkeyup = function(event) {

    // Determines which key was pressed.
    var userGuess = event.key;

    // Randomly chooses a choice from the options array. This is the Computer's guess.
    var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

    // Reworked our code from last step to use "else if" instead of lots of if statements.

    // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
    if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

    if ((userGuess === "r") && (computerGuess === "s")) {
        wins++;
    } else if ((userGuess === "r") && (computerGuess === "p")) {
        losses++;
    } else if ((userGuess === "s") && (computerGuess === "r")) {
        losses++;
    } else if ((userGuess === "s") && (computerGuess === "p")) {
        wins++;
    } else if ((userGuess === "p") && (computerGuess === "r")) {
        wins++;
    } else if ((userGuess === "p") && (computerGuess === "s")) {
        losses++;
    } else if (userGuess === computerGuess) {
        ties++;
    }

        // Creating a variable to hold our new HTML. Our HTML now keeps track of the user and computer guesses, and wins/losses/ties.
        var html =
          "<p>You chose: " + userGuess + "</p>" +
          "<p>The computer chose: " + computerGuess + "</p>" +
          "<p>wins: " + wins + "</p>" +
          "<p>losses: " + losses + "</p>" +
          "<p>ties: " + ties + "</p>";

        // Set the inner HTML contents of the #game div to our html string
        document.querySelector("#game").innerHTML = html;
      }
    };
