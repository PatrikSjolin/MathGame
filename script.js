let currentLevel = 1;
let correctStreak = 0;
let currentQuestion, correctAnswer;

function generateQuestion() {
    let num1, num2, num3, operation;

    // Adjusting difficulty to control answer size, decimal, and negativity
    const levelConfig = {
        1: { maxNum: 10, operations: ['+'] },                    // Simple addition
        2: { maxNum: 20, operations: ['+', '-'] },               // Addition and subtraction
        3: { maxNum: 10, operations: ['+', '-', '*'] },          // Add multiplication
        4: { maxNum: 50, operations: ['+', '-', '*', '/'] },     // Add division
        5: { maxNum: 100, operations: ['+', '-', '*', '/', '%'] }, // Add percentages
        6: { maxNum: 20, operations: ['+', '-', '*', '/', 'sqrt', 'X'] }, // Variables and square roots
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

    // Limitations on answer types
    if (operation === 'sqrt') {
        // Square root questions with a perfect square
        num1 = Math.floor(Math.random() * config.maxNum);
        num1 = num1 * num1; // Make sure we only use perfect squares
        correctAnswer = Math.sqrt(num1).toFixed(2);
        currentQuestion = `√${num1}`;
    } else if (operation === '%') {
        // Limit percentage to multiples of 10, 25, 50, and 100
        let allowedPercentages = [10, 25, 50, 100, 20, 30, 40, 60, 70, 80, 90];
        num1 = allowedPercentages[Math.floor(Math.random() * allowedPercentages.length)];
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
        // Default operations with small numbers to avoid overly large results
        switch (operation) {
            case '+':
                correctAnswer = terms.reduce((a, b) => a + b);
                currentQuestion = terms.join(' + ');
                break;
            case '-':
                correctAnswer = terms.reduce((a, b) => a - b);
                correctAnswer = Math.max(0, correctAnswer); // Avoid negative answers
                currentQuestion = terms.join(' - ');
                break;
            case '*':
                correctAnswer = terms.reduce((a, b) => a * b);
                currentQuestion = terms.join(' * ');
                break;
            case '/':
                num1 = terms[0];
                num2 = terms[1] === 0 ? 1 : terms[1]; // Avoid division by 0
                correctAnswer = (num1 / num2).toFixed(2);
                currentQuestion = `${num1} / ${num2}`;
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
        document.getElementById('result').textContent = `Incorrect, the correct answer was ${correctAnswer}.`;
        correctStreak = 0;  // Reset streak on incorrect answer
    }

    setTimeout(generateQuestion, 2000); // Wait before generating the next question
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

// Factorial function (for later use if needed)
function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Initialize the first question
generateQuestion();
