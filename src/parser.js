(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CalClipParser = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const MONTHS = {
    january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3,
    april: 4, apr: 4, may: 5, june: 6, jun: 6, july: 7, jul: 7,
    august: 8, aug: 8, september: 9, sep: 9, sept: 9, october: 10,
    oct: 10, november: 11, nov: 11, december: 12, dec: 12
  };

  function pad(n) { return String(n).padStart(2, '0'); }
  function normalizeText(text) { return String(text || '').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); }
  function validDate(y, m, d) {
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  }
  function isoDate(y, m, d) { return validDate(y, m, d) ? `${y}-${pad(m)}-${pad(d)}` : ''; }

  function parseDate(text) {
    const s = String(text || '').replace(/\u00a0/g, ' ');

    // ISO-style dates: 2026-10-20, 2026/10/20, 2026.10.20
    let m = s.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (m) return isoDate(+m[1], +m[2], +m[3]);

    // Numeric dates are interpreted conservatively as DD/MM/YYYY.
    m = s.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b/);
    if (m) return isoDate(+m[3], +m[2], +m[1]);

    const monthPattern = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\\.?';

    // Month-first: October 20, 2026; Oct. 20th 2026; October 20th.
    const monthFirst = new RegExp('\\b' + monthPattern + '\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(20\\d{2}))?\\b', 'i');
    m = s.match(monthFirst);
    if (m) return isoDate(+(m[3] || new Date().getFullYear()), MONTHS[m[1].toLowerCase()], +m[2]);

    // Day-first: 20 October 2026; 20th October, 2026; 20 Oct.
    const dayFirst = new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+' + monthPattern + '(?:,?\\s+(20\\d{2}))?\\b', 'i');
    m = s.match(dayFirst);
    if (m) return isoDate(+(m[3] || new Date().getFullYear()), MONTHS[m[2].replace(/\\.$/, '').toLowerCase()], +m[1]);

    return '';
  }

  function parseTime(text) {
    const m = text.match(/\b(\d{1,2})(?::([0-5]\d))?\s*(a\.?m\.?|p\.?m\.?)\b/i);
    if (!m) return '';
    let hour = +m[1]; const minute = +(m[2] || 0); const meridiem = m[3].toLowerCase().replace(/\./g, '');
    if (hour < 1 || hour > 12) return '';
    if (meridiem === 'pm' && hour !== 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    return `${pad(hour)}:${pad(minute)}`;
  }

  function firstLine(text) { return normalizeText(text).split('\n').map(x => x.trim()).find(Boolean) || ''; }
  function parse(text, pageTitle) {
    const clean = normalizeText(text);
    const date = parseDate(clean);
    const timeMatches = [...clean.matchAll(/\b\d{1,2}(?::[0-5]\d)?\s*(?:a\.?m\.?|p\.?m\.?)\b/ig)];
    const startTime = timeMatches[0] ? parseTime(timeMatches[0][0]) : '';
    const endTime = timeMatches[1] ? parseTime(timeMatches[1][0]) : '';
    const loc = clean.match(/(?:location|where|venue)\s*[:\-]\s*([^\n|]+)/i);
    const titleLine = firstLine(clean);
    const title = titleLine || normalizeText(pageTitle) || 'New event';
    const description = clean;
    return { title, date, startTime, endTime, location: loc ? loc[1].trim() : '', description };
  }

  function isValidDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && validDate(+value.slice(0, 4), +value.slice(5, 7), +value.slice(8, 10)); }
  function isValidTime(value) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(value); }
  function toCalendarDate(date, time) { return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`; }
  function buildCalendarUrl(event) {
    const params = new URLSearchParams();
    params.set('action', 'TEMPLATE');
    params.set('text', event.title || 'New event');
    if (event.date && isValidDate(event.date) && event.startTime && isValidTime(event.startTime)) {
      const end = event.endTime && isValidTime(event.endTime) ? event.endTime : event.startTime;
      params.set('dates', `${toCalendarDate(event.date, event.startTime)}/${toCalendarDate(event.date, end)}`);
    }
    if (event.details || event.description) params.set('details', event.details || event.description);
    if (event.location) params.set('location', event.location);
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
  return { normalizeText, parse, parseDate, parseTime, isValidDate, isValidTime, buildCalendarUrl };
});
