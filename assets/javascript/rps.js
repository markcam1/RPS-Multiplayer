$( document ).ready(function() {
    console.log( "document loaded" );
});

$( window ).on( "load", function() {
    console.log( "window loaded" );
});

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

var firedb = firebase.database();

// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
 var computerChoices = ["r", "p", "s"];
// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var player1wins = 0;
var player1Lost = 0;
var player1Ties = 0;
var player2wins = 0;
var player2Lost = 0;
var player2Ties = 0;
var userDbData = "";

var judgeChoice1 = "";
var judgeChoice2 = "";

var playerOneDone = false;
var playerTwoDone = false;
var dataUpdatePlay1 = "";
var dataUpdatePlay2 = "";
var choice_1_FromFire = "";

var waitTimer;
var masterKey;
var refMasterKey;

window.onload = function (){
    $(".add-player1").on("click", addNewUser1);
    $(".add-player2").on("click", addNewUser2);
    $(".choiceBtn").on("click", ".btn-rps", choiceGrabber);

    // function blinkWait1() {
    //     $('#wait1').fadeOut(1500);
    //     $('#wait1').fadeIn(1500);
    // }
    // waitTimer = setInterval(blinkWait1, 3000);

    
    //$("#wait1").fadeToggle(3000);
    function addNewUser1 (event) {
        event.preventDefault();
    
        var wins = 0;
        var losses = 0;
        var ties = 0;
        var choice = "";
        var name = $("#name-input1").val().trim();
        var playnum1 = $("#name-input1").attr("data-player");
    
        firedb.ref().push({
            CameronRPS: {
                player: {"1":
                    {name: name,
                    wins: wins,
                    losses: losses,
                    ties: ties,
                    choice: choice
                    }
                },
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
        })
        $("#name-input1").val("");
    }
    
    function addNewUser2 (event) {
        event.preventDefault();
    
        var wins = 0;
        var losses = 5;
        var ties = 0;
        var choice = "";
        var name = $("#name-input2").val().trim();

        var loadFirePlay2 = masterKey + "/CameronRPS/player/"
    
        firedb.ref(loadFirePlay2).update({ 
                "2": 
                    {name: name,
                    wins: wins,
                    losses: losses,
                    ties: ties,
                    choice: choice
                    }
        })
        $("#name-input2").val("");
    }
    firedb.ref().on("child_added", function(childSnapshot, prevChildKey) {
        var showPlay;
        var showWins;
        var showLosses;
        var showTies;
        var showDate;
        
        function listGetter(cSnap, childkey){
            
            var cFull = cSnap.val().CameronRPS.player
        
            if (cFull.hasOwnProperty("1")){
                showPlay = cFull["1"].name;
                showWins = cFull["1"].wins;
                showLosses = cFull["1"].losses;
                showTies = cFull["1"].ties;
                showDate = cSnap.val().dateAdded;
                $("#play1BtnGrp").attr('data-key', childkey);
                $("#play2BtnGrp").attr('data-key', childkey);
               // console.log("prev key1 " + childkey );
                $("#wait1").text(showPlay);
                masterKey = childkey;
                refMasterKey = "\"" + childkey + "\"";
            }

            
        }
        listGetter(childSnapshot, childSnapshot.key)  

        var tr = $(`<tr data-key=${ childSnapshot.key }>`)
        tr.append($('<td>').text(childSnapshot.key));
        tr.append($('<td>').text(showPlay));
        tr.append($('<td>').text(showWins));
        tr.append($('<td>').text(showLosses))
        tr.append($('<td>').text(showTies))
        tr.append($('<td>').text(showDate))
        tr.append($('<td>').append($('<button class="delete">').text('Delete me!')))
      
        $("#db-table > tbody").append(tr);
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
}

  $(document).on('click', '.delete', function() {
    var tableRow = $(this).parent().parent()
    var key = tableRow.attr('data-key')
  
    firedb.ref().child(key).remove()
    tableRow.remove()
  })

 

    firedb.ref().on("value", function(snapshot){
        console.log("new cam");      
        
        var snapChild =  snapshot.val()
        checkPath1 = masterKey + "/CameronRPS/player/1"
        is_Player1_alive = snapshot.child(checkPath1).exists()
        checkPath2 = masterKey + "/CameronRPS/player/2"
        is_Player2_alive = snapshot.child(checkPath2).exists()

        if (is_Player2_alive){    
            for (key in snapChild){
                if (key == masterKey){ 
                    if (snapChild[key].CameronRPS.player){
                        var play2Path = snapChild[key].CameronRPS.player["2"]; 
                        choice_2_FromFire = play2Path.choice;
                        $("#wait2").text(play2Path.name);
                        $(".rps-row").show();
                    }
                }
            }
        }
        if (is_Player1_alive) {
            for (key in snapChild){
                if (key == masterKey){ 
                    if (snapChild[key].CameronRPS.player){
                        var play1Path = snapChild[key].CameronRPS.player["1"]; 
                        choice_1_FromFire = play1Path.choice;
                    }  
                }
            }
        }
        else{
            console.log("new cam FAIL -------------");
        }



    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      })


      function judgeMaster () {
          console.log("judge")      
          console.log(playerOneDone + " : " + playerTwoDone)
          judgeChoice1 = choice_1_FromFire;
          judgeChoice2 = choice_2_FromFire;    
          
          if (playerOneDone === true && playerTwoDone === true) {
              console.log("p1: " + judgeChoice1 + " |  p2: " + judgeChoice2)      
              
              if ((judgeChoice1 === "r") && (judgeChoice2 === "s")) {
                player1wins++;
                player2Lost++
                console.log("judge lev1")      
            } else if ((judgeChoice1 === "r") && (judgeChoice2 === "p")) {
                player2wins++;
                player1Lost++
            } else if ((judgeChoice1 === "s") && (judgeChoice2 === "r")) {
                player2wins++;
                player1Lost++
            } else if ((judgeChoice1 === "s") && (judgeChoice2 === "p")) {
                player1wins++;
                player2Lost++
            } else if ((judgeChoice1 === "p") && (judgeChoice2 === "r")) {
                player1wins++;
                player2Lost++
            } else if ((judgeChoice1 === "p") && (judgeChoice2 === "s")) {
                player2wins++;
                player1Lost++
            } else if (judgeChoice1 === judgeChoice2) {
                player1Ties++;
                player2Ties++;
            }
            dbUpdater();
        }

        function dbUpdater (){
            console.log("data____Fire");
    
            playerOneDone, playerTwoDone = false;
            var dataFirePlay1 = masterKey + "/CameronRPS/player/1"
            console.log(dataFirePlay1);
            var dataFirePlay2 = masterKey + "/CameronRPS/player/2"
            console.log(dataFirePlay2);
    
            firedb.ref(dataFirePlay1).update({
                    wins: player1wins,
                    losses: player1Lost,
                    ties: player1Ties,
                })
                firedb.ref(dataFirePlay2).update({
                    wins: player2wins,
                    losses: player2Lost,
                    ties: player2Ties,
            })
        }

      }


  firedb.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    // console.log("in limit");

    var objChild =  snapshot.val()
    // console.log(objChild);

 
        for (key in objChild){
            
            if (key == 'CameronRPS') {   

                if (objChild[key].hasOwnProperty("player")){
                    //console.log(objChild[key].player);
                    propPlay = objChild[key].player;
                    
                    if (propPlay.hasOwnProperty("2")) {
                        userDbData = propPlay["2"].name;                        
                        $("#head_mc").text("GAME ON")
        
                        $(".player2column").show();
                    }
                    if (propPlay.hasOwnProperty("1")){
                        //console.log('play1 ready');
                        $("#head_mc").text("Waiting for Player 2");
                        $(".player2column").show();
                    }
                 }
            }
        }
    // Change the HTML to reflect
    // $("#name-display").text(snapshot.val().name);
    // $("#email-display").text(snapshot.val().email);
    // $("#age-display").text(snapshot.val().age);
    // $("#comment-display").text(snapshot.val().comment);
  });


function choiceGrabber(event) {


    if ($(this).hasClass( "playerChoice1")){
        
        btnChoice1 = $(this).val();
        copyChoice1 = $(this).text();
        dataUpdatePlay1 = $(this).parent().attr("data-key");
        var dataFirePlay1 = dataUpdatePlay1 + "/CameronRPS/player/1"
        $("#show1Choice").text(copyChoice1);
        playerOneDone = true;

        dbChoiceUpdater(btnChoice1, dataFirePlay1);
    }
    if ($(this).hasClass( "playerChoice2")) {
        btnChoice2 = $(this).val();
        copyChoice2 = $(this).text();
        dataUpdatePlay2 = $(this).parent().attr("data-key");
        var dataFirePlay2 = dataUpdatePlay2 + "/CameronRPS/player/2"
        $("#show2Choice").text(copyChoice2);
        playerTwoDone = true;
        
        dbChoiceUpdater(btnChoice2, dataFirePlay2);
    } 

    function dbChoiceUpdater (choiceForDB,dbKey){
        //console.log("choice db");
         var fireChoice = choiceForDB;
         var keyNode = dbKey;

        //playerOneDone, playerTwoDone = false;
        // console.log(fireChoice);
        // console.log(keyNode);

        firedb.ref(keyNode).update({
            choice: fireChoice
            })
    }

    judgeMaster();
}

