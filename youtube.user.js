// ==UserScript==
// @name           Youtube
// @namespace      http://tampermonkey.net/
// @version        2024-11-08
// @description    This is meant to be used alongside Unhook
// @author         You
// @match          https://*.youtube.com/*
// @exclude-match  https://*.music.youtube.com/*
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_info
// @require        https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// ==/UserScript==
function removeFullscreenSuggestions() {
	let recommended = document.getElementsByClassName("fullscreen-recommendations-wrapper")
	;[...recommended].forEach(undisplayElement)
	let box = document.getElementsByClassName("fullscreen-more-videos-endpoint")
	;[...box].forEach(undisplayElement)
}

function removeSubscribedChannels() {
	let recommended = document.querySelectorAll("ytm-channel-list-sub-menu-renderer")
	;[...recommended].forEach(undisplayElement)
}

function removeSearchRecommendations() {
	let recommended = document.getElementsByClassName("ytSearchboxComponentSuggestionsContainer")
	;[...recommended].forEach(undisplayElement)
}

function removeMetrics() {
	[...document.querySelectorAll("#metadata-line")].forEach(removeElement);
	[...document.querySelectorAll("#info-container")].forEach(removeElement);
}

function removeDistractions() {
	removeFullscreenSuggestions()
	removeSubscribedChannels()
	removeSearchRecommendations()
	removeMetrics()
}

let dateForAsking24 = new Date(GM_getValue("24date", "2000"))

function is24Enabled() {
	return new Date() > dateForAsking24
}

function ask24Problem() {
	document.querySelectorAll("video").forEach(v => v.pause())
	document.querySelectorAll("audio").forEach(v => v.pause())
	while (true) {
		let hand = generate24Problem()
		let answer = prompt("Solve this 24 hand: " + hand.map(String).join(", "))
		if (is24SolutionHorrible(answer, hand) || answer == "override") {
			break
		}
	}
}

function isMobile() {
	return location.href.includes("m.youtube")
}

function getVideoTime() {
	return document.querySelector("video")?.currentTime || NaN
}

// In which playtime to ask another 24 problem
let nextVideoInTime
function handleNavigation() {
	if(url.includes("enable24") && !is24Enabled()) {
		dateForAsking24 = new Date()
		GM_setValue("24date", dateForAsking24.toISOString())
		alert("24 enabled")
	}
	if(url.includes("disable24") && is24Enabled) {
		dateForAsking24 = new Date(Date.now() + 60*60*1000)
		GM_setValue("24date", dateForAsking24.toISOString())
		alert("24 disabled")
	}
	// Make the use solve a 24 hand
	if(url.includes("watch") && isMobile() && is24Enabled()) {
		ask24Problem()
		nextVideoInTime = 10*60
	}
}

setInterval(() => {
	if (getVideoTime() > nextVideoInTime && isMobile() && is24Enabled()) {
		ask24Problem()
		for (let safety = 0; getVideoTime() > nextVideoInTime && safety < 100; safety++) {
			nextVideoInTime += 10*60
		}
	}
}, 5000)

let id = e => e
async function main() {
	try { // Needed to run "eval"
		window.trustedTypes.createPolicy("default", {createHTML: id, createScript: id, createScriptURL: id})
	}catch {}
	handleNavigation()
	onUrlChange(() => {console.log("url changed"); handleNavigation()})
	removeDistractions()
	onDomChange(removeDistractions)
}

(function() {
    'use strict';

	main()
})()

/************** 24 section **************/
// Where each bipartition has an "in" group, and an "out" group
function bipartitions(elements, inGroupAmount) {
	if (inGroupAmount > elements.length || inGroupAmount < 0) {
		return []
	}
	if (elements.length == 0) {
		return [[[], []]]
	}
	let head = elements[0]
	let tail = elements.slice(1)
	let totalBipartitions = []

	let tailBipartitionsTakingHead = bipartitions(tail, inGroupAmount-1)
	for (let tailBipartition of tailBipartitionsTakingHead) {
		let [inGroup, outGroup] = tailBipartition
		totalBipartitions.push([[head, ...inGroup], outGroup])
	}
	let tailBipartitionsWithoutTakingHead = bipartitions(tail, inGroupAmount)
	for (let tailBipartition of tailBipartitionsWithoutTakingHead) {
		let [inGroup, outGroup] = tailBipartition
		totalBipartitions.push([inGroup, [head, ...outGroup]])
	}
	return totalBipartitions
}

function handHas24Solution(hand) {
	if (hand.length == 1) {
		return Math.abs(hand[0] - 24) < 0.01
	}
	let handBipartitions = bipartitions(hand, 2)

	for (let [operated, others] of handBipartitions) {
		if (
			handHas24Solution([operated[0] + operated[1], ...others]) ||
			handHas24Solution([operated[0] - operated[1], ...others]) ||
			handHas24Solution([operated[0] * operated[1], ...others]) ||
			handHas24Solution([operated[0] / operated[1], ...others]) ||
			handHas24Solution([operated[1] - operated[0], ...others]) ||
			handHas24Solution([operated[1] / operated[0], ...others])
		) {
			return true
		}
	}
	return false
}

function generate24Problem() {
	while(true) {
		let hand = Array(4).fill(0).map(() => Math.floor(Math.random()*12)+1)
		if (handHas24Solution(hand)) {
			return hand
		}
	}
}

function arrayEquals(a, b) {
	return a.length == b.length && a.every((_, i) => a[i] == b[i])
}

function is24SolutionHorrible(input, problem) {
	try {
		input = input.replace(/[^\(\)*-/+0-9]/g, "")
		let numbers = input.split(/[^0-9]+/).filter(Boolean).map(Number)
		return Math.abs(eval(input)-24) < 0.01 && arrayEquals(numbers.toSorted(), problem.toSorted())
	} catch (e) {
		console.error(e)
		return false
	}

}
