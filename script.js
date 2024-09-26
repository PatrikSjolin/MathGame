let currentLevel = 1;
let correctStreak = 0;
let currentQuestion, correctAnswer;

function generateQuestion() {
    let num1, num2, operation;

    // Difficulty control with focus on understanding concepts rather than large numbers
    const levelConfig = {
        1: { maxNum: 10, operations: ['+'] },                    // Simple addition
        2: { maxNum: 20, operations: ['+', '-'] },               // Addition and subtraction
        3: { maxNum: 10, operations: ['+', '-', '*'] },          // Add multiplication
        4: { maxNum: 50, operations: ['+', '-', '*', '/'] },     // Division is added
        5: { maxNum: 100, operations: ['+', '-', '*', '/', '%'] },// Percentages
        6: { maxNum: 20, operations: ['+', '-', '*', '/', 'sqrt', 'X'] }, // Variables and square root
        7: { maxNum: 50, operations: ['+', '-', '*', '/', '%', 'sqrt', 'X', '^', '()'] } // Power and parentheses
    };

    const config = levelConfig[Math.min(currentLevel, 7)];
    let terms = [];

    // Generate equation with more terms as difficulty increases
    let numberOfTerms = currentLevel >= 5 ? Math.floor(Math.random() * 3) + 2 : 2;

    for (let i = 0; i < numberOfTerms; i++) {
        terms.push(Math.floor(Math.random() * config.maxNum));
    }

    operation = config.operations[Math.floor(Math.random() * config.operations.length)];

    if (operation === 'sqrt') {
        // Square root questions
        num1 = Math.floor(Math.random() * config.maxNum);
        correctAnswer = Math.sqrt(num1).toFixed(2);
        currentQuestion = `√${num1}`;
    } else if (operation === '%') {
        // Percentage questions
        num1 = Math.floor(Math.random() * config.maxNum);
        num2 = Math.floor(Math.random() * config.maxNum);
        correctAnswer = (num1 * (num2 / 100)).toFixed(2);
        currentQuestion = `${num1}% of ${num2}`;
    } else if (operation === 'X') {
        // Solve for X questions
        num1 = Math.floor(Math.random() * config.maxNum);
        num2 = Math.floor(Math.random() * config.maxNum);
        correctAnswer = num1;
        currentQuestion = `X + ${num2} = ${num1 + num2}`;
    } else if (operation === '()') {
        // Parentheses questions
        num1 = Math.floor(Math.random() * config.maxNum);
        num2 = Math.floor(Math.random() * config.maxNum);
        num3 = Math.floor(Math.random() * config.maxNum);
        correctAnswer = num1 * (num2 + num3);
        currentQuestion = `${num1} * (${num2} + ${num3})`;
    } else if (operation === '^') {
        // Exponentiation
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 3) + 1;
        correctAnswer = Math.pow(num1, num2);
        currentQuestion = `${num1} ^ ${num2}`;
    } else {
        // Default operations (+, -, *, /)
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
                correctAnswer = terms.reduce((a, b) => a * b);
                currentQuestion = terms.join(' * ');
                break;
            case '/':
                correctAnswer = terms.reduce((a, b) => a / b).toFixed(2);
                currentQuestion = terms.join(' / ');
                break;
        }
    }

    document.getElementById('question').textContent = `What is ${currentQuestion}?`;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answer').focus();  // Auto-focus input field
    document.getElementById('level').textContent = currentLevel;  // Display current level
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
        document.getElementById('result').textContent = 'Incorrect, try again!';
        correctStreak = 0;  // Reset streak on incorrect answer
    }

    setTimeout(generateQuestion, 1000); // Wait before generating the next question
}

// Debug function to advance levels
function advanceLevel() {
    currentLevel++;
    document.getElementById('level').textContent = currentLevel; // Display new level
    generateQuestion();
}

// Event listener for the Enter key
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Factorial function
function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Initialize the first question
generateQuestion();
