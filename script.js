// Calculator state
let currentMode = 'topMount';

// Get all input elements
const inputs = {
    secWidth: document.getElementById('secWidth'),
    profile: document.getElementById('profile'),
    diameter: document.getElementById('diameter'),
    width: document.getElementById('width'),
    pcd: document.getElementById('pcd'),
    padHeight: document.getElementById('padHeight'),
    outerRim: document.getElementById('outerRim'),
    innerRim: document.getElementById('innerRim')
};

// Get result elements
const results = {
    rollingDiameter: document.getElementById('rollingDiameter'),
    overallHeight: document.getElementById('overallHeight'),
    finalOffset: document.getElementById('finalOffset')
};

// Mode buttons
const topMountBtn = document.getElementById('topMount');
const backMountBtn = document.getElementById('backMount');

// Mode switching
topMountBtn.addEventListener('click', () => switchMode('topMount'));
backMountBtn.addEventListener('click', () => switchMode('backMount'));

function switchMode(mode) {
    currentMode = mode;
    
    if (mode === 'topMount') {
        topMountBtn.classList.add('active');
        backMountBtn.classList.remove('active');
        // Set default values for top mount
        inputs.secWidth.value = 255;
        inputs.profile.value = 35;
        inputs.diameter.value = 20;
        inputs.width.value = 10.5;
        inputs.padHeight.value = -2;
        inputs.outerRim.value = 3.5;
        inputs.innerRim.value = 6.5;
    } else {
        backMountBtn.classList.add('active');
        topMountBtn.classList.remove('active');
        // Set default values for back mount
        inputs.secWidth.value = 245;
        inputs.profile.value = 35;
        inputs.diameter.value = 19;
        inputs.width.value = 13;
        inputs.padHeight.value = 26;
        inputs.outerRim.value = 3;
        inputs.innerRim.value = 8.5;
    }
    
    calculate();
}

// Add event listeners to all inputs
Object.values(inputs).forEach(input => {
    input.addEventListener('input', calculate);
});

// Calculation functions based on Excel formulas
function calculate() {
    const secWidth = parseFloat(inputs.secWidth.value) || 0;
    const profile = parseFloat(inputs.profile.value) || 0;
    const diameter = parseFloat(inputs.diameter.value) || 0;
    const width = parseFloat(inputs.width.value) || 0;
    const padHeight = parseFloat(inputs.padHeight.value) || 0;
    const outerRim = parseFloat(inputs.outerRim.value) || 0;
    
    // Rolling Diameter calculation
    // Formula: ((SecWidth * (Profile/100) / 12.7 + Diameter) * 3.14) * 25.4
    const rollingDiameter = ((secWidth * (profile / 100) / 12.7 + diameter) * 3.14) * 25.4;
    
    // Overall Height calculation
    // Formula: (SecWidth * (Profile/100) / 12.7 + Diameter)
    const overallHeight = (secWidth * (profile / 100) / 12.7 + diameter);
    
    // Final Offset calculation
    // Top Mount: (25.4 * Width/2) - PadHeight - (OuterRim * 25.4 + 3.6) + 9.75
    // Back Mount: (25.4 * Width/2) - PadHeight - (OuterRim * 25.4 + 3.6) + 9.75 - 24.7
    let finalOffset;
    if (currentMode === 'topMount') {
        finalOffset = (25.4 * width / 2) - padHeight - (outerRim * 25.4 + 3.6) + 9.75;
    } else {
        finalOffset = (25.4 * width / 2) - padHeight - (outerRim * 25.4 + 3.6) + 9.75 - 24.7;
    }
    
    // Update results
    results.rollingDiameter.textContent = rollingDiameter.toFixed(2) + ' mm';
    results.overallHeight.textContent = overallHeight.toFixed(2) + ' inches';
    results.finalOffset.textContent = finalOffset.toFixed(2) + ' mm';
}

// Initial calculation
calculate();
