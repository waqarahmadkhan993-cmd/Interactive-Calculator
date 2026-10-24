
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
  display.value = current;
}

function inputNumber(number) {
  if (resetNext || current === "Error") {
    current = number;
    resetNext = false;
  } else if (current === "0") {
    current = number;
  } else if (current.length < 15) {
    current += number;
  }
  updateDisplay();
}

function inputDecimal() {
  if (resetNext || current === "Error") {
    current = "0";
    resetNext = false;
  }

  if (!current.includes(".")) {
    current += ".";
  }
  updateDisplay();
}

function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? null : a / b;
  return b;
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;

  const value = Number(current);

  if (operator && !resetNext) {
    const result = calculate(previous, value, operator);

    if (result === null || !Number.isFinite(result)) {
      current = "Error";
      previous = null;
      operator = null;
      resetNext = true;
      updateDisplay();
      return;
    }

    current = String(Number(result.toPrecision(12)));
  }

  previous = Number(current);
  operator = nextOperator;
  resetNext = true;
  updateDisplay();
}

function showResult() {
  if (operator === null || previous === null || current === "Error") {
    return;
  }

  const result = calculate(previous, Number(current), operator);

  if (result === null || !Number.isFinite(result)) {
    current = "Error";
  } else {
    current = String(Number(result.toPrecision(12)));
  }

  previous = null;
  operator = null;
  resetNext = true;
  updateDisplay();
}

function clearCalculator() {
  current = "0";
  previous = null;
  operator = null;
  resetNext = false;
  updateDisplay();
}

function deleteLast() {
  if (resetNext || current === "Error") {
    current = "0";
    resetNext = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
  }
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    inputDecimal();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  } else if (button.dataset.action === "calculate") {
    showResult();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    showResult();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
