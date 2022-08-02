// typewriter animation effect
const texts = ["Type something…", "Enter another word…", "One more word"];
const input = document.querySelector(".input");
class animationWorker {
  constructor(input, texts) {
    this.input = input;
    this.defaultPlaceholder = this.input.getAttribute("placeholder");
    this.texts = texts;
    this.curTextNum = 0;
    this.curPlaceholder = "";
    this.blinkCounter = 0;
    this.animationFrameId = 0;
    this.animationActive = false;
    this.input.setAttribute("placeholder", this.curPlaceholder);

    this.switch = (timeout) => {
      this.input.classList.add("imitatefocus");
      setTimeout(() => {
        this.input.classList.remove("imitatefocus");
        if (this.curTextNum == 0)
          this.input.setAttribute("placeholder", this.defaultPlaceholder);
        else this.input.setAttribute("placeholder", this.curPlaceholder);

        setTimeout(() => {
          this.input.setAttribute("placeholder", this.curPlaceholder);
          if (this.animationActive)
            this.animationFrameId = window.requestAnimationFrame(this.animate);
        }, timeout);
      }, timeout);
    };

    this.animate = () => {
      if (!this.animationActive) return;
      let curPlaceholderFullText = this.texts[this.curTextNum];
      let timeout = 900;
      if (
        this.curPlaceholder == curPlaceholderFullText + "|" &&
        this.blinkCounter == 3
      ) {
        this.blinkCounter = 0;
        this.curTextNum =
          this.curTextNum >= this.texts.length - 1 ? 0 : this.curTextNum + 1;
        this.curPlaceholder = "|";
        this.switch(3000);
        return;
      } else if (
        this.curPlaceholder == curPlaceholderFullText + "|" &&
        this.blinkCounter < 3
      ) {
        this.curPlaceholder = curPlaceholderFullText;
        this.blinkCounter++;
      } else if (
        this.curPlaceholder == curPlaceholderFullText &&
        this.blinkCounter < 3
      ) {
        this.curPlaceholder = this.curPlaceholder + "|";
      } else {
        this.curPlaceholder =
          curPlaceholderFullText
            .split("")
            .slice(0, this.curPlaceholder.length + 1)
            .join("") + "|";
        timeout = 150;
      }
      this.input.setAttribute("placeholder", this.curPlaceholder);
      setTimeout(() => {
        if (this.animationActive)
          this.animationFrameId = window.requestAnimationFrame(this.animate);
      }, timeout);
    };

    this.stop = () => {
      this.animationActive = false;
      window.cancelAnimationFrame(this.animationFrameId);
    };

    this.start = () => {
      this.animationActive = true;
      this.animationFrameId = window.requestAnimationFrame(this.animate);
      return this;
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let aw = new animationWorker(input, texts).start();
  input.addEventListener("focus", (e) => aw.stop());
  input.addEventListener("blur", (e) => {
    aw = new animationWorker(input, texts);
    if (e.target.value == "") setTimeout(aw.start, 2000);
  });
});

// handle dynamic footer year
document.querySelector(".year").innerHTML = new Date().getFullYear();

//----------------------------------------------------------------------------------

// Array of words
let words = [
  "Hello",
  "Code",
  "Town",
  "Github",
  "Programming",
  "Javascript",
  "Country",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Leetcode",
  "Internet",
  "Python",
  "Scala",
  "Destructuring",
  "Paradigm",
  "Styling",
  "Cascade",
  "Documentation",
  "Coding",
  "Funny",
  "Working",
  "Dependencies",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
  "Playing",
];

// difficulty levels
const level = {
  Easy: 8,
  Normal: 6,
  Hard: 4,
  Expert: 3,
};

let start,
  modeChange = false,
  wordsCopy = [],
  startButton = document.querySelector(".start-button"),
  difficultyLevel = document.querySelector("#level"),
  levelSeconds = document.querySelector(".seconds-left span:last-of-type"),
  subScore = document.querySelector(".score span:nth-of-type(2)"),
  totalScore = document.querySelector(".score span:last-of-type"),
  secondsLeft = document.querySelector(".time span:nth-of-type(2)"),
  theWord = document.querySelector(".the-word"),
  upcomingWords = document.querySelector(".upcoming-words"),
  finishDiv = document.querySelector(".finish");

startButton.onclick = () => {
  document.querySelector("#start-music").play();
  document.querySelector("#start-music").volume = 0.3;
  document.querySelector("#start-music").loop = true;

  wordsCopy = [...words];
  startButton.parentElement.remove();
  input.focus();
  input.onpaste = () => false;
  defaultMode();
  genWord();
  setTimeout(() => startGame(), 500);
};

// default mode
function defaultMode() {
  let defaultLevel = "Normal",
    defaultLevelTime = level[defaultLevel];

  difficultyLevel.value = defaultLevel;
  levelSeconds.innerHTML = defaultLevelTime;
  totalScore.innerHTML = words.length;
  secondsLeft.innerHTML = defaultLevelTime;
}

// handle changing difficulty mode
difficultyLevel.onclick = () => {
  finishDiv.innerHTML = "";
  document.querySelector("button.try-again").style.display = "none";

  difficultyLevel.value = difficultyLevel.value;
  levelSeconds.innerHTML = level[difficultyLevel.value];
  secondsLeft.innerHTML = level[difficultyLevel.value];

  words = [];
  words = [...wordsCopy];
  subScore.innerHTML = 0;
  genWord();
  clearInterval(start);
  startGame();
};

// generate a random word function
function genWord() {
  let randomWord = words[Math.floor(Math.random() * words.length)],
    wordIndex = words.indexOf(randomWord);

  theWord.innerHTML = randomWord;

  // remove the word from upcoming words array
  words.splice(wordIndex, 1);

  // empty the upcoming words container
  upcomingWords.innerHTML = "";

  // add the rest of upcoming words
  words.forEach((word) => {
    let div = document.createElement("div");
    div.append(word);
    upcomingWords.appendChild(div);
  });
}

function startGame() {
  start = setInterval(() => {
    if (--secondsLeft.innerHTML <= 0) {
      clearInterval(start);
      nextWord();
    } else if (theWord.innerHTML.toLowerCase() == input.value.toLowerCase()) {
      subScore.innerHTML++;
      clearInterval(start);
      nextWord();
    }
  }, 1000);
}

function nextWord() {
  input.value = "";
  theWord.innerHTML = "";
  secondsLeft.innerHTML = level[difficultyLevel.value];

  if (words.length > 0) {
    genWord();
    startGame();
  } else gameOver();
}

function gameOver() {
  finishDiv.style.display = "flex";

  let span = document.createElement("span");
  if (subScore.innerHTML < totalScore.innerHTML / 2) {
    span.append("Bad");
    span.classList.add("bad");
  } else {
    span.append("Good");
    span.classList.add("good");
  }

  finishDiv.appendChild(span);

  setTimeout(() => {
    finishDiv.style.display = "none";
    document.querySelector("button.try-again").style.display = "block";
  }, 3000);
}

// handle try-again button
document.querySelector("button.try-again").onclick = () => {
  input.focus();
  input.onpaste = () => false;
  difficultyLevel.click();
};
