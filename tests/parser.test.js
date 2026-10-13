const test = require('node:test');
const assert = require('node:assert/strict');
const p = require('../src/parser.js');
test('selected text extraction parses a title, date, times, and location', () => {
  const e = p.parse('Product launch\nOctober 21, 2026 · 2:30 PM - 4:00 PM\nLocation: Main Hall', 'Page');
  assert.equal(e.title, 'Product launch'); assert.equal(e.date, '2026-10-21'); assert.equal(e.startTime, '14:30'); assert.equal(e.endTime, '16:00'); assert.equal(e.location, 'Main Hall');
});
test('entire-page capture keeps useful page text as description', () => {
  const e = p.parse('Community workshop\nJoin us for a hands-on session.\nLocation: Library', 'Community page');
  assert.match(e.description, /hands-on session/); assert.equal(e.title, 'Community workshop'); assert.equal(e.location, 'Library');
});
test('date and time validation rejects invalid values without inventing them', () => {
  assert.equal(p.isValidDate('2026-02-30'), false); assert.equal(p.isValidDate('2026-10-21'), true); assert.equal(p.isValidTime('25:00'), false); assert.equal(p.isValidTime('14:30'), true); assert.equal(p.parseDate('sometime next week'), ''); assert.equal(p.parseTime('later'), '');
});
test('calendar URL encodes complete event fields', () => {
  const url = p.buildCalendarUrl({title:'Launch & demo',date:'2026-10-21',startTime:'14:30',endTime:'16:00',location:'Main Hall & Room 2',description:'Bring notes'});
  const u = new URL(url); assert.equal(u.searchParams.get('action'), 'TEMPLATE'); assert.equal(u.searchParams.get('text'), 'Launch & demo'); assert.equal(u.searchParams.get('dates'), '20261021T143000/20261021T160000'); assert.equal(u.searchParams.get('location'), 'Main Hall & Room 2');
});
test('calendar URL omits unknown date/time instead of fabricating them', () => {
  const u = new URL(p.buildCalendarUrl({title:'TBD event',date:'',startTime:'',endTime:'',description:'Details'})); assert.equal(u.searchParams.has('dates'), false); assert.equal(u.searchParams.get('text'), 'TBD event');
});

test('date parser handles common month-name formats', () => {
  assert.equal(p.parseDate('20th October, 2026'), '2026-10-20');
  assert.equal(p.parseDate('October 20th, 2026'), '2026-10-20');
  assert.equal(p.parseDate('Oct. 20, 2026'), '2026-10-20');
  assert.equal(p.parseDate('Tuesday, 20 October 2026'), '2026-10-20');
  assert.equal(p.parseDate('20/10/2026'), '2026-10-20');
});
