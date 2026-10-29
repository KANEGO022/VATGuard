# VATGuard

VATGuard is a simple VAT reconciliation tool for checking VAT numbers and reviewing possible differences.

## What it does

- Enter VAT figures manually
- Import CSV or Excel files
- Check totals and expected VAT
- Highlight mismatches and review findings
- Review supporting transaction records
- Scan text locally for possible sensitive data
- Download CSV, JSON, and print-friendly reports
- Use a demo AI explanation mode when configured

## Run it

1. Open a terminal in the project folder.
2. Run:
   npm install
3. Start the app:
   npm run dev
4. Open the browser at:
   http://localhost:5173/

## Demo scenarios

- Scenario A: reconciled records
- Scenario B: output VAT mismatch
- Scenario C: sensitive text scan

## Optional AI

AI is optional. If no API key is configured, the app will clearly say it is unavailable.

To enable demo mode, add this to the server environment:

AI_MODE=demo

## Important

- This tool supports review and investigation.
- It does not replace professional judgement or official SARS advice.
- Reports are preliminary and not an official tax assessment.

## Tests and build

Run tests:
npm test

Build for production:
npm run build

## Files

Main project files:
- src/App.jsx
- src/vatEngine.js
- src/styles.css
- server.js
- README.md
