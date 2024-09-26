let currentLevel = 1;
let correctStreak = 0;
let currentQuestion, correctAnswer;

// Default language is English
let language = "en";

// Translations for English and Swedish
const translations = {
    en: {
        question: "What is",
        correct: "Correct!",
        incorrect: "Incorrect, the correct answer was",
        solveX: "Solve for X",  // Added for English
        placeholder: "Your answer",  // Placeholder for input field
        submitButton: "Submit",  // Text for submit button
    },
    sv: {
        question: "Vad är",
        correct: "Korrekt!",
        incorrect: "Fel, det rätta svaret var",
        solveX: "Lös för X",  // Added for Swedish
        placeholder: "Ditt svar",  // Placeholder for input field (Swedish)
        submitButton: "Skicka",  // Text for submit button (Swedish)
    }
};

// Function to switch languages
function changeLanguage(selectedLanguage) {
    language = selectedLanguage;
    update();  // Update the UI to reflect the new language
}

function generateDebugAnswers() {
    let outputDiv = document.getElementById('debug-output');
    outputDiv.innerHTML = ''; // Clear previous output

    for (let level = 1; level <= 14; level++) {
        currentLevel = level;  // Set the current level
        outputDiv.innerHTML += `<h3>Level ${level}</h3>`; // Display level heading
        console.log(`NEW LEVEL ${currentLevel}`);
		setTimeout(2000);
        for (let i = 0; i < 10; i++) {
            generateQuestion();  // Generate a question for the current level
            // Append the question and its answer to the output div
            outputDiv.innerHTML += `<p>${currentQuestion}, Answer: ${correctAnswer}</p>`;
        }
    }
}

function generateQuestion() {
    let num1, num2, num3, operation;

    // Adjusted difficulty levels with different term sizes for each operator, more terms earlier, 'X' before '%', and reintroduced '!'
    const levelConfig = {
        1: { maxNum: { '+': 5 }, operations: ['+'], answerRange: [0, 6], allowNegative: false, allowDecimalAnswer: false, terms: 2 },  // Simple addition
		2: { maxNum: { '+': 8 }, operations: ['+'], answerRange: [0, 12], allowNegative: false, allowDecimalAnswer: false, terms: 2 },  // Simple addition
        3: { maxNum: { '+': 10, '-': 6 }, operations: ['+', '-'], answerRange: [0, 15], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add more terms and subtraction (no negatives)
        4: { maxNum: { '+': 12, '-': 10 }, operations: ['+', '-'], answerRange: [0, 20], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add multiplication with small numbers
		5: { maxNum: { '+': 12, '*': 3 }, operations: ['+', '*'], answerRange: [0, 20], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add multiplication with small numbers
		6: { maxNum: { 'X': 10 }, operations: ['X'], answerRange: [0, 20], allowNegative: false, allowDecimalAnswer: false, terms: 2 },  // Introducing X
        7: { maxNum: { '*': 10, '/': 5 }, operations: ['*', '/'], answerRange: [0, 50], allowNegative: false, allowDecimalAnswer: false, terms: 2 },  // Add division
		8: { maxNum: { '+': 15, '-': 15, '*': 10, '/': 20 }, operations: ['+', '-', '*', '/'], answerRange: [0, 50], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add division
        9: { maxNum: { '+': 20, '-': 20, '*': 10, '/': 10, 'X': 10 }, operations: ['+', '-', '*', '/', 'X'], answerRange: [0, 50], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add solving for 'X'
        10: { maxNum: { '+': 30, '-': 30, '*': 15, '/': 15, 'X': 20, '%': 20 }, operations: ['+', '-', '*', '/', 'X', '%'], answerRange: [0, 50], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add percentages
        11: { maxNum: { '+': 50, '-': 50, '*': 20, '/': 20, 'X': 30, '%': 30 }, operations: ['+', '-', '*', '/', 'X', '%',], answerRange: [0, 100], allowNegative: false, allowDecimalAnswer: false, terms: 3 },  // Add square roots
        12: { maxNum: { '+': 100, '-': 100, '*': 30, '/': 30, 'X': 40, '%': 50, 'sqrt': 100, '!' : 3}, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!'], answerRange: [0, 100], allowNegative: false, allowDecimalAnswer: false, terms: 4 },  // Reintroduce factorial
        13: { maxNum: { '+': 100, '-': 100, '*': 50, '/': 50, 'X': 50, '%': 50, 'sqrt': 100, '!': 4, '^': 4 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!', '^'], answerRange: [-100, 100], allowNegative: true, allowDecimalAnswer: false, terms: 4 },  // Add exponentiation, allow negatives
        14: { maxNum: { '+': 100, '-': 100, '*': 100, '/': 100, 'X': 50, '%': 50, 'sqrt': 100, '!': 5, '^': 5 }, operations: ['+', '-', '*', '/', 'X', '%', 'sqrt', '!', '^'], answerRange: [-100, 100], allowNegative: true, allowDecimalAnswer: false, terms: 4 },  // Add parentheses with more complex terms
    };
	
	const levelCount = Object.keys(levelConfig).length;
    const config = levelConfig[Math.min(currentLevel, levelCount)];
	let terms = [];

    // Select the operation first to ensure the correct maxNum is used
    operation = config.operations[Math.floor(Math.random() * config.operations.length)];

    // Generate the terms based on the current operator and level configuration
    let numberOfTerms = config.terms;	

    let answerMin = config.answerRange[0];
    let answerMax = config.answerRange[1];
	
	do {

		terms = [];
	    for (let i = 0; i < numberOfTerms; i++) {
			terms.push(Math.floor(Math.random() * config.maxNum[operation]));
		}
	
		if (operation === 'sqrt') {
			// Square root of perfect squares
			num1 = Math.floor(Math.random() * Math.sqrt(config.maxNum['sqrt']));
			correctAnswer = Math.sqrt(num1 * num1);
			currentQuestion = `√${num1 * num1}`;
		} else if (operation === '%') {
			// Percentages
			let allowedPercentages = [10, 25, 50, 100, 20, 30, 40, 60, 70, 80, 90];
			do {
				num1 = allowedPercentages[Math.floor(Math.random() * allowedPercentages.length)];
				num2 = Math.floor(Math.random() * config.maxNum['%']);
				correctAnswer = (num1 * (num2 / 100));
				currentQuestion = `${num1}% of ${num2}`;
			} while(!config.allowDecimalAnswer && !Number.isInteger(correctAnswer));
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
			num1 = Math.floor(Math.random() * config.maxNum['!']) + 1;
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
						num1 = Math.floor(Math.random() * config.maxNum['*']);
						num2 = Math.floor(Math.random() * config.maxNum['*']);
						correctAnswer = num1 * num2;
					currentQuestion = `${num1} * ${num2}`;
					break;
				case '/':
					do {
						num1 = Math.floor(Math.random() * config.maxNum['/']);
						num2 = Math.floor(Math.random() * config.maxNum['/']) || 1;
						correctAnswer = (num1 / num2);
						currentQuestion = `${num1} / ${num2}`;
					} while(!config.allowDecimalAnswer && num1 % num2 !== 0);
					break;
			}
		}
	console.log(`Operation: ${operation}, Terms: ${terms}, Correct Answer: ${correctAnswer}`);
	setTimeout(400);
	} while (correctAnswer < answerMin || correctAnswer > answerMax || (!config.allowDecimalAnswer && !Number.isInteger(correctAnswer)));
	
	console.log(`Operation: ${operation}, Terms: ${terms}`);
	update();
}

function checkAnswer() {
    let userAnswer = parseFloat(document.getElementById('answer').value);

    if (userAnswer === parseFloat(correctAnswer)) {
        correctStreak++;
        document.getElementById('result').textContent = 'Correct!';

        // Increase level every 4 correct answers
        if (correctStreak >= 4) {
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

function update() {
    // Separate the question into an instruction and the actual operation
    let instruction;
    let mathExpression = currentQuestion;  // The actual numbers and operators
	
	    // Determine if the operation is solving for X
    if (currentQuestion.includes('X')) {
        instruction = translations[language].solveX;  // "Solve for X" in both languages
    } else {
        instruction = translations[language].question;  // "What is" or "Vad är" for other cases
    }

    // Update the DOM
    document.getElementById('instruction').textContent = `${instruction}?`;  // First row with instruction
    document.getElementById('math-expression').textContent = mathExpression;  // Second row with numbers and operators
    document.getElementById('answer').placeholder = translations[language].placeholder;  // Update placeholder
    document.getElementById('submit-button').textContent = translations[language].submitButton;  // Update submit button text
    document.getElementById('answer').value = '';  // Reset the input field
    document.getElementById('result').textContent = '';  // Clear previous result
    document.getElementById('answer').focus();  // Auto-focus input field
    document.getElementById('level').textContent = currentLevel;  // Update the current level
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