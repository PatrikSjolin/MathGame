const debugMode = false;

if (debugMode) {
    console.log('Debug mode is ON.');
}

const debugElements = document.getElementsByClassName('debug-element');

for (let i = 0; i < debugElements.length; i++) {
    if (debugMode) {
        debugElements[i].style.display = 'block';
    } else {
        debugElements[i].style.display = 'none';
    }
}

let questionHistory = [];  // Array to store previously answered questions with a correctness flag
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

    for (let level = 1; level <= 19; level++) {
        currentLevel = level;  // Set the current level
        outputDiv.innerHTML += `<h3>Level ${level}</h3>`; // Display level heading
        console.log(`NEW LEVEL ${currentLevel}`);
		setTimeout(1000);
        for (let i = 0; i < 10; i++) {
            generateQuestion();  // Generate a question for the current level
			historyEntry = questionHistory.find(q => q.question === currentQuestion);
			historyEntry.correct = true;
            // Append the question and its answer to the output div
            outputDiv.innerHTML += `<p>${currentQuestion}, Answer: ${correctAnswer}</p>`;
        }
		update();
    }
}

function generateQuestion() {
    let num1, num2, num3, operation;

    // Adjusted difficulty levels with different term sizes for each operator, more terms earlier, 'X' before '%', and reintroduced '!'
    const levelConfig = {
        1: { minNum: { '+': 1 }, maxNum: { '+': 5 }, operations: ['+'], answerRange: [0, 6], allowDecimalAnswer: false, terms: 2 },  // Simple addition
		2: { minNum: { '+': 0 }, maxNum: { '+': 8 }, operations: ['+'], answerRange: [0, 12], allowDecimalAnswer: false, terms: 2 },  // Simple addition but with slightly larger numbers
        3: { minNum: { '+': 0, '-': 0}, maxNum: { '+': 10, '-': 6 }, operations: ['+', '-'], answerRange: [0, 15], allowDecimalAnswer: false, terms: 2 },  // Add more terms and subtraction (no negatives)
        4: { minNum: { '+': 0, '-': 0 }, maxNum: { '+': 12, '-': 10 }, operations: ['+', '-'], answerRange: [0, 20], allowDecimalAnswer: false, terms: 3 },  // Add multiplication with small numbers
		5: { minNum: { '+': 0, '*': 0 }, maxNum: { '+': 12, '*': 4 }, operations: ['+', '*'], answerRange: [0, 20], allowDecimalAnswer: false, terms: 3 },  // Add multiplication with small numbers
		6: { minNum: { '*': 1 }, maxNum: { '*': 5 }, operations: ['*'], answerRange: [0, 20], allowDecimalAnswer: false, terms: 3 },  // Add multiplication with small numbers
		7: { minNum: { 'X': 0 }, maxNum: { 'X': 10 }, operations: ['X'], answerRange: [0, 20], allowDecimalAnswer: false, terms: 2 },  // Introducing X
        8: { minNum: { '*': 1, '/': 1 }, maxNum: { '*': 10, '/': 5 }, operations: ['*', '/'], answerRange: [0, 100], allowDecimalAnswer: false, terms: 2 },  // Add division
		9: { minNum: { '/': 2 }, maxNum: { '/': 20 }, operations: ['/'], answerRange: [0, 50], allowDecimalAnswer: false, terms: 2 },  // Add division
		10: { minNum: { '+': 1, '-': 1, '*': 1, '/': 2, 'X': 1 }, maxNum: { '+': 15, '-': 15, '*': 10, '/': 20, 'X': 10 }, operations: ['+', '-', '*', '/', 'X'], answerRange: [0, 50], allowDecimalAnswer: false, terms: 3 },  // Doing X for more operators
		11: { minNum: {'-': 1 }, maxNum: { '-': 10 }, operations: ['-'], answerRange: [-10, -1], allowDecimalAnswer: false, terms: 2 },  // Add division
        12: { minNum: { '+': 2, '-': 2, '*': -10, '/': -10, 'X': 1 }, maxNum: { '+': 20, '-': 20, '*': 10, '/': 10, 'X': 10 }, operations: ['+', '-', '*', '/', 'X'], answerRange: [-20, 50], allowDecimalAnswer: false, terms: 3 },  // Add solving for 'X'
        13: { minNum: { '%': 2 }, maxNum: { '%': 30 }, operations: ['%'], answerRange: [0, 100], allowDecimalAnswer: false, terms: 3 },  // Add percentages
        14: { minNum: { '+': 5, '-': 5, '*': 2, '/': 2, 'X': 3, '%': 3 }, maxNum: { '+': 50, '-': 50, '*': 20, '/': 20, 'X': 30, '%': 40 }, operations: ['+', '-', '*', '/', 'X', '%',], answerRange: [0, 100], allowDecimalAnswer: false, terms: 3 },  // Add square roots
        15: { minNum: { 'X': 4, '%': 5, 'sqrt': 3 }, maxNum: { 'X': 40, '%': 50, 'sqrt': 20 }, operations: ['X', '%', 'sqrt'], answerRange: [0, 100], allowDecimalAnswer: false, terms: 2 },  // Reintroduce factorial
		16: { minNum: { 'sqrt': 3 }, maxNum: { 'sqrt': 20 }, operations: ['sqrt'], answerRange: [0, 100], allowDecimalAnswer: false, terms: 2 },  // Reintroduce factorial
        17: { minNum: { '*': 3, '!': 1 }, maxNum: { '*': 12, '!': 4 }, operations: ['*', '!'], answerRange: [-100, 100], allowDecimalAnswer: false, terms: 4 },  // Add exponentiation, allow negatives
        18: { minNum: {'+': 10, '^': 2 }, maxNum: { '+': 50, '^': 5 }, operations: ['+', '^'], answerRange: [-100, 100], allowDecimalAnswer: false, terms: 4 },  // Add parentheses with more complex terms
		19: { minNum: { '+': -30, '-': -30, '*': -12, '/': -12, '%': 0, '!': 0, 'X': -12, '^': 5 }, maxNum: { '+': 30, '-': 30, '*': 12, '/': 12, '%': 100, '!': 6, 'X': 12, '^': 5 }, operations: ['+', '-', '*', '/', '%', '!', 'X', '^'], answerRange: [-200, 200], allowDecimalAnswer: false, terms: 4 },  // Add parentheses with more complex terms
    };
	
	const levelCount = Object.keys(levelConfig).length;
    const config = levelConfig[Math.min(currentLevel, levelCount)];
	let terms = [];
    let operators = [];

    // Select the operation first to ensure the correct maxNum is used
    operation = config.operations[Math.floor(Math.random() * config.operations.length)];

    // Generate the terms based on the current operator and level configuration
    let numberOfTerms = Math.floor(Math.random() * (config.terms - 2 + 1)) + 2;

    let answerMin = config.answerRange[0];
    let answerMax = config.answerRange[1];
	
	let historyEntry = null;  // Define historyEntry outside the loop
	let historicRetries = 0;
	do {
		terms = [];
		operators = [];
		historicRetries++;
	    for (let i = 0; i < numberOfTerms; i++) {
			let min = config.minNum[operation] || 0;  // Default to 0 if no minNum is defined
            let max = config.maxNum[operation] || 10; // Default to 10 if no maxNum is defined
            let term = Math.floor(Math.random() * (max - min + 1)) + min;  // Generate a term within the min/max range
            terms.push(term);
			operators.push(config.operations[Math.floor(Math.random() * config.operations.length)]);
		}
	
		if (operation === 'sqrt') {
			// Square root of perfect squares
			num1 = Math.floor(Math.random() * terms[0]);
			correctAnswer = Math.sqrt(num1 * num1);
			currentQuestion = `√${num1 * num1}`;
		} else if (operation === '%') {
			// Percentages
			let allowedPercentages = [10, 25, 50, 100, 20, 30, 40, 60, 70, 80, 90];
			num1 = allowedPercentages[Math.floor(Math.random() * allowedPercentages.length)];
			num2 = terms[0];
			correctAnswer = (num1 * (num2 / 100));
			currentQuestion = `${num1}% of ${num2}`;
		} else if (operation === 'X') {
			// Solve for X equations
			num1 = terms[0];
			num2 = terms[1];
			correctAnswer = num1;
			currentQuestion = `X + ${num2} = ${num1 + num2}`;
		} else if (operation === '!') {
			// Factorials
			num1 = terms[0];
			correctAnswer = factorial(num1);
			currentQuestion = `${num1}!`;
		} else if (operation === '^') {
			// Exponentiation
			num1 = terms[0];
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
					correctAnswer = terms.reduce((a, b) => a - b);
					currentQuestion = terms.join(' - ');
					break;
				case '*':
					num1 = terms[0];
					num2 = terms[1];
					correctAnswer = num1 * num2;
					currentQuestion = `${num1} * ${num2}`;
					break;
				case '/':
					num1 = terms[0];
					num2 = terms[1] || 1;
					correctAnswer = (num1 / num2);
					currentQuestion = `${num1} / ${num2}`;
					break;
			}
		}
		
		 // Check the question history
		 historyEntry = questionHistory.find(q => q.question === currentQuestion);
		
		if(debugMode) {
			console.log(`Retry: ${historicRetries}, Operation: ${operation}, Terms: ${terms}, Correct Answer: ${correctAnswer}`);
			setTimeout(400);
		}
	} while ((historyEntry && historyEntry.correct && historicRetries < 10) || correctAnswer < answerMin || correctAnswer > answerMax || (!config.allowDecimalAnswer && !Number.isInteger(correctAnswer)));
	
	if(debugMode){
		console.log(`Operation: ${operation}, Terms: ${terms}`);
	}
	
	// Store the generated question in history
    questionHistory.push({ question: currentQuestion, answer: correctAnswer, correct: false });
	update();
}

function checkAnswer() {
    let userAnswer = parseFloat(document.getElementById('answer').value);

    if (userAnswer === parseFloat(correctAnswer)) {
        correctStreak++;
        document.getElementById('result').textContent = 'Correct!';
		
		// Find the question in history and mark it as correct
        let historyEntry = questionHistory.find(q => q.question === currentQuestion);
        if (historyEntry) {
            historyEntry.correct = true;  // Mark it as correct
        }

        // Update the background-size to reflect progress (0% to 100%)
        let progressPercentage = (correctStreak / 4) * 100;
        document.getElementById('level-container').style.backgroundSize = `${progressPercentage}% 100%`;

        if (correctStreak >= 4) {
            currentLevel++;
            correctStreak = 0;

            // Keep the container full during the highlight
            document.getElementById('level-container').style.backgroundSize = '100% 100%';

            // Highlight the entire level container
            document.getElementById('level-container').classList.add('highlight');
            
            setTimeout(() => {
                document.getElementById('level-container').classList.remove('highlight');
                document.getElementById('level-container').style.backgroundSize = '0% 100%';  // Reset progress
            }, 1000);  // Highlight lasts for 1 second
        }
    } else {
        document.getElementById('result').textContent = `${translations[language].incorrect} ${correctAnswer}.`;
		
		// Mark the question as incorrect in history
        let historyEntry = questionHistory.find(q => q.question === currentQuestionKey);
        if (historyEntry) {
            historyEntry.correct = false;  // Mark it as incorrect
        }
		
        correctStreak = 0;
        document.getElementById('level-container').style.backgroundSize = '0% 100%';  // Reset progress on wrong answer
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
    document.getElementById('instruction').textContent = `${instruction}`;  // First row with instruction
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