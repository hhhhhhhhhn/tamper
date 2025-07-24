// ==UserScript==
// @name         Instagram stop scroll
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @author       You
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require        https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// @grant        none
// ==/UserScript==

function addStyleSheet(stylesheet) {
	if(document.getElementById("userscriptstyle")) return
	document.head.insertAdjacentHTML("beforeend",
		`<style id="userscriptstyle">${stylesheet}</style>`
	)
}

onDomChange(() => {
	console.log("Change")
	if (location.href.includes("explore")) {
		document.body.style.height = "1000px"
	}
	else if (location.href.includes("chaining")) {
		document.body.style.height = "10000px"
	}
	else if (location.href.endsWith("instagram.com") || location.href.endsWith("instagram.com/")) {
		document.body.style.height = "10000px"
	}
	addStyleSheet(`
	html body:not(.RANDOMCLASS):not(.RANDOMCLAS3):not(RANDOMCLAS2) {
		overflow-y: hidden !important;
	}
	`)
})

