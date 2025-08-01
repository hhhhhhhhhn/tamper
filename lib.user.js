// ==UserScript==
// @name        Library
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/19/2025, 12:20:38 AM
// ==/UserScript==
function removeElement(el) {
	if (!el) return;
	el.parentElement.removeChild(el)
}

function undisplayElement(el) {
	if (!el) return;
	el.style.display = "none"
}

function hideElement(el) {
	if (!el) return;
	el.style.opacity = 0.01
}

let domchangelisteners = []
let urlchangelisteners = []

function onDomChange(f) {
	f()
	document.addEventListener("DOMContentLoaded", f)
	domchangelisteners.push(f)
}

function onUrlChange(f) {
	urlchangelisteners.push(f)
}

let url = location.pathname + location.search
let observer = new MutationObserver(() => {
	if (location.pathname + location.search != url) {
		url = location.pathname + location.search
		urlchangelisteners.forEach(f => f())
	}
	domchangelisteners.forEach(f => f())
})
observer.observe(document.body, { attributes: true, childList: true, subtree: true })
