//import { Button, Input } from "@pixi/ui";
//import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";
// import * as PIXI from "pixi.js";

(async () => {
  const app = new PIXI.Application();

  await app.init({
    width: 800,
    height: 350,
    backgroundColor: 0xEAA7AC,
    resolution: window.devicePixelRatio || 1,
  });

  globalThis.__PIXI_APP__ = app;
  document.getElementById("pixi-container").appendChild(app.canvas);

  const numberToWeekMap = {
    0: "星期日", 1: "星期一", 2: "星期二", 3: "星期三",
    4: "星期四", 5: "星期五", 6: "星期六",
  };

  const weekToNumberMap = {
    "日": 0, "天": 0, "一": 1, "二": 2, "三": 3,
    "四": 4, "五": 5, "六": 6, "七": 0,
    "星期日": 0, "星期天": 0, "星期一": 1,
    "星期二": 2, "星期三": 3, "星期四": 4,
    "星期五": 5, "星期六": 6,
    "0": 0, "1": 1, "2": 2, "3": 3,
    "4": 4, "5": 5, "6": 6, "7": 0,
  };

  let targetDate = new Date();
  let targetDateWeek = 0;
  let curScore = 0;
  let timeLeft = 10;
  let timerInterval;
  let timeScoreRatio = 2;
  let dateScoreRatio = 5;

  function createLabeledBox(message, style, padding = 10) {
    const text = new PIXI.Text(message, style);
    text.x = padding;
    text.y = padding;

    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRoundedRect(0, 0, text.width + padding * 2, text.height + padding * 2, 10);
    bg.endFill();

    const container = new PIXI.Container();
    container.addChild(bg);
    container.addChild(text);

    return { container, text, bg };
  }

  function createButton(label, x, y, onClick) {
    const buttonContainer = new PIXI.Container();

    const bg = new PIXI.Graphics();
    bg.beginFill(0x4CAF50);
    bg.drawRoundedRect(0, 0, 120, 40, 10);
    bg.endFill();
    buttonContainer.addChild(bg);

    const text = new PIXI.Text(label, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: "white",
      align: "center"
    });
    text.anchor.set(0.5);
    text.x = 60;
    text.y = 20;
    buttonContainer.addChild(text);

    buttonContainer.eventMode = "static";
    buttonContainer.cursor = "pointer";
    buttonContainer.on("pointerdown", onClick);

    buttonContainer.x = x;
    buttonContainer.y = y;

    buttonContainer.on("pointerover", () => {
      bg.tint = 0x66bb6a;
    });
    buttonContainer.on("pointerout", () => {
      bg.tint = 0xFFFFFF;
    });

    return buttonContainer;
  }

  function updateBackground(bg, text, padding = 10) {
    bg.clear();
    bg.beginFill(0x000000, 0.7);
    bg.drawRoundedRect(0, 0, text.width + padding * 2, text.height + padding * 2, 10);
    bg.endFill();
  }

  const input = document.getElementById("answer-input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnwser();
    }
  });

  const showAnswerCheckbox = document.getElementById("show-answer-checkbox");
  showAnswerCheckbox.addEventListener("change", () => {
    answerText.visible = showAnswerCheckbox.checked;
  });

  const textStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    wordWrap: true,
    wordWrapWidth: 300
  });

  const { container: questionBox, text: questionText, bg: questionBg } = createLabeledBox("XXXX/XX/XX", textStyle);
  questionBox.x = 300;
  questionBox.y = 150;
  app.stage.addChild(questionBox);
  questionText.text = "XXXXXXX/";
  updateBackground(questionBg, questionText);

  const { container: scoreBox, text: scoreText, bg: scoreBg } = createLabeledBox("得分：0", textStyle);
  scoreBox.x = 30;
  scoreBox.y = 20;
  app.stage.addChild(scoreBox);

  const { container: highScoreBox, text: highScoreText, bg: highScoreBg } = createLabeledBox("最高分：0", textStyle);
  highScoreBox.x = 30;
  highScoreBox.y = 70;
  app.stage.addChild(highScoreBox);

  const { container: answerBox, text: answerText, bg: answerBg } = createLabeledBox("答案", textStyle);
  answerBox.x = 450;
  answerBox.y = 150;
  app.stage.addChild(answerBox);

  const { container: timerBox, text: timerText, bg: timerBg } = createLabeledBox("剩餘時間：60", textStyle);
  timerBox.x = 610;
  timerBox.y = 20;
  app.stage.addChild(timerBox);

  const nextButton = createButton("下一題", 650, 280, () => newQuestion());
  app.stage.addChild(nextButton);

  const enterButten = createButton("確認", 650, 230, () => checkAnwser());
  app.stage.addChild(enterButten);

  const resetGameButten = createButton("重新開始", 30, 280, () => newGame());
  app.stage.addChild(resetGameButten);

  const clearHighScoreButton = createButton("清除紀錄", 30, 230, () => {
    localStorage.removeItem('highScore');
    updateHighScoreDisplay();
  });
  app.stage.addChild(clearHighScoreButton);

  function startCountdown(seconds) {
    timeLeft = seconds;
    timerText.text = `剩餘時間：${timeLeft}`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.text = `剩餘時間：${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onTimeUp();
      }
    }, 1000);
  }

  function checkAnwser() {
    const guess = input.value.trim();
    const guessedWeek = weekToNumberMap[guess];
    if (guessedWeek === undefined) {
      alert("請輸入有效的星期，例如：日、一、星期五...");
      return;
    }
    if (guessedWeek === targetDateWeek) {
      addScore();
      input.value = "";
      newQuestion();
    }
  }

  function addScore() {
    if (showAnswerCheckbox.checked) return;
    curScore += 1 * timeScoreRatio * dateScoreRatio;
    scoreText.text = `得分：${curScore}`;
    updateBackground(scoreBg, scoreText);
  }

  function resetScore() {
    curScore = 0;
    scoreText.text = `得分：${curScore}`;
    updateBackground(scoreBg, scoreText);
  }

  function updateHighScoreDisplay() {
    const highScore = parseInt(localStorage.getItem('highScore')) || 0;
    highScoreText.text = `最高分：${highScore}`;
    updateBackground(highScoreBg, highScoreText);
  }

  function showAnswer() {
    answerText.text = `${numberToWeekMap[targetDateWeek]}`;
    updateBackground(answerBg, answerText);
  }

  function getRandomDate() {
    const selectedRadio = document.querySelector('input[name="date-range"]:checked');
    let startYear = 2000;
    let endYear = 2030;
    if (selectedRadio) {
      const [start, end, ratio] = selectedRadio.value.split('-').map(Number);
      startYear = start;
      endYear = end;
      dateScoreRatio = ratio;
    }
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  }

  function newQuestion() {
    targetDate = getRandomDate();
    targetDateWeek = targetDate.getDay();
    questionText.text = targetDate.toLocaleDateString();
    answerText.visible = showAnswerCheckbox.checked;
    showAnswer();
  }
