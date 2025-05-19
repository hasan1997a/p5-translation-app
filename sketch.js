let table;
let numRows;
let correctAnswer;
let buttons = [];
let nextButton;
let message = "";

function preload() {
  table = loadTable('trans.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  numRows = table.getRowCount();

  nextButton = createButton("التالي");
  nextButton.position(width / 2 - 40, height - 80);
  nextButton.mousePressed(generateQuestion);
  nextButton.hide();

  generateQuestion();
}

function draw() {
  background(240);
  fill(0);
  textSize(28);
  text("اختر الترجمة الصحيحة للكلمة التالية:", width / 2, 50);

  if (correctAnswer) {
    fill(20, 30, 180);
    textSize(36);
    text(correctAnswer.question, width / 2, 100);
  }

  if (message) {
    fill(0);
    textSize(22);
    text(message, width / 2, height - 120);
  }
}

function generateQuestion() {
  message = "";
  nextButton.hide();
  buttons.forEach(btn => btn.remove());
  buttons = [];

  let validRows = [];
  for (let i = 0; i < numRows; i++) {
    let eng = table.getString(i, 2); // Column index 2 = 'egn'
    let rus = table.getString(i, 3); // Column index 3 = 'rus'
    if (eng && rus) {
      validRows.push({ eng, rus });
    }
  }

  let rndIndex = int(random(validRows.length));
  let selected = validRows[rndIndex];
  correctAnswer = {
    question: selected.eng,
    answer: selected.rus
  };

  let wrongAnswers = [];
  while (wrongAnswers.length < 2) {
    let randomIndex = int(random(validRows.length));
    let wrong = validRows[randomIndex].rus;
    if (wrong !== correctAnswer.answer && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  let options = [correctAnswer.answer, ...wrongAnswers];
  shuffle(options, true);

  for (let i = 0; i < 3; i++) {
    let btn = createButton(options[i]);
    btn.position(width / 2 - 100, 180 + i * 70);
    btn.size(200, 50);
    btn.style('font-size', '18px');
    btn.mousePressed(() => checkAnswer(btn, options[i]));
    buttons.push(btn);
  }
}

function checkAnswer(btn, selected) {
  buttons.forEach(b => b.attribute('disabled', ''));
  if (selected === correctAnswer.answer) {
    btn.style('background-color', '#4CAF50');
    message = "إجابة صحيحة!";
  } else {
    btn.style('background-color', '#F44336');
    message = `خطأ! الترجمة الصحيحة: ${correctAnswer.answer}`;
  }
  nextButton.show();
}