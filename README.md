# VATGuard

VATGuard is a lightweight VAT reconciliation and review tool for accountants and reviewers working with fictional or anonymised financial data. The app is intended to supplement accounting software rather than replace it.

## What is implemented

- Manual VAT entry with date range, business reference, reported figures, adjustments, and configurable VAT rate.
- Transaction import from CSV and Excel files with basic validation and a downloadable CSV template.
- Deterministic VAT calculations for expected output VAT, input VAT totals, and preliminary net VAT position.
- Discrepancy detection for output VAT mismatches, input VAT mismatches, missing values, duplicate records, and out-of-period entries.
- Local cybersecurity scan for common sensitive patterns and redacted preview output.
- CSV, JSON, and print-friendly report generation workflow.
- Demo scenarios for reconciled records, output VAT mismatch, and sensitive-text scanning.
- Optional AI explanation backend with explicit confirmation, sanitized summary, service status, and server-side credentials.
- Explicit deterministic AI demo mode for testing the request workflow without contacting an external provider.
- Detailed print/PDF reconciliation report and a CSV summary export.

## Assumptions and limitations

- The project is an MVP built in the browser without a database or user authentication.
- The calculation engine is deterministic and review-oriented; it does not produce an official SARS assessment.
- Sensitive-data scanning is pattern-based and may miss some data or generate false positives.
- AI explanations are only available when a backend is configured with a valid API key and service endpoint; otherwise the app shows the truthful unavailable message.

## Installation

1. Open a terminal in the workspace root.
2. Run:
   npm install
3. Start the app with both the frontend and backend:
   npm run dev
4. Build for production:
   npm run build
5. Run tests:
   npm test

## Optional AI integration

VATGuard includes an optional backend route for AI explanations. To enable it:

1. Copy .env.example to .env
2. Add a valid `AI_API_KEY` and `AI_BASE_URL`
3. Restart the backend or run `npm run dev`

The frontend does not send any summary until the user explicitly confirms the sanitized request preview. Business reference and period identifiers are omitted from the AI payload. No complete uploaded accounting files are transmitted. Provider credentials remain in the backend environment and are never entered into the browser.

To exercise the confirmation flow without using a live model, set `AI_MODE=demo` in `.env`. The deterministic response is clearly labeled as a demo and is not presented as live AI output. Do not configure both modes for normal use; provider mode is the default in `.env.example`.

## Demonstration script

1. Open the app in the browser.
2. Select Scenario A to load reconciled VAT figures and click Reconcile VAT.
3. Confirm the expected VAT, reported VAT, and preliminary net position are displayed without unexpected mismatches.
4. Select Scenario B to load a mismatch case and inspect the discrepancy in the findings list.
5. Use the exported CSV and JSON buttons to verify the current results are being downloaded.
6. Select Scenario C and paste or type sensitive text into the Data Safety panel to review the local scan and redacted preview.
7. Confirm the AI section remains operational without a key and clearly reports that AI is unavailable.

## Supported formats

- CSV files with headers such as: transactionDate, reference, description, transactionType, amountExVat, vatAmount, vatRate, taxCategory
- Excel workbook files (.xlsx or .xls) with a similar header layout in the first worksheet

## Calculation assumptions

- The standard VAT rate is configurable and defaults to 15% for eligible standard-rated transactions.
- Zero-rated, exempt, and non-taxable items are excluded from expected output VAT unless a taxable category is supplied.
- Difference convention: reported amount − expected amount.
- Monetary values are treated with a practical cent-based rounding strategy to reduce false discrepancies.

## Data protection and security

- Files are processed locally in the browser wherever practical.
- Sensitive-pattern scanning is run in the browser and does not upload scanned text externally.
- Secret values are masked in the redacted preview instead of being repeated.
- A sample .env.example file is included for optional AI configuration, but production secrets should never be committed to source control.

## Professional-use guidance

This tool supports review and investigation by making assumptions visible and tracing findings to transaction records. It does not replace professional judgement, accounting standards, or tax advice.

## Evidence and status

The latest automated test run passed with 2 test files and 12 tests. The latest `npm run build` completed successfully with Vite. Vite's production build reports a bundle-size advisory because the Excel parser is included in the initial client bundle; it is a performance warning, not a build failure.

## Next steps

- Validate supported CSV and Excel column mappings against real, anonymized exports from the intended accounting software.
- Review VAT treatment assumptions and eligibility handling with a qualified tax professional.
- Consider code-splitting the workbook parser to reduce the initial JavaScript bundle size.
- Conduct a security review before using real business records or deploying the backend beyond a local development environment.
