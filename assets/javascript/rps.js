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

var judgeChoice1 = "";
var judgeChoice2 = "";

var playerOneDone = false;
var playerTwoDone = false;
var dataUpdatePlay1 = "";
var dataUpdatePlay2 = "";

var waitTimer;

window.onload = function (){
    $(".add-player1").on("click", addNewUser1);
    $(".add-player2").on("click", addNewUser2);
    $(".choiceBtn").on("click", ".btn-rps", judgeMaster);

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
    
        console.log("p1 " + playnum1);
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
        var playnum2 = $("#name-input2").attr("data-player");
    
        console.log("p1 " + playnum2);
        firedb.ref().push({
            CameronRPS: {
                player: {"2": 
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
                console.log("prev key1 " + childkey );
                $("#wait1").text(showPlay);
                //clearInterval(waitTimer);
                //$('#wait1').hide();
    
            }
            else if (cSnap.val().player.hasOwnProperty("2")){
                showPlay = cSnap.val().player["2"].name;
                showWins = cSnap.val().player["2"].wins;
                showLosses = cSnap.val().player["2"].losses;
                showTies = cSnap.val().player["2"].ties;
                showDate = cSnap.val().dateAdded;
                $("#play2BtnGrp").attr('data-key', childkey);
                console.log("prev key2 " + childkey );
                $("#wait2").text(showPlay);
            }
        }
        listGetter(childSnapshot, childSnapshot.key)  
        console.log(childSnapshot.key);
        // Prettify the employee start
        //var empStartPretty = moment.unix(empStart).format("MM/DD/YY");
        // Calculate the months worked using hardcore math
        // To calculate the months worked
        // var empMonths = moment().diff(moment.unix(empStart, "X"), "months");
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

  firedb.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    // console.log("oder by");
    // console.log("key: " + childSnapshot.key);
    // console.log(childSnapshot.val().player);
    // console.log(childSnapshot.val().player[1]);
    //console.log(childSnapshot.val().player[1].name);

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  firedb.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    console.log("in limit");

    var objChild =  snapshot.val()


   for (key in objChild){

       if (key == 'player'){
           if (objChild[key].hasOwnProperty("1")){
               console.log('play1 ready')
               $("#head_mc").text("Waiting for Player 2")

               $(".player2column").show();
            }
            else if (objChild[key].hasOwnProperty("2")){
                console.log('Play 2 ready')
                $("#head_mc").text("GAME ON")
                $(".rps-row").show();
                $(".player2column").show();
                // console.log(objChild[key]["2"].name);
            }
            else{   
                console.log("fail");
                // console.log(objChild[key]);
                // console.log(objChild[key]["1"]);
                // console.log(objChild[key].hasOwnProperty("1"));
                // console.log(typeof(objChild[key]));
           }
       }
   }
//    if (objChild[key].hasOwnProperty("1") === true && objChild[key].hasOwnProperty("2") === true ){
//     $(".rps-row").show();
//     console.log("shower");
//    }




    // Change the HTML to reflect
    // $("#name-display").text(snapshot.val().name);
    // $("#email-display").text(snapshot.val().email);
    // $("#age-display").text(snapshot.val().age);
    // $("#comment-display").text(snapshot.val().comment);
  });


function judgeMaster(event) {


    if ($(this).hasClass( "playerChoice1")){
        
        judgeChoice1 = $(this).val();
        copyChoice1 = $(this).text();
        dataUpdatePlay1 = $(this).parent().attr("data-key");
        $("#show1Choice").text(copyChoice1);
        playerOneDone = true;
        console.log("judge key1: " + dataUpdatePlay1)      
    }
    if ($(this).hasClass( "playerChoice2")) {
        judgeChoice2 = $(this).val();
        copyChoice2 = $(this).text();
        dataUpdatePlay2 = $(this).parent().attr("data-key");
        $("#show2Choice").text(copyChoice2);
        playerTwoDone = true;
    } 

    
    if (playerOneDone === true && playerTwoDone === true) {
        console.log("firstlevel")      
        console.log("p1: " + judgeChoice1 + " |  p2: " + judgeChoice2)      
        
        if ((judgeChoice1 === "r") && (judgeChoice2 === "s")) {
            player1wins++;
            player2Lost++
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
        var dataFirePlay1 = dataUpdatePlay1 + "/player/1"
        console.log(dataFirePlay1);
        var dataFirePlay2 = dataUpdatePlay2 + "/player/2"
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

