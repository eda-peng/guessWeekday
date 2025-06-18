//import { Button, Input } from "@pixi/ui";
//import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import * as PIXI from "pixi.js";

(async () => {
  // Create a new application
  const app = new PIXI.Application();

  // Initialize the application
  await app.init({
    width: 800,
    height: 350,
    backgroundColor: 0xEAA7AC,
    resolution: window.devicePixelRatio || 1,
  });
  globalThis.__PIXI_APP__ = app;
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  

  const numberToWeekMap: Record<number, string> = {
    0: "星期日",
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六",
  };
  const weekToNumberMap: Record<string, number> = {
    "日": 0,
    "天": 0,
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 0,
    "星期日": 0,
    "星期天": 0,
    "星期一": 1,
    "星期二": 2,
    "星期三": 3,
    "星期四": 4,
    "星期五": 5,
    "星期六": 6,
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 0,
  };
  let targetDate = new Date
  let targetDateWeek = 0;
  let curScore = 0; 
  let timeLeft = 10;
  let timerInterval: number;
  let timeScoreRatio = 2;
  let dateScoreRatio = 5;

  //物件函式
  function createLabeledBox(message: string, style: PIXI.TextStyle, padding: number = 10): {
    container: PIXI.Container;
    text: PIXI.Text;
    bg: PIXI.Graphics;
  } {
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

    return { container, text, bg }; // 回傳以便後續修改
  }

  function createButton(label: string, x: number, y: number, onClick: () => void): PIXI.Container {
    const buttonContainer = new PIXI.Container();

    // 背景矩形
    const bg = new PIXI.Graphics();
    bg.beginFill(0x4CAF50); // 綠色
    bg.drawRoundedRect(0, 0, 120, 40, 10);
    bg.endFill();
    buttonContainer.addChild(bg);

    // 按鈕文字
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

    // 啟用互動
    buttonContainer.eventMode = "static";
    buttonContainer.cursor = "pointer";
    buttonContainer.on("pointerdown", onClick);

    // 設定位置
    buttonContainer.x = x;
    buttonContainer.y = y;

    //滑過變色
    buttonContainer.on("pointerover", () => {
      bg.tint = 0x66bb6a; // 淺綠
    });
    buttonContainer.on("pointerout", () => {
      bg.tint = 0xFFFFFF; // 原色
    });

    return buttonContainer;
  }
  function updateBackground(bg: PIXI.Graphics, text: PIXI.Text, padding: number = 10) {
    bg.clear();
    bg.beginFill(0x000000, 0.7);
    bg.drawRoundedRect(0, 0, text.width + padding * 2, text.height + padding * 2, 10);
    bg.endFill();
  }



  // **輸入框**
  const input = document.getElementById("answer-input") as HTMLInputElement;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnwser();
    }
  });
  // **checkbox**
  const showAnswerCheckbox = document.getElementById("show-answer-checkbox") as HTMLInputElement;
  showAnswerCheckbox.addEventListener("change", () => {
    answerText.visible = showAnswerCheckbox.checked;
  });
  //answerText.visible = showAnswerCheckbox.checked;

  // **文字**
  // 全域樣式定義
  const textStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    wordWrap: true,
    wordWrapWidth: 300
  });
  // 建立題目文字
  const { container: questionBox, text: questionText, bg: questionBg } = createLabeledBox("XXXX/XX/XX", textStyle);
  questionBox.x = 300;
  questionBox.y = 150;
  app.stage.addChild(questionBox);
  questionText.text = "XXXXXXX/"
  updateBackground(questionBg, questionText);
  // 建立得分顯示文字
  const { container: scoreBox, text: scoreText, bg: scoreBg } = createLabeledBox("得分：0", textStyle);
  scoreBox.x = 30;
  scoreBox.y = 20;
  app.stage.addChild(scoreBox);
  // 建立最高得分顯示文字
  const { container: highScoreBox, text: highScoreText, bg: highScoreBg } = createLabeledBox("最高分：0", textStyle);
  highScoreBox.x = 30;
  highScoreBox.y = 70;
  app.stage.addChild(highScoreBox);
  // 建立解答文字
  const { container: answerBox, text: answerText, bg: answerBg } = createLabeledBox(`${numberToWeekMap[targetDateWeek]}`, textStyle);
  answerBox.x = 450;
  answerBox.y = 150;
  app.stage.addChild(answerBox);
  // 建立時間文字
  const { container: timerBox, text: timerText, bg: timerBg } = createLabeledBox("剩餘時間：60", textStyle);
  timerBox.x = 610;
  timerBox.y = 20;
  app.stage.addChild(timerBox);
  
  // **按鈕**
  const nextButton = createButton("下一題", 650, 280, () => {
    newQuestion();
  });
  app.stage.addChild(nextButton)
  const enterButten = createButton("確認", 650, 230, () => {
    checkAnwser();
  });
  app.stage.addChild(enterButten);
  const resetGameButten = createButton("重新開始", 30, 280, () => {
    newGame();
  });
  app.stage.addChild(resetGameButten);
  // const showAnswerButten = createButton("顯示答案", 650, 150, () => {
  //   if (answerText.visible == false) {
  //     answerText.visible = true;
  //   } else {
  //     answerText.visible = false;
  //   }
  //   showAnswer();
  // });
  // app.stage.addChild(showAnswerButten);
  const clearHighScoreButton = createButton("清除紀錄", 30, 230, () => {
    localStorage.removeItem('highScore');
    updateHighScoreDisplay();
  });
  app.stage.addChild(clearHighScoreButton);


  // **各種函式**
  // 時間
  function startCountdown(seconds: number) {
    timeLeft = seconds;
    timerText.text = `剩餘時間：${timeLeft}`;
    // 清除前一個倒數（如果有）
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft --;
      timerText.text = `剩餘時間：${timeLeft}`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onTimeUp(); // 執行時間到的動作
      }
    }, 1000);
  }
  // 比對猜測
  function checkAnwser(){
    const guess = input.value.trim();
    
    const guessedWeek = weekToNumberMap[guess];
    if (guessedWeek === undefined) {
      alert("請輸入有效的星期，例如：日、一、星期五...");
      return;
    }
    if (guessedWeek == targetDateWeek) {
      addScore();
      input.value = ""
      newQuestion();
    }
  }
  // 加分
  function addScore() {
    if(showAnswerCheckbox.checked == true) return;
    curScore += 1 * timeScoreRatio * dateScoreRatio;
    console.log(timeScoreRatio + ":" + dateScoreRatio);
    scoreText.text = `得分：${curScore}`;
    updateBackground(scoreBg, scoreText);
  }
  // 分數歸零
  function resetScore() {
    curScore = 0;
    scoreText.text = `得分：${curScore}`;
    updateBackground(scoreBg, scoreText);
  }
  // 更新最高得分
  function updateHighScoreDisplay() {
    const highScore = parseInt(localStorage.getItem('highScore')) || 0;
    highScoreText.text = `最高分：${highScore}`;
    updateBackground(highScoreBg, highScoreText);
  }
  // 顯示答案
  function showAnswer(){
    answerText.text = `${numberToWeekMap[targetDateWeek]}`;
    updateBackground(answerBg, answerText);
  }
  // 隨機日期
  function getRandomDate() {
    const selectedRadio = document.querySelector<HTMLInputElement>('input[name="date-range"]:checked');
    let startYear = 2000;
    let endYear = 2030;
    if (selectedRadio) {
      const [start, end, ScoreRatio] = selectedRadio.value.split('-').map(Number);
      startYear = start;
      endYear = end;
      dateScoreRatio = ScoreRatio;
    }
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  }
  // 新題目開始
  function newQuestion(){
    targetDate = getRandomDate();
    targetDateWeek = targetDate.getDay();
    questionText.text = targetDate.toLocaleDateString();
    // updateBackground(questionBg, questionText);
    answerText.visible = showAnswerCheckbox.checked;
    showAnswer();
  }
  // 一局遊戲結束
  function onTimeUp(){
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    if (curScore > highScore) {
      localStorage.setItem('highScore', curScore);
      alert(`時間到！新紀錄！得分：${curScore}`);
      updateHighScoreDisplay();
    } else {
      alert(`時間到！得分：${curScore}，最高紀錄：${highScore}`);
    }
  }
  // 新遊戲開始
  function newGame() {
    resetScore();
    newQuestion();
    // 讀取使用者選擇的時間（預設 fallback = 60）
    const timeSelect = document.getElementById("time-select") as HTMLSelectElement;
    const selectedSeconds = parseInt(timeSelect?.value || "60");
    if (selectedSeconds == 30){
      timeScoreRatio = 3;
    } else if (selectedSeconds == 60){
      timeScoreRatio = 2;
    }else{
      timeScoreRatio = 1;
    }
    startCountdown(selectedSeconds);
  }
  
  updateHighScoreDisplay();
  newQuestion();
  // 初次啟動倒數（使用預設選項值）
  const timeSelect = document.getElementById("time-select") as HTMLSelectElement;
  const defaultTime = parseInt(timeSelect?.value || "60");
  startCountdown(defaultTime);
})();
