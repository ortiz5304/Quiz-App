document.addEventListener("DOMContentLoaded", init); //

let questions = []; // empty questions array
let n = 0; // global variable which is used to choose index number of array [n]
let correct_answer = null; // global used to set up correct answer
let selected_answer = null; // global used to set up selected answer
let leaderboard = new Array();// array used to set up leaderboard

class leaderboardScore{ // class which is used to set up the leaderboard
  constructor(username,score){ // uses username and score to create new objects
    this.username = username
    this.score = score
  }
}


//******************************************************************************
//                    INITIALIZE
//******************************************************************************
function init(){

  document.getElementById("quiz").style.display="none"// sets display to none for 'quiz' page
  document.getElementById("end").style.display="none"// sets display

  document.getElementById("startButton").addEventListener("click", startQuiz);// starts the quiz when start button is clicked
  document.getElementById("answer1").addEventListener("click", processAnswer); // runs processAnswer function when answer1 button is clicked
  document.getElementById("answer2").addEventListener("click", processAnswer); // runs processAnswer function when answer2 button is clicked
  document.getElementById("answer3").addEventListener("click", processAnswer); // runs processAnswer function when answer3 button is clicked
  document.getElementById("answer4").addEventListener("click", processAnswer); // runs processAnswer function when answer4 button is clicked
  document.getElementById("next").addEventListener("click", nextQuestion); // goes to the next question when next button is clicked
  document.getElementById("restart").addEventListener("click", restartQuiz); // goes to the next question when next button is clicked

  setupLeaderboard(); // call the function setupLeaderboard

}
//******************************************************************************
//                    START QUIZ
//******************************************************************************
function startQuiz(){ //  startQuiz function

    //fetch api
    fetch("https://opentdb.com/api.php?amount=20&difficulty=easy&type=multiple",{//gets data from API
    method: 'get' // get method
  }).then(function(response) {
    //set response to json
    return response.json();
  }).then(function(data) {
    console.log("response data:",data.results, data.results.length)// logs info to console

    //store json response
    questions = data.results; //stores array of questions

    let input = document.getElementById("userName") // sets element from userName
    if(input == null || input.value.trim().length == 0 ){ // ensures that userName input field is NOT empty
      return;
      }
    localStorage.username = input.value.trim() // removes whitespace from both ends of the string username
    localStorage.score = 0; // resets the score to zero at the start of a new game

    document.getElementById("quiz").style.display="block" // displays quiz container
    document.getElementById("start").style.display="none" // hides start container
    document.getElementById("next").style.display = "none"; // hides next button until user selects an answer

    n = 0; // resets the array index to zero at the start of each new game

    createMultiplePageQuiz() // calls the function createMultiplePageQuiz
    });
}
//******************************************************************************
//                    Randomize possible answers
//******************************************************************************

function randomCompare(a, b){ // function used to randomize the order of possible answers on quiz
  return Math.random() * 4;
}


//******************************************************************************
//                    CREATE MULTIPLE PAGE QUIZ
//******************************************************************************


function createMultiplePageQuiz(){ // function which creates the quiz
    let q = questions[n] // used to iterate through the questions
    let possibleAnswers = q.incorrect_answers; // stores the incorrect ansers into possibleAnswers array
    possibleAnswers.push(q.correct_answer); // adds correct answer to the possibleAnswers array
    possibleAnswers.sort(); // calls the randomCompare function to randomize the possibleAnswers ***NOT WORKING***

    document.getElementById("category").innerHTML = "Category: " + q.category // displays category of questions

    document.getElementById("question").innerHTML = "Question: " + q.question // displays the questions one at a time

    document.getElementById("answer1").innerHTML = possibleAnswers[0] // sets answer1 equal to possibleAnswers at index zero
    if (possibleAnswers[0]==q.correct_answer){ // if possibleAnswers at index zero is equal to the correct_answer...
      correct_answer = document.getElementById("answer1");// then answer1 is set to the correct answer
    }

    document.getElementById("answer2").innerHTML = possibleAnswers[1] // sets answer2 equal to possibleAnswers at index one
    if (possibleAnswers[1]==q.correct_answer){ // if possibleAnswers at index one is equal to the correct_answer...
      correct_answer = document.getElementById("answer2"); // then answer2 is set to the correct answer
    }

    document.getElementById("answer3").innerHTML = possibleAnswers[2] // sets answer3 equal to possibleAnswers at index two
    if (possibleAnswers[2]==q.correct_answer){ // if possibleAnswers at index two is equal to the correct_answer...
      correct_answer = document.getElementById("answer3");// then answer3 is set to the correct answer
    }

    document.getElementById("answer4").innerHTML = possibleAnswers[3] // sets answer4 equal to possibleAnswers at index three
    if (possibleAnswers[3]==q.correct_answer){ // if possibleAnswers at index three is equal to the correct_answer...
      correct_answer = document.getElementById("answer4"); // then answer4 is set to the correct answer
    }
}
//*****************************************************************************
//                    PROCESS ANSWER
//*****************************************************************************
function processAnswer(e){ // processAnswer function
  if(selected_answer!=null){ // if the user has not selected an answer from possibleAnswers...
    return; // prevents the user from moving on to the next question until an answer is selected
  }
  correct_answer.classList.add("btn-success") // if selected answer is correct_answer, the button color is set to green
  correct_answer.classList.remove("btn-light") // if selected answer is correct_answer, the default color of the button is removed

  if (e.target == correct_answer){ // if event is correct_answer...
    localStorage.score = parseInt(localStorage.score) + 100/questions.length; //   100 / 5 = 20 points is added into local storage for every correct answer
  } else{
      e.target.classList.add("btn-danger") // else ... the selected answer button color is set to red
      e.target.classList.remove("btn-light") // the default color of selected anser is removed
  }
  selected_answer = e.target // selected answer is the event target
  document.getElementById("next").style.display = "block"; // hides the next button

  if(n == questions.length - 1){ // if index n is the last question (length - 1)
    scoreQuiz() // calls the function scoreQuiz
  }
}
//******************************************************************************
//                    NEXT QUESTION
//******************************************************************************

function nextQuestion(){ // nextQuestion function
correct_answer.classList.remove("btn-success")// removes the green color from correct_answer button
selected_answer.classList.remove("btn-danger")// removes the red color from selected_answer button
correct_answer.classList.add("btn-light")// sets correct_answer button to default color 'light'
selected_answer.classList.add("btn-light")// sets selected_answer button to default color 'light'
selected_answer = null;// sets selected answer to null in order to process next answer
n++// Moves the index of questions
if (n < questions.length){ // if n is less than the length of the questions array...
  createMultiplePageQuiz() // calls the function createMultiplePageQuiz
} else { // else...
  EndGame(); // calls the function EndGame
}
document.getElementById("next").style.display = "none";// hides the next button after clicking the next button
}

//******************************************************************************
//                    Set up Leaderboard
//******************************************************************************

function setupLeaderboard() { // setupLeaderboard function
    if (localStorage.getItem('leaderboard') == null) { // if leaderboard in local storage is empty...
        localStorage.setItem('leaderboard', JSON.stringify(new Array())) // converts object into string and stores into local storage
    }
    let str = localStorage.getItem('leaderboard') // sets leaderboard info from local storage equal to str
    leaderboard = JSON.parse(str)// transforms object into a string
    leaderboard.sort(compareScores) // sorts the scores on the leaderboard according to highest score
    console.log(leaderboard);// logs the info from the leaderboard to the console
}

function compareScores(a,b) { // compareScores function
  return b.score - a.score //
}




//******************************************************************************
//                    SCORE QUIZ
//******************************************************************************

  function scoreQuiz(){
    // Check answers
    //e.preventDefault()
    let hasPlayedBefore = false;
    for(i  = 0; i < leaderboard.length; i++){
      if(leaderboard[i].username == localStorage.username){ //if username is stored in local storage...
        hasPlayedBefore = true; // then that user has played before
        if(leaderboard[i].score < localStorage.score) // if users current score is less than stored score...
          leaderboard[i].score = localStorage.score;// then the stored score remains the high score for that user and ...
          break; // then terminates the loop
      }
    }
    if(!hasPlayedBefore){// if user has not played before ... push username and score
      let userScore = new leaderboardScore(localStorage.username, localStorage.score);
      leaderboard.push(userScore);
    }
    console.log("Score quiz"); //displays "Score quiz" in the console
    console.log(leaderboard); // displays ALL (including users not in the top 5) leaderboard information saved in local storage to the console
    leaderboard.sort(compareScores);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard))// stringifies info
  }


  //******************************************************************************
  //                    End Game
  //******************************************************************************

  function EndGame(){ //EndGame function
    document.getElementById("quiz").style.display="none" // hides quiz container
    document.getElementById("end").style.display="block" // displays end container

    document.getElementById("userName_end").innerHTML = "Thanks for Playing " + localStorage.username; // displays Thanks for Playing, plus the users name
    document.getElementById("score").innerHTML = "YOUR SCORE: " + localStorage.score; // displays YOUR SCORE: , plus the users score for the current game

    if(leaderboard.length >= 1){ // if leaderboard length is greater than or equal to one...

      document.getElementById("lb-user-1").innerHTML = leaderboard[0].username // then store the username in local storage at index zero
      document.getElementById("lb-score-1").innerHTML = leaderboard[0].score // then store the users score in local storage at index zero
    }
    if(leaderboard.length >= 2){ // if leaderboard length is greater than or equal to two...

      document.getElementById("lb-user-2").innerHTML = leaderboard[1].username // then store the username in local storage at index one
      document.getElementById("lb-score-2").innerHTML = leaderboard[1].score // then store the users score in local storage at index one
    }
    if(leaderboard.length >= 3){ // if leaderboard length is greater than or equal to three...

      document.getElementById("lb-user-3").innerHTML = leaderboard[2].username // then store the username in local storage at index two
      document.getElementById("lb-score-3").innerHTML = leaderboard[2].score // then store the users score in local storage at index two
    }
    if(leaderboard.length >= 4){ // if leaderboard length is greater than or equal to four...

      document.getElementById("lb-user-4").innerHTML = leaderboard[3].username // then store the username in local storage at index three
      document.getElementById("lb-score-4").innerHTML = leaderboard[3].score // then store the users score in local storage at index three
    }
    if(leaderboard.length >= 5){ // if leaderboard length is greater than or equal to five...

      document.getElementById("lb-user-5").innerHTML = leaderboard[4].username // then store the username in local storage at index four
      document.getElementById("lb-score-5").innerHTML = leaderboard[4].score // then store the users score in local storage at index four
    }
  }
//******************************************************************************
//******************************************************************************

function restartQuiz (){ // restartQuiz function
  localStorage.score = 0; // resets the localStorage score to zero
  document.getElementById("end").style.display = "none"; // hides the end container
  document.getElementById("start").style.display = "block"; // displays the start container

}
