// ==UserScript==
// @name         Instagram remove reels
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @author       You
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// @grant        none
// ==/UserScript==

onDomChange(() => {
	console.log("Trying to remove reels")
	if (location.href.contains("direct")) {
		return true
	}
	let navBar = document.getElementsByClassName("x1o5hw5a xaeubzz x1yvgwvq")
	if (navBar.length == 0 || navBar[0].children[0].children.length != 5) {
		return false
	}
	removeElement(navBar[0].children[0].children[2])
	return true
})

