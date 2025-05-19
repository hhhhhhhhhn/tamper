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
  el.parentElement.removeChild(el)
}

let domchangelisteners = []
let url = location.pathname + location.search
let observer = new MutationObserver(() => {
	if (location.pathname + location.search != url) {
		url = location.pathname + location.search
		document.dispatchEvent(new CustomEvent("urlchanged"))
	}
	domchangelisteners.forEach(f => f())
})
observer.observe(document.body, { attributes: true, childList: true, subtree: true })

function onDomChange(f) {
  domchangelisteners.push(f)
}
