# CalClip Portfolio Checklist

## Before publishing

- [ ] Run `npm test` from the repository root.
- [ ] Load the extension in Chrome from the folder containing `manifest.json`.
- [ ] Test **Read selection** on a normal webpage.
- [ ] Test **Read entire page** on a normal webpage.
- [ ] Test a date such as `20th October, 2026` and a time range such as `10:00 AM to 12:00 PM`.
- [ ] Test missing or ambiguous dates and verify they can be edited manually.
- [ ] Open the Google Calendar draft and verify all fields before saving.
- [ ] Capture genuine screenshots: popup, extracted event preview, and Google Calendar draft.
- [ ] Add screenshots to a `screenshots/` directory and link them from `README.md`.
- [ ] Review the code and ensure there are no secrets, personal data, or API keys.
- [ ] Choose an appropriate license if you intend to make the repository open source.

## GitHub setup

1. Create a new GitHub repository named `calclip`.
2. Keep the repository public if you want recruiters to see it; otherwise keep it private.
3. Upload the contents of this project folder, including `README.md`, `manifest.json`, `src/`, `tests/`, `icons/`, and `package.json`.
4. Add a short repository description and relevant topics such as `chrome-extension`, `javascript`, `google-calendar`, and `manifest-v3`.
5. Do not upload ZIP archives, `node_modules`, personal browser data, or credentials.
6. Add screenshots and a short demo only after capturing them from the working extension.

## Honest project status

Describe automated parser tests and manual browser tests separately. Do not claim that the extension was tested across all websites or that it uses AI; the current MVP uses local rule-based parsing.
