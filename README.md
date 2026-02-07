# 🛞 Wheel Offset Calculator

A web-based calculator for determining wheel offset and fitment specifications. Supports both Top Mount and Back Mount configurations.

## Features

- **Dual Mode Support**: Top Mount and Back Mount calculations
- **Real-time Calculations**: Results update as you type
- **Rolling Diameter Calculator**: Calculates tire rolling diameter and overall height
- **Offset Calculator**: Determines final wheel offset based on specifications
- **Mobile Responsive**: Works great on all devices
- **Clean UI**: Modern, intuitive interface

## Live Demo

Visit: [https://jamestobias.github.io/wheel-calculator](https://jamestobias.github.io/wheel-calculator)

## How to Use

1. Select your mount type (Top Mount or Back Mount)
2. Enter tire specifications:
   - Section Width (mm)
   - Profile (%)
   - Diameter (inches)
3. Enter wheel specifications:
   - Width (inches)
   - PCD + Holes (e.g., 5x114.3)
   - Pad Height (mm)
   - Outer Rim Width (inches)
   - Inner Rim Width (inches)
4. Results calculate automatically!

## Calculations

### Rolling Diameter
```
((SecWidth × (Profile/100) / 12.7 + Diameter) × 3.14) × 25.4
```

### Overall Height
```
(SecWidth × (Profile/100) / 12.7 + Diameter)
```

### Final Offset
**Top Mount:**
```
(25.4 × Width/2) - PadHeight - (OuterRim × 25.4 + 3.6) + 9.75
```

**Back Mount:**
```
(25.4 × Width/2) - PadHeight - (OuterRim × 25.4 + 3.6) + 9.75 - 24.7
```

## Tech Stack

- Pure HTML, CSS, and JavaScript
- No dependencies or frameworks
- Hosted on GitHub Pages

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jamestobias/wheel-calculator.git
   ```

2. Open `index.html` in your browser

That's it! No build process required.

## License

MIT License - feel free to use and modify as needed.

## Author

Built by James Tobias
