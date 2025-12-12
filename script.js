const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const baseFrom = document.getElementById("base-from");
const baseTo = document.getElementById("base-to");
const numberInput = document.getElementById("number-input");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");
const resultNum = document.getElementById("number-display");
const resultConv = document.getElementById("converted-display");
const historyDiv = document.getElementById("history");
const themeToggle = document.getElementById("theme-toggle");

// Swap bases
swapBtn.addEventListener("click", () => {
    [baseFrom.value, baseTo.value] = [baseTo.value, baseFrom.value];
});

// Uppercase input automatically
numberInput.addEventListener("input", () => {
    numberInput.value = numberInput.value.toUpperCase();
});

// Convert function
convertBtn.addEventListener("click", () => {
    const numStr = numberInput.value.trim().toUpperCase();
    const bFrom = parseInt(baseFrom.value);
    const bTo = parseInt(baseTo.value);

    if (bFrom < 2 || bFrom > 36 || bTo < 2 || bTo > 36) {
        // Only log error in history
        historyDiv.innerHTML += `Error: Bases must be between 2 and 36 (input: '${numStr}')<br>`;
        historyDiv.scrollTop = historyDiv.scrollHeight;
        return;
    }

    try {
        const decimalVal = baseToDecimal(numStr, bFrom);
        const result = decimalToBase(decimalVal, bTo, 10);

        // Show only the result, wrap long numbers
        resultConv.textContent = trimTrailingZeros(result);
        resultConv.style.whiteSpace = "pre-wrap";  // wrap long numbers

        // Update history with full info including errors if any
        historyDiv.innerHTML += `${numStr} (base ${bFrom}) → ${trimTrailingZeros(result)} (base ${bTo})<br>`;
        historyDiv.scrollTop = historyDiv.scrollHeight;
    } catch (err) {
        // Log error only in history
        historyDiv.innerHTML += `Error: ${err.message} (input: '${numStr}')<br>`;
        historyDiv.scrollTop = historyDiv.scrollHeight;
    }
});

// Trim trailing zeros after decimal
function trimTrailingZeros(value) {
    if (!value.includes('.')) return value;
    value = value.replace(/0+$/, '');
    if (value.endsWith('.')) value = value.slice(0, -1);
    return value;
}

// Base to decimal (supports fractions)
function baseToDecimal(numStr, base) {
    let [intPart, fracPart] = numStr.includes('.') ? numStr.split('.') : [numStr, ''];

    let intVal = 0;
    for (let i = 0; i < intPart.length; i++) {
        const digit = intPart[intPart.length - 1 - i];
        const idx = DIGITS.indexOf(digit);
        if (idx === -1 || idx >= base) throw new Error(`Invalid digit '${digit}'`);
        intVal += idx * (base ** i);
    }

    let fracVal = 0;
    for (let i = 0; i < fracPart.length; i++) {
        const digit = fracPart[i];
        const idx = DIGITS.indexOf(digit);
        if (idx === -1 || idx >= base) throw new Error(`Invalid digit '${digit}'`);
        fracVal += idx * (base ** -(i + 1));
    }

    return intVal + fracVal;
}

// Decimal to any base (supports fractions)
function decimalToBase(num, base, precision=10) {
    let intPart = Math.floor(num);
    let fracPart = num - intPart;

    let intStr = intPart === 0 ? "0" : "";
    while (intPart > 0) {
        intStr = DIGITS[intPart % base] + intStr;
        intPart = Math.floor(intPart / base);
    }

    if (fracPart === 0) return intStr;

    let fracStr = "";
    let count = 0;
    while (fracPart > 0 && count < precision) {
        fracPart *= base;
        const digit = Math.floor(fracPart);
        fracStr += DIGITS[digit];
        fracPart -= digit;
        count++;
    }

    return `${intStr}.${fracStr}`;
}

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
});
