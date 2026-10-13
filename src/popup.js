const $ = (id) => document.getElementById(id);
const fields = ['title','date','startTime','endTime','location','description'];
function setStatus(message, type='') { const el=$('status'); el.textContent=message; el.className=`status ${type}`; }
function fill(event) { fields.forEach(key => { $(key).value = event[key] || ''; }); }
async function capture(kind) {
  setStatus('Reading the page…');
  try {
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    if (!tab?.id) throw new Error('No active tab found.');
    const func = kind === 'selection' ? () => (window.getSelection && window.getSelection().toString()) || '' : () => document.body ? document.body.innerText : document.documentElement.innerText;
    const result = await chrome.scripting.executeScript({target:{tabId:tab.id},func});
    const text = (result?.[0]?.result || '').trim();
    if (!text) { setStatus(kind === 'selection' ? 'No text selected. Highlight some text and try again.' : 'This page has no readable text.', 'error'); return; }
    fill(CalClipParser.parse(text, tab.title));
    setStatus(`Captured ${kind === 'selection' ? 'your selection' : 'the page text'}. Review every field before creating.`, 'success');
  } catch (error) { setStatus(`Could not read this page. Try a normal webpage (not a Chrome internal page).`, 'error'); }
}
$('readSelection').addEventListener('click', () => capture('selection'));
$('readPage').addEventListener('click', () => capture('page'));
$('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const event = Object.fromEntries(fields.map(k => [k, $(k).value.trim()]));
  const problems=[];
  if (!event.title) problems.push('Add an event title.');
  if (event.date && !CalClipParser.isValidDate(event.date)) problems.push('Check the date.');
  if (event.startTime && !CalClipParser.isValidTime(event.startTime)) problems.push('Check the start time.');
  if (event.endTime && !CalClipParser.isValidTime(event.endTime)) problems.push('Check the end time.');
  if (event.startTime && event.endTime && event.endTime < event.startTime) problems.push('End time must be after start time.');
  if (problems.length) { $('validation').hidden=false; $('validation').textContent=problems.join(' '); return; }
  $('validation').hidden=true;
  const url = CalClipParser.buildCalendarUrl({title:event.title,date:event.date,startTime:event.startTime,endTime:event.endTime,location:event.location,description:event.description});
  await chrome.tabs.create({url});
  setStatus('Google Calendar opened in a new tab. Save the event there.', 'success');
});
