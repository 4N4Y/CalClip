// These functions are injected into the active page with chrome.scripting.
function readSelectedText() { return (window.getSelection && window.getSelection().toString()) || ''; }
function readEntirePage() { return document.body ? document.body.innerText : document.documentElement.innerText; }
