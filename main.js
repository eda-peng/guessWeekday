//import { Button, Input } from "@pixi/ui";
//import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";
// import * as PIXI from "pixi.js";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
(function () { return __awaiter(_this, void 0, void 0, function () {
    function createLabeledBox(message, style, padding) {
        if (padding === void 0) { padding = 10; }
        var text = new PIXI.Text(message, style);
        text.x = padding;
        text.y = padding;
        var bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRoundedRect(0, 0, text.width + padding * 2, text.height + padding * 2, 10);
        bg.endFill();
        var container = new PIXI.Container();
        container.addChild(bg);
        container.addChild(text);
        return { container: container, text: text, bg: bg };
    }
    function createButton(label, x, y, onClick) {
        var buttonContainer = new PIXI.Container();
        var bg = new PIXI.Graphics();
        bg.beginFill(0x4CAF50);
        bg.drawRoundedRect(0, 0, 120, 40, 10);
        bg.endFill();
        buttonContainer.addChild(bg);
        var text = new PIXI.Text(label, {
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
        buttonContainer.on("pointerover", function () {
            bg.tint = 0x66bb6a;
        });
        buttonContainer.on("pointerout", function () {
            bg.tint = 0xFFFFFF;
        });
        return buttonContainer;
    }
    function updateBackground(bg, text, padding) {
        if (padding === void 0) { padding = 10; }
        bg.clear();
        bg.beginFill(0x000000, 0.7);
        bg.drawRoundedRect(0, 0, text.width + padding * 2, text.height + padding * 2, 10);
        bg.endFill();
    }
    function startCountdown(seconds) {
        timeLeft = seconds;
        timerText.text = "\u5269\u9918\u6642\u9593\uFF1A".concat(timeLeft);
        clearInterval(timerInterval);
        timerInterval = setInterval(function () {
            timeLeft--;
            timerText.text = "\u5269\u9918\u6642\u9593\uFF1A".concat(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                onTimeUp();
            }
        }, 1000);
    }
    function checkAnwser() {
        var guess = input.value.trim();
        var guessedWeek = weekToNumberMap[guess];
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
        if (showAnswerCheckbox.checked)
            return;
        curScore += 1 * timeScoreRatio * dateScoreRatio;
        scoreText.text = "\u5F97\u5206\uFF1A".concat(curScore);
        updateBackground(scoreBg, scoreText);
    }
    function resetScore() {
        curScore = 0;
        scoreText.text = "\u5F97\u5206\uFF1A".concat(curScore);
        updateBackground(scoreBg, scoreText);
    }
    function updateHighScoreDisplay() {
        var highScore = parseInt(localStorage.getItem('highScore')) || 0;
        highScoreText.text = "\u6700\u9AD8\u5206\uFF1A".concat(highScore);
        updateBackground(highScoreBg, highScoreText);
    }
    function showAnswer() {
        answerText.text = "".concat(numberToWeekMap[targetDateWeek]);
        updateBackground(answerBg, answerText);
    }
    function getRandomDate() {
        var selectedRadio = document.querySelector('input[name="date-range"]:checked');
        var startYear = 2000;
        var endYear = 2030;
        if (selectedRadio) {
            var _a = selectedRadio.value.split('-').map(Number), start = _a[0], end = _a[1], ratio = _a[2];
            startYear = start;
            endYear = end;
            dateScoreRatio = ratio;
        }
        var startDate = new Date(startYear, 0, 1);
        var endDate = new Date(endYear, 11, 31);
        return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    }
    function newQuestion() {
        targetDate = getRandomDate();
        targetDateWeek = targetDate.getDay();
        questionText.text = targetDate.toLocaleDateString();
        answerText.visible = showAnswerCheckbox.checked;
        showAnswer();
    }
    var app, numberToWeekMap, weekToNumberMap, targetDate, targetDateWeek, curScore, timeLeft, timerInterval, timeScoreRatio, dateScoreRatio, input, showAnswerCheckbox, textStyle, _a, questionBox, questionText, questionBg, _b, scoreBox, scoreText, scoreBg, _c, highScoreBox, highScoreText, highScoreBg, _d, answerBox, answerText, answerBg, _e, timerBox, timerText, timerBg, nextButton, enterButten, resetGameButten, clearHighScoreButton;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                app = new PIXI.Application();
                return [4 /*yield*/, app.init({
                        width: 800,
                        height: 350,
                        backgroundColor: 0xEAA7AC,
                        resolution: window.devicePixelRatio || 1,
                    })];
            case 1:
                _f.sent();
                globalThis.__PIXI_APP__ = app;
                document.getElementById("pixi-container").appendChild(app.canvas);
                numberToWeekMap = {
                    0: "星期日", 1: "星期一", 2: "星期二", 3: "星期三",
                    4: "星期四", 5: "星期五", 6: "星期六",
                };
                weekToNumberMap = {
                    "日": 0, "天": 0, "一": 1, "二": 2, "三": 3,
                    "四": 4, "五": 5, "六": 6, "七": 0,
                    "星期日": 0, "星期天": 0, "星期一": 1,
                    "星期二": 2, "星期三": 3, "星期四": 4,
                    "星期五": 5, "星期六": 6,
                    "0": 0, "1": 1, "2": 2, "3": 3,
                    "4": 4, "5": 5, "6": 6, "7": 0,
                };
                targetDate = new Date();
                targetDateWeek = 0;
                curScore = 0;
                timeLeft = 10;
                timeScoreRatio = 2;
                dateScoreRatio = 5;
                input = document.getElementById("answer-input");
                input.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") {
                        checkAnwser();
                    }
                });
                showAnswerCheckbox = document.getElementById("show-answer-checkbox");
                showAnswerCheckbox.addEventListener("change", function () {
                    answerText.visible = showAnswerCheckbox.checked;
                });
                textStyle = new PIXI.TextStyle({
                    fontFamily: "Arial",
                    fontSize: 24,
                    fill: "white",
                    wordWrap: true,
                    wordWrapWidth: 300
                });
                _a = createLabeledBox("XXXX/XX/XX", textStyle), questionBox = _a.container, questionText = _a.text, questionBg = _a.bg;
                questionBox.x = 300;
                questionBox.y = 150;
                app.stage.addChild(questionBox);
                questionText.text = "XXXXXXX/";
                updateBackground(questionBg, questionText);
                _b = createLabeledBox("得分：0", textStyle), scoreBox = _b.container, scoreText = _b.text, scoreBg = _b.bg;
                scoreBox.x = 30;
                scoreBox.y = 20;
                app.stage.addChild(scoreBox);
                _c = createLabeledBox("最高分：0", textStyle), highScoreBox = _c.container, highScoreText = _c.text, highScoreBg = _c.bg;
                highScoreBox.x = 30;
                highScoreBox.y = 70;
                app.stage.addChild(highScoreBox);
                _d = createLabeledBox("答案", textStyle), answerBox = _d.container, answerText = _d.text, answerBg = _d.bg;
                answerBox.x = 450;
                answerBox.y = 150;
                app.stage.addChild(answerBox);
                _e = createLabeledBox("剩餘時間：60", textStyle), timerBox = _e.container, timerText = _e.text, timerBg = _e.bg;
                timerBox.x = 610;
                timerBox.y = 20;
                app.stage.addChild(timerBox);
                nextButton = createButton("下一題", 650, 280, function () { return newQuestion(); });
                app.stage.addChild(nextButton);
                enterButten = createButton("確認", 650, 230, function () { return checkAnwser(); });
                app.stage.addChild(enterButten);
                resetGameButten = createButton("重新開始", 30, 280, function () { return newGame(); });
                app.stage.addChild(resetGameButten);
                clearHighScoreButton = createButton("清除紀錄", 30, 230, function () {
                    localStorage.removeItem('highScore');
                    updateHighScoreDisplay();
                });
                app.stage.addChild(clearHighScoreButton);
                return [2 /*return*/];
        }
    });
}); });
