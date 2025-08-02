class BingoGame {
    constructor(containerId, cardId) {
        this.container = document.getElementById(containerId);
        this.cardId = cardId; // Unique ID for this card instance
        this.cardData = this.generateCard();
        this.markedNumbers = new Set();
        this.renderCard();
    }

    /**
     * Generates a standard 5x5 Bingo card.
     * B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)
     * Free space in the center (N3).
     */
    generateCard() {
        const columns = {
            'B': [], 'I': [], 'N': [], 'G': [], 'O': []
        };

        // Helper to get unique random numbers within a range
        const getRandomNumbers = (min, max, count) => {
            const numbers = new Set();
            while (numbers.size < count) {
                numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            return Array.from(numbers).sort((a, b) => a - b); // Optional: sort for better readability
        };

        columns['B'] = getRandomNumbers(1, 15, 5);
        columns['I'] = getRandomNumbers(16, 30, 5);
        columns['N'] = getRandomNumbers(31, 45, 5);
        columns['G'] = getRandomNumbers(46, 60, 5);
        columns['O'] = getRandomNumbers(61, 75, 5);

        // Place the free space in the center (N column, 3rd row, index 2)
        columns['N'][2] = 'FREE';

        // Reformat into a 2D array for easier rendering and win checking
        const card = [];
        for (let r = 0; r < 5; r++) {
            const row = [];
            for (const colKey of ['B', 'I', 'N', 'G', 'O']) {
                row.push(columns[colKey][r]);
            }
            card.push(row);
        }
        return card;
    }

    /**
     * Renders the Bingo card HTML elements.
     */
    renderCard() {
        this.container.innerHTML = ''; // Clear previous content

        // Add header row
        const headerLetters = ['B', 'I', 'N', 'G', 'O'];
        headerLetters.forEach(letter => {
            const headerCell = document.createElement('div');
            headerCell.classList.add('bingo-cell', 'bingo-header');
            headerCell.textContent = letter;
            this.container.appendChild(headerCell);
        });

        // Add number cells
        this.cardData.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;

                if (cellValue === 'FREE') {
                    cell.textContent = cellValue;
                    cell.classList.add('free-space');
                    this.markedNumbers.add('FREE'); // Mark free space as already marked
                } else {
                    cell.textContent = cellValue;
                    cell.dataset.number = cellValue; // Store the number for easy lookup
                }

                // If the number was previously marked (e.g., from local storage or WebSocket update)
                if (this.markedNumbers.has(cellValue)) {
                    cell.classList.add('marked');
                }

                this.container.appendChild(cell);
            });
        });
    }

    /**
     * Marks a number on the Bingo card if it exists.
     * @param {number} numberToMark - The number drawn.
     * @returns {boolean} True if the number was found and marked, false otherwise.
     */
    markNumber(numberToMark) {
        if (typeof numberToMark !== 'number' || isNaN(numberToMark)) {
            console.warn("Invalid number provided to markNumber.");
            return false;
        }

        const foundCell = this.container.querySelector(`.bingo-cell[data-number="${numberToMark}"]`);

        if (foundCell && !this.markedNumbers.has(numberToMark)) {
            foundCell.classList.add('marked');
            this.markedNumbers.add(numberToMark);
            console.log(`Marked number: ${numberToMark}`);
            this.checkForWin(); // Check for win after marking
            return true;
        } else if (this.markedNumbers.has(numberToMark)) {
            console.log(`Number ${numberToMark} already marked.`);
            return false;
        } else {
            console.log(`Number ${numberToMark} not found on this card.`);
            return false;
        }
    }

    /**
     * Checks for winning patterns (rows, columns, diagonals).
     * This is a basic implementation and can be optimized.
     */
    checkForWin() {
        const rows = 5;
        const cols = 5;
        const board = this.cardData; // The generated card numbers
        const marked = this.markedNumbers; // The set of marked numbers

        // Helper to check if all numbers in a line are marked
        const isLineMarked = (line) => line.every(num => num === 'FREE' || marked.has(num));

        let bingo = false;

        // Check Rows
        for (let r = 0; r < rows; r++) {
            if (isLineMarked(board[r])) {
                console.log(`BINGO! Row ${r + 1} completed!`);
                bingo = true;
            }
        }

        // Check Columns
        for (let c = 0; c < cols; c++) {
            const column = [];
            for (let r = 0; r < rows; r++) {
                column.push(board[r][c]);
            }
            if (isLineMarked(column)) {
                console.log(`BINGO! Column ${c + 1} completed!`);
                bingo = true;
            }
        }

        // Check Diagonal (top-left to bottom-right)
        const diag1 = [];
        for (let i = 0; i < rows; i++) {
            diag1.push(board[i][i]);
        }
        if (isLineMarked(diag1)) {
            console.log("BINGO! Diagonal (TL-BR) completed!");
            bingo = true;
        }

        // Check Diagonal (top-right to bottom-left)
        const diag2 = [];
        for (let i = 0; i < rows; i++) {
            diag2.push(board[i][rows - 1 - i]);
        }
        if (isLineMarked(diag2)) {
            console.log("BINGO! Diagonal (TR-BL) completed!");
            bingo = true;
        }

        if (bingo) {
            this.displayMessage("BINGO! You've got a winning pattern!");
            // In a real scenario, you would notify the server via WebSocket here.
            // Example: this.ws.send(JSON.stringify({ type: 'bingo', cardId: this.cardId, pattern: '...' }));
        }
    }

    /**
     * Displays a message to the user.
     * @param {string} msg - The message to display.
     * @param {boolean} isError - True if it's an error message.
     */
    displayMessage(msg, isError = false) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = msg;
        messageElement.style.color = isError ? '#dc3545' : '#28a745';
    }
}

// --- Main application logic ---
document.addEventListener('DOMContentLoaded', () => {
    // In your full PWA, the cardId would come from a URL parameter
    // or be assigned after login, e.g., 'OP987AM'.
    // For this example, we'll use a placeholder.
    const uniqueCardId = 'TEST-CARD-001';

    // Initialize the Bingo game for the specified container
    const myBingoGame = new BingoGame('bingoCardContainer', uniqueCardId);

    // Event listener for manual number marking (for testing purposes)
    const markNumberBtn = document.getElementById('markNumberBtn');
    const markNumberInput = document.getElementById('markNumberInput');

    markNumberBtn.addEventListener('click', () => {
        const number = parseInt(markNumberInput.value, 10);
        if (number >= 1 && number <= 75) {
            myBingoGame.markNumber(number);
            myBingoGame.displayMessage(''); // Clear previous messages
            markNumberInput.value = ''; // Clear input
        } else {
            myBingoGame.displayMessage("Please enter a number between 1 and 75.", true);
        }
    });

    // Example of simulating a number drawn (which would come from WebSocket)
    // setTimeout(() => {
    //     const drawnNumber = Math.floor(Math.random() * 75) + 1;
    //     console.log(`Simulating WebSocket draw: ${drawnNumber}`);
    //     myBingoGame.markNumber(drawnNumber);
    // }, 5000);
});