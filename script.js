//import { factorial } from './math.js'; 

let currentLevel = 1;
let correctStreak = 0;
let currentQuestion, correctAnswer;

// Translations for English and Swedish
const translations = {
    en: {
        question: "What is",
        correct: "Correct!",
        incorrect: "Incorrect, the correct answer was",
    },
    sv: {
        question: "Vad är",
        correct: "Korrekt!",
        incorrect: "Fel, det rätta svaret var",
    }
};

// Default language is English
let language = "en";

// Function to switch languages
function changeLanguage(selectedLanguage) {
    language = selectedLanguage;
    update();  // Update the UI to reflect the new language
}


function generateQuestion() {
    let num1, num2, num3, operation;

    // Adjusted difficulty levels with different term sizes for each operator, more terms earlier, 'X' before '%', and reintroduced '!'
    const levelConfig = {
        1: { maxNum: { '+': 5 }, operations: ['+'], answerRange: [0, 6], allowNegative: false, terms: 2 },  // Simple addition
		2: { maxNum: { '+': 8 }, operations: ['+'], answerRange: [0, 12], allowNegative: false, terms: 2 },  // Simple addition
        3: { maxNum: { '+': 10, '-': 6 }, operations: ['+', '-'], answerRange: [0, 15], allowNegative: false, terms: 3 },  // Add more terms and subtraction (no negatives)
        4: { maxNum: { '+': 12, '-': 10, '*': 5 }, operations: ['+', '-', '*'], answerRange: [0, 20], allowNegative: false, terms: 3 },  // Add multiplication with small numbers
        5: { maxNum: { '+': 15, '-': 15, '*': 10, '/': 5 }, operations: ['+', '-', '*', '/'], answerRange: [0, 50], allowNegative: false, terms: 3 },  // Add division
        6: { maxNum: { '+': 20, '-': 20, '*': 10, '/': 10, 'X': 10 }, operations: ['+', '-', '*', '/', 'X'], answerRange: [0, 50], allowNegative: false, terms: 3 },  // Add solving for 'X'
        7: { maxNum: { '+': 30, '-': 30, '*': 15, '/': 15, 'X': 20, '%': 20 }, operations: ['+', '-', '*', '/', 'X', '%'], answerRange: [0, 50], allowNegative: false, terms: 3 },  // Add percentages
        8: { maxNum: { '+': 50, '-': 50, '*': 20, '/': 20, 'X': 30, '%': 30 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt'], answerRange: [0, 100], allowNegative: false, terms: 3 },  // Add square roots
        9: { maxNum: { '+': 100, '-': 100, '*': 30, '/': 30, 'X': 40, '%': 50, 'sqrt': 50 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!'], answerRange: [0, 100], allowNegative: false, terms: 4 },  // Reintroduce factorial
        10: { maxNum: { '+': 100, '-': 100, '*': 50, '/': 50, 'X': 50, '%': 50, 'sqrt': 50, '!': 10 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!', '^'], answerRange: [-100, 100], allowNegative: true, terms: 4 },  // Add exponentiation, allow negatives
        11: { maxNum: { '+': 100, '-': 100, '*': 100, '/': 100, 'X': 50, '%': 50, 'sqrt': 100, '!': 10, '^': 5 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!', '^', '()'], answerRange: [-100, 100], allowNegative: true, terms: 4 },  // Add parentheses with more complex terms
    };

    const config = levelConfig[Math.min(currentLevel, 10)];
    let terms = [];

    // Select the operation first to ensure the correct maxNum is used
    operation = config.operations[Math.floor(Math.random() * config.operations.length)];

    // Generate the terms based on the current operator and level configuration
    let numberOfTerms = config.terms;

    for (let i = 0; i < numberOfTerms; i++) {
        terms.push(Math.floor(Math.random() * config.maxNum[operation]));
    }
	
	console.log(`Operation: ${operation}, Terms: ${terms}`);

    let answerMin = config.answerRange[0];
    let answerMax = config.answerRange[1];

    if (operation === 'sqrt') {
        // Square root of perfect squares
        num1 = Math.floor(Math.random() * Math.sqrt(config.maxNum['sqrt']));
        correctAnswer = Math.sqrt(num1 * num1);
        currentQuestion = `√${num1 * num1}`;
    } else if (operation === '%') {
        // Percentages
        let allowedPercentages = [10, 25, 50, 100, 20, 30, 40, 60, 70, 80, 90];
        num1 = allowedPercentages[Math.floor(Math.random() * allowedPercentages.length)];
        num2 = Math.floor(Math.random() * config.maxNum['%']);
        correctAnswer = (num1 * (num2 / 100)).toFixed(2);
        currentQuestion = `${num1}% of ${num2}`;
    } else if (operation === 'X') {
        // Solve for X equations
        num1 = Math.floor(Math.random() * config.maxNum['X']);
        num2 = Math.floor(Math.random() * config.maxNum['X']);
        if (config.allowNegative && Math.random() > 0.5) {
            correctAnswer = num1 - num2;
            currentQuestion = `${num2} + X = ${num1}`;
        } else {
            correctAnswer = num1;
            currentQuestion = `X + ${num2} = ${num1 + num2}`;
        }
    } else if (operation === '!') {
        // Factorials
        num1 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = factorial(num1);
        currentQuestion = `${num1}!`;
    } else if (operation === '^') {
        // Exponentiation
        num1 = Math.floor(Math.random() * config.maxNum['^']) + 1;
        num2 = Math.floor(Math.random() * 3) + 1;
        correctAnswer = Math.pow(num1, num2);
        currentQuestion = `${num1} ^ ${num2}`;
    } else {
        switch (operation) {
            case '+':
                correctAnswer = terms.reduce((a, b) => a + b);
                currentQuestion = terms.join(' + ');
                break;
            case '-':
                if (!config.allowNegative) {
                    num1 = Math.max(...terms);
                    num2 = Math.min(...terms);
                } else {
                    num1 = terms[0];
                    num2 = terms[1];
                }
                correctAnswer = num1 - num2;
                currentQuestion = `${num1} - ${num2}`;
                break;
            case '*':
                do {
                    num1 = Math.floor(Math.random() * config.maxNum['*']);
                    num2 = Math.floor(Math.random() * config.maxNum['*']);
                    correctAnswer = num1 * num2;
                } while (correctAnswer < answerMin || correctAnswer > answerMax);
                currentQuestion = `${num1} * ${num2}`;
                break;
            case '/':
                do {
                    num1 = Math.floor(Math.random() * config.maxNum['/']);
                    num2 = Math.floor(Math.random() * config.maxNum['/']) || 1;
                    correctAnswer = (num1 / num2).toFixed(2);
                } while (correctAnswer < answerMin || correctAnswer > answerMax);
                currentQuestion = `${num1} / ${num2}`;
                break;
        }
    }
	update();
}

function checkAnswer() {
    let userAnswer = parseFloat(document.getElementById('answer').value);

    if (userAnswer === parseFloat(correctAnswer)) {
        correctStreak++;
        document.getElementById('result').textContent = 'Correct!';

        // Increase level every 3 correct answers
        if (correctStreak >= 3) {
            currentLevel++;
            correctStreak = 0;
        }
    } else {
        document.getElementById('result').textContent = `${translations[language].incorrect} ${correctAnswer}.`;
        correctStreak = 0;
    }

    setTimeout(generateQuestion, 1000);  // 50% reduced wait time before next question
}

// Debug function to advance levels
function advanceLevel() {
    currentLevel++;
    document.getElementById('level').textContent = currentLevel;
    generateQuestion();
}

function update(){
	document.getElementById('question').textContent = `${translations[language].question} ${currentQuestion}?`;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answer').focus();  // Auto-focus input field
    document.getElementById('level').textContent = currentLevel;  // Display current level
}

function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Event listener for the Enter key
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the first question
    generateQuestion();
});