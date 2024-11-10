// ==UserScript==
// @name         Instagram
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
//	if (location.href.contains("direct")) {
//		return true
//	}
	let navBar = document.getElementsByClassName("x1iyjqo2 xh8yej3")
	console.log(navBar)
	if (navBar.length == 0) {
		return false
	}
	let lastNavBar = navBar[navBar.length-1]
	if (lastNavBar.children.length == 6) {
		removeElement(lastNavBar.children[2])
		return true
	}
	if (lastNavBar.children.length == 8) {
		removeElement(lastNavBar.children[3])
		return true
	}
	return false
}

function hideElement(element) {
	element.style.opacity = 0.01
}

function removeSponsoredAndRecommendedPosts() {
	let posts = [...document.querySelectorAll("article")]
	posts
		.filter(x => x.innerText.contains("Follow") || x.innerText.contains("Sponsored"))
		.forEach(hideElement)
	let afterEnded = [...document.querySelectorAll("article + div ~ article")]
	afterEnded.forEach(hideElement)
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

function onPageLoad() {
	console.log("Page Load...")
	removeReelsNavBar()
	removeReelsDesktopNavBar()
	removeSponsoredAndRecommendedPosts()
	setTimeout(removeReelsNavBar, 20)
	if (location.href.contains("explore")) {
		removeExploreSuggestions()
	}
	if (location.href.contains("reels")) {
		location.href = "https://www.instagram.com"
	}
}

function onDomChange(f) {
	let observer = new MutationObserver(() => {
		console.log("CHANGE")
		f()
	})
	observer.observe(document.body, { attributes: true, childList: true })
}

async function main() {
	onPageLoad()
	onDomChange(onPageLoad)
}

(function() {
    'use strict';

	main()
})()
