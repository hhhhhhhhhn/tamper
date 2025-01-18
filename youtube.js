// ==UserScript==
// @name         Youtube
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  This is meant to be used alongside Unhook
// @author       You
// @match        https://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

function removeelement(element) {
	element.parentelement.removechild(element)
}

function undisplayElement(element) {
	element.style.display = "none"
}

function hideElement(element) {
	element.style.opacity = 0.01
}

function removeFullscreenSuggestions() {
	let recommended = document.getElementsByClassName("fullscreen-recommendations-wrapper")
	;[...recommended].forEach(undisplayElement)
}

function onPageLoad() {
	removeFullscreenSuggestions()
}

function onDomChange(f) {
	let observer = new MutationObserver(() => {
		console.log("CHANGE")
		f()
	})
	observer.observe(document.body, { attributes: true, childList: true, subtree: true })
}

async function main() {
	onPageLoad()
	onDomChange(onPageLoad)
}

(function() {
    'use strict';

	main()
})()
