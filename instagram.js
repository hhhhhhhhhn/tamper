// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

function removeElement(element) {
	element.parentElement.removeChild(element)
}

function removeReelsNavBar() {
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
}

function removeReelsDesktopNavBar() {
	console.log("Trying to remove reels desktop")
	if (location.href.contains("direct")) {
		return true
	}
	let navBar = document.getElementsByClassName("x1iyjqo2 xh8yej3")
	if (navBar.length == 0 || navBar[0].children.length != 6) {
		return false
	}
	removeElement(navBar[0].children[2])
	return true
}

function removeExploreSuggestions() {
	if (!location.href.contains("explore")) {
		return true
	}
	let recommended = document.getElementsByClassName("x78zum5 xdt5ytf x1iyjqo2 xdj266r xkrivgy")
	if (recommended.length == 0) {
		return false
	}
	removeElement(recommended[0])
	return true
}

function tryForSomeTime(f) {
	let count = 0
	let interval = setInterval(() => {
		if(f() || count > 200) {
			clearInterval(interval)
		}
		count++
	}, 30)
}

function onPageLoad() {
	console.log("Page Load...")
	tryForSomeTime(removeReelsNavBar)
	tryForSomeTime(removeReelsDesktopNavBar)
	if (location.href.contains("explore")) {
		tryForSomeTime(removeExploreSuggestions)
	}
	if (location.href.contains("reels")) {
		location.href = "https://www.instagram.com"

	}
}

function onUrlChange(f) {
	let currentUrl = location.href
	document.addEventListener("click", () => {
		let count = 0
		let interval = setInterval(() => {
			if (location.href != currentUrl) {
				currentUrl = location.href
				f()
				clearInterval()
			}
			if (count > 10) {
				clearInterval(interval)
			}
			count++
		}, 20)
		f
	})
}

async function main() {
	onPageLoad()
	onUrlChange(onPageLoad)
}

(function() {
    'use strict';

	main()
})()
