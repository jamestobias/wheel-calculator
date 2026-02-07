// Calculator state
let currentMode = 'topMount';
let currentOffsetX = 200; // Start at center

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

// Canvas setup
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

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
    
    // Draw wheel visualization
    drawWheel();
}

// Draw animated wheel cross-section
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 15;
    
    const width = parseFloat(inputs.width.value) * scale;
    const diameter = parseFloat(inputs.diameter.value) * scale;
    const outerRim = parseFloat(inputs.outerRim.value) * scale;
    const innerRim = parseFloat(inputs.innerRim.value) * scale;
    const padHeight = parseFloat(inputs.padHeight.value);
    
    // Wheel face
    ctx.fillStyle = '#42413e';
    ctx.fillRect(centerX - width/2, centerY - diameter/2, width, diameter);
    
    // Outer lip (red accent)
    ctx.fillStyle = '#fe4547';
    ctx.fillRect(centerX - width/2, centerY - diameter/2, outerRim, diameter);
    
    // Inner lip (red accent)
    ctx.fillStyle = '#fe4547';
    ctx.fillRect(centerX + width/2 - innerRim, centerY - diameter/2, innerRim, diameter);
    
    // Center line
    ctx.strokeStyle = '#faf9f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - diameter/2 - 30);
    ctx.lineTo(centerX, centerY + diameter/2 + 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Animated offset indicator
    const targetOffsetX = centerX + (padHeight * 0.3);
    
    // Smooth interpolation
    currentOffsetX += (targetOffsetX - currentOffsetX) * 0.15;
    
    // Offset indicator (animated green dot with glow)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#28a745';
    ctx.fillStyle = '#28a745';
    ctx.beginPath();
    ctx.arc(currentOffsetX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Inner white dot for contrast
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(currentOffsetX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#faf9f6';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${inputs.diameter.value}"`, centerX, centerY + diameter/2 + 40);
    ctx.fillText(`${inputs.width.value}"`, centerX, centerY - diameter/2 - 20);
    
    // Continue animation if not at target
    if (Math.abs(targetOffsetX - currentOffsetX) > 0.5) {
        requestAnimationFrame(drawWheel);
    }
}

// PDF Download
document.getElementById('downloadPdf').addEventListener('click', downloadPDF);

function downloadPDF() {
    const date = new Date().toLocaleDateString();
    const mode = currentMode === 'topMount' ? 'Top Mount' : 'Back Mount';
    
    // Gather all values
    const pdfContent = `
SUPREME FORGED
Wheel Offset Calculator Results

Date: ${date}
Mode: ${mode}

PRIMARY SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Width:              ${inputs.width.value} inches
Pad Height:         ${inputs.padHeight.value} mm
Outer Rim Width:    ${inputs.outerRim.value} inches

FINAL OFFSET:       ${results.finalOffset.textContent}

TIRE SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section Width:      ${inputs.secWidth.value} mm
Profile:            ${inputs.profile.value}%
Diameter:           ${inputs.diameter.value} inches

Rolling Diameter:   ${results.rollingDiameter.textContent}
Overall Height:     ${results.overallHeight.textContent}

ADDITIONAL SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PCD + Holes:        ${inputs.pcd.value}
Inner Rim Width:    ${inputs.innerRim.value} inches


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Supreme Forged Wheel Calculator
https://jamestobias.github.io/wheel-calculator/
`;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supreme-forged-offset-${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initial calculation
calculate();
