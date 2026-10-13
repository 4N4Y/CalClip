# CalClip — Turn Webpage Details into Calendar Events

CalClip is a lightweight Chrome extension that helps users turn event information on a webpage into a pre-filled Google Calendar event. It supports selected-text capture and whole-page capture, lets users review the extracted fields, and opens Google Calendar with an editable event draft.

> **Project status:** MVP / portfolio project. Automated parser tests pass; live Chrome testing should be completed on your own machine before describing browser behavior as fully verified.

## Features

- **Two capture modes:** read text selected by the user or read the current page's visible text.
- **Editable event draft:** title, date, start time, end time, location, and description.
- **Conservative local parsing:** recognizes common explicit date and time formats without an AI service.
- **Calendar handoff:** generates a pre-filled Google Calendar URL; the user reviews and saves the event in Google Calendar.
- **Minimal browser permissions:** uses Chrome Manifest V3 with `activeTab` and `scripting`.
- **No backend or API key:** the MVP does not use an AI API, database, OAuth flow, or external server.
- **Automated tests:** Node.js built-in test runner checks parser behavior and Calendar URL generation.

## Demo flow

1. Open a webpage with an event announcement.
2. Highlight the relevant text and choose **Read selection**, or choose **Read entire page**.
3. Review and correct the extracted fields.
4. Choose **Open in Google Calendar**.
5. Review the draft in Google Calendar and click **Save** if it is correct.

CalClip does not create or save calendar events automatically.

## Installation in Chrome

1. Download or clone this repository.
2. Open Chrome and visit `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the project folder containing `manifest.json` (the `calclip` folder in this repository).
6. Pin CalClip from Chrome's Extensions menu if desired.

To apply code changes, return to `chrome://extensions` and click the extension's **Reload** icon.

## Development and tests

Requirements: a recent version of Node.js and Google Chrome.

From the project root, run:

```bash
npm test
```

The automated test suite covers:

- Parsing event title, date, start/end times, and location from sample text
- Keeping page text available as a description
- Rejecting invalid date/time values
- Handling common month-name and numeric date formats
- Generating an encoded Google Calendar URL
- Leaving unknown date/time values unset rather than fabricating them

The tests validate parser logic. They do **not** replace manual testing in Chrome.

## Project structure

```text
calclip/
├── manifest.json
├── package.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── popup.html       # Extension popup markup
│   ├── popup.css        # Popup styling
│   ├── popup.js         # Capture, form validation, extension UI behavior
│   ├── parser.js        # Text parsing and Calendar URL builder
│   ├── content.js       # Page text helper functions
│   └── background.js    # Extension service worker
└── tests/
    └── parser.test.js   # Automated parser tests
```

## Privacy and permissions

- `activeTab` provides temporary access to the active tab after the user invokes the extension.
- `scripting` allows the extension to read text from the active page on request.
- The MVP does not send webpage text to an external server or AI provider.
- Captured text is used to prefill the event form; the user should review it before opening Calendar.
- Chrome restricts script execution on internal browser pages and some protected pages.

## Current limitations

- Date and time parsing is rule-based and only supports common explicit formats.
- Relative dates such as “next Friday” and “tomorrow” are not reliably interpreted.
- Ambiguous numeric dates may be interpreted as day/month/year; review extracted values.
- Whole-page capture can select a navigation label or unrelated text as the title on some sites.
- Complex timetables containing multiple events are not split into separate events yet.
- The extension opens a pre-filled Calendar draft; the user must save it manually.
- Live browser compatibility has to be verified manually in Chrome.

## Roadmap

- [ ] Improve title selection and date/time extraction using more test cases
- [ ] Add an event preview that highlights uncertain fields
- [ ] Detect multiple events in a timetable and let users choose which to add
- [ ] Add optional AI-assisted extraction through a secure backend (never embed a secret API key in extension code)
- [ ] Add accessibility checks and keyboard-navigation polish
- [ ] Capture real screenshots and a short demo GIF for the repository

## Portfolio presentation checklist

Before sharing this project publicly:

- [ ] Run `npm test` and confirm all tests pass.
- [ ] Load the extension through `chrome://extensions` and test both capture modes.
- [ ] Test an announcement with a month-name date, a numeric date, and missing date/time fields.
- [ ] Verify that the generated Calendar draft contains the expected title, date, time, location, and description.
- [ ] Add screenshots you captured yourself to a `screenshots/` folder and embed them here.
- [ ] Add your own name and contact links to the repository description or profile, if desired.
- [ ] Choose and add a license only if you have the rights to publish all included code and assets under that license.

## Suggested GitHub repository description

`A lightweight Chrome extension that extracts event details from selected webpage text or a full page and opens a pre-filled Google Calendar event.`

## Suggested resume bullet

Built **CalClip**, a Manifest V3 Chrome extension using JavaScript that captures selected or full-page text, parses common event details, validates fields, and generates pre-filled Google Calendar event links; added automated parser tests with Node.js.

## Suggested project demo narration

“CalClip reduces the manual work of transferring event details from a webpage into Google Calendar. Users select relevant text or scan a page, review the extracted title, date, time, and location, and open an editable Calendar draft. The current MVP uses local rule-based parsing, so uncertain values remain editable and the user stays in control.”
