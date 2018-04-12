$( document ).ready(function() {
    console.log( "document loaded" );
});

$( window ).on( "load", function() {
    console.log( "window loaded" );
});

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
var player1wins = 0;
var player1Lost = 0;
var player1Ties = 0;
var player2wins = 0;
var player2Lost = 0;
var player2Ties = 0;
//var userDbData = "";
var turn = 0;
var turnCheck = 0;
var judgeChoice1 = "";
var judgeChoice2 = "";
var playerOneDone = false;
var playerTwoDone = false;
var dataUpdatePlay1 = "";
var dataUpdatePlay2 = "";
var choice_1_FromFire = "";
var choice_2_FromFire = "";
var waitTimer;
var masterKey;
var refMasterKey;

window.onload = function (){
    $(".add-player1").on("click", addNewUser1);
    $(".add-player2").on("click", addNewUser2);
    //$(".choiceBtn").on("click", ".btn-rps", choiceGrabber);
    $(".choiceBtn").on("click", ".btn-rps", newGrabber);

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
        var turn = 0;
        var choice = "";
        var name = $("#name-input1").val().trim();
    
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
                turn: turn,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
        })
        $("#name-input1").val("");

        var btnRockShow1 = $('<button value="r">').text("ROCK");
        btnRockShow1.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice1'
          })
        var btnPaperShow1 = $('<button value="p">').text("PAPER");
        btnPaperShow1.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice1'
          })
        var btnScissorsShow1 = $('<button value="s">').text("SCISSORS");
        btnScissorsShow1.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice1'
          })

        $("#play1BtnGrp").append(btnRockShow1);
        $("#play1BtnGrp").append(btnPaperShow1);
        $("#play1BtnGrp").append(btnScissorsShow1);
    }
    
    function addNewUser2 (event) {
        event.preventDefault();
    
        var wins = 0;
        var losses = 0;
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

        var btnRockShow2 = $('<button value="r">').text("ROCK");
        btnRockShow2.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice2'
          })
        var btnPaperShow2 = $('<button value="p">').text("PAPER");
        btnPaperShow2.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice2'
          })
        var btnScissorsShow2 = $('<button value="s">').text("SCISSORS");
        btnScissorsShow2.attr({
            'type': 'button',
            'class': 'btn btn-success btn-lg btn-rps playerChoice2'
          })

        $("#play2BtnGrp").append(btnRockShow2);
        $("#play2BtnGrp").append(btnPaperShow2);
        $("#play2BtnGrp").append(btnScissorsShow2);
        startButtonState();
    }
}

firedb.ref().on("child_added", function(childSnapshot, prevChildKey) {
    var showPlay;
    var showDate;
    
    function listGetter(cSnap, childkey){
        var cFull = cSnap.val().CameronRPS.player
    
        if (cFull.hasOwnProperty("1")){
            showPlay = cFull["1"].name;
            showDate = cSnap.val().CameronRPS.dateAdded;
            $("#play1BtnGrp").attr('data-key', childkey);
            $("#play2BtnGrp").attr('data-key', childkey);
            masterKey = childkey;
            refMasterKey = "\"" + childkey + "\"";
        }
    }
    listGetter(childSnapshot, childSnapshot.key)  

    var tr = $(`<tr data-key=${ childSnapshot.key }>`)
    tr.append($('<td>').text(childSnapshot.key));
    tr.append($('<td>').text(showPlay));
    tr.append($('<td>').text(showDate))
    tr.append($('<td>').append($('<button class="delete">').text('Delete me!')))
    
    $("#db-table > tbody").append(tr);
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


$(document).on('click', '.delete', function() {
var tableRow = $(this).parent().parent()
var key = tableRow.attr('data-key')
firedb.ref().child(key).remove()
tableRow.remove()
})

firedb.ref().on("value", function(snapshot){
    
    var snapChild =  snapshot.val()
    checkPlayerPath1 = masterKey + "/CameronRPS/player/1"
    is_Player1_alive = snapshot.child(checkPlayerPath1).exists()
    checkPlayerPath2 = masterKey + "/CameronRPS/player/2"
    is_Player2_alive = snapshot.child(checkPlayerPath2).exists()
    
    checkTurnPath = masterKey + "/CameronRPS/"
    is_GameOn = snapshot.child(checkTurnPath).exists()


    if (is_Player2_alive){    
        for (key in snapChild){
            if (key == masterKey){ 
                if (snapChild[key].CameronRPS.player){
                    var play2Path = snapChild[key].CameronRPS.player["2"]; 
                    choice_2_FromFire = play2Path.choice;
                    $("#wait2").text(play2Path.name);
                    $(".rps-row").show();
                    $("#w2").text(play2Path.wins);
                    $("#l2").text(play2Path.losses);
                    $("#t2").text(play2Path.ties);
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
                    $("#wait1").text(play1Path.name);
                    $("#w1").text(play1Path.wins);
                    $("#l1").text(play1Path.losses);
                    $("#t1").text(play1Path.ties);
                }  
            }
        }
    }
    if (is_GameOn) {
        for (key in snapChild){
            if (key == masterKey){ 
                if (snapChild[key].CameronRPS){
                    var turnFromDb = snapChild[key].CameronRPS.turn; 
                    turnCheck = turnFromDb;
                    if (turnCheck == 0) {
                        $(".playerChoice2").prop("disabled", true);
                        $(".playerChoice1").prop("disabled", false);
                    }
                    if (turnCheck == 1){
                        $(".playerChoice2").prop("disabled", false);
                        $(".playerChoice1").prop("disabled", true);
                        playerOneDone = true;
                    }
                    if (turnCheck == 2) {
                        $(".playerChoice2").prop("disabled", true);
                        $(".playerChoice1").prop("disabled", false);
                        playerTwoDone = true;
                    }
                }  
            }
        }
    }
    else{
        console.log("players not created");
    }
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
})

function startButtonState (){
    console.log("TURNMASTER 1 ");
    $(".playerChoice2").prop("disabled", true);
    $(".playerChoice1").prop("disabled", false);
}


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
    //console.log("turnCheck in judge")
    //console.log(turnCheck)
    if (turnCheck == 2){
        dbUpdater();
    }

    }

    function dbUpdater (){
        console.log("data____Fire__Counter");

        playerOneDone, playerTwoDone = false;
        var dataFirePlay1 = masterKey + "/CameronRPS/player/1"
        var dataFirePlay2 = masterKey + "/CameronRPS/player/2"
        
        console.log("player---1");
        console.log(player1wins);
        console.log(player1Lost);
        console.log(player1Ties);
        console.log("player---2");
        console.log(player2wins);
        console.log(player2Lost);
        console.log(player2Ties);

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
console.log("in limit");
var objChild =  snapshot.val()
console.log(objChild);
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

});


// function choiceGrabber(event) {

//     if ($(this).hasClass( "playerChoice1")){
        
//         btnChoice1 = $(this).val();
//         copyChoice1 = $(this).text();
//         dataUpdatePlay1 = $(this).parent().attr("data-key");
//         var dataFirePlay1 = dataUpdatePlay1 + "/CameronRPS/player/1"
//         var turnFirePlay1 = dataUpdatePlay1 + "/CameronRPS/"
//         $("#show1Choice").text(copyChoice1);
//         playerOneDone = true;
//         P1_turns = 1;

//         dbChoiceUpdater(btnChoice1, dataFirePlay1, P1_turns, turnFirePlay1);
//         console.log("choiceGrabber  p1 _____")
//     }
//     if ($(this).hasClass( "playerChoice2")) {
//         btnChoice2 = $(this).val();
//         copyChoice2 = $(this).text();
//         dataUpdatePlay2 = $(this).parent().attr("data-key");
//         var dataFirePlay2 = dataUpdatePlay2 + "/CameronRPS/player/2"
//         var turnFirePlay2 = dataUpdatePlay2 + "/CameronRPS/"
//         $("#show2Choice").text(copyChoice2);
//         playerTwoDone = true;
//         P2_turn = 2;
        
//         dbChoiceUpdater(btnChoice2, dataFirePlay2, P2_turn, turnFirePlay2);
//         console.log("choiceGrabber  p2 _____")
//     } 

//     function dbChoiceUpdater (choiceForDB,dbKey, incomingTurn, incomingTurnKey){
//          var fireChoice = choiceForDB;
//          var keyNode = dbKey;
//          var dbTurns = incomingTurn;
//          var turnNode = incomingTurnKey;

//         firedb.ref(keyNode).update({
//             choice: fireChoice
//             })
//         firedb.ref(turnNode).update({
//             turn: dbTurns
//             })
//     }
//     judgeMaster();
// }



function newGrabber(event) {
    
    console.log("masterKey");
    
    if ($(this).hasClass( "playerChoice1")){
        console.log(masterKey)
        
        btnChoice1 = $(this).val();
        copyChoice1 = $(this).text();
        var dataChoicePlay1 = $(this).parent().attr("data-choice");
        var dataFirePlay1 = masterKey + "/CameronRPS/player/1"
        var turnFirePlay1 = masterKey + "/CameronRPS/"
        $("#show1Choice").text(copyChoice1);
        $(".playerChoice2").prop("disabled", false);
        $(".playerChoice1").prop("disabled", true);
        //playerOneDone = true;
        P1_turns = 1;

        dbChoiceUpdater(btnChoice1, dataFirePlay1, P1_turns, turnFirePlay1);
        console.log("choiceGrabber  p1 _____")
        console.log(btnChoice1, dataFirePlay1, P1_turns, turnFirePlay1)
    }
    if ($(this).hasClass( "playerChoice2")) {
        btnChoice2 = $(this).val();
        copyChoice2 = $(this).text();
        dataUpdatePlay2 = $(this).parent().attr("data-key");
        var dataFirePlay2 = dataUpdatePlay2 + "/CameronRPS/player/2"
        var turnFirePlay2 = dataUpdatePlay2 + "/CameronRPS/"
        $("#show2Choice").text(copyChoice2);
        $(".playerChoice2").prop("disabled", true);
        $(".playerChoice1").prop("disabled", false);
        //playerTwoDone = true;
        P2_turn = 2;
        
        dbChoiceUpdater(btnChoice2, dataFirePlay2, P2_turn, turnFirePlay2);
        console.log("choiceGrabber  p2 _____")
    } 

    function dbChoiceUpdater (choiceForDB,dbKey, incomingTurn, incomingTurnKey){
        //console.log("choice db");
         var fireChoice = choiceForDB;
         var keyNode = dbKey;
         var dbTurns = incomingTurn;
         var turnNode = incomingTurnKey;
         console.log("dbChoiceUpdater");
         console.log(fireChoice);
         console.log(dbTurns);

        firedb.ref(keyNode).update({
            choice: fireChoice
            })
        firedb.ref(turnNode).update({
            turn: dbTurns
            })
    }

    judgeMaster();
}

