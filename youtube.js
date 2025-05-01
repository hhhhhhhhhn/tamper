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

function removeElement(element) {
	element.parentElement.removeChild(element)
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

function onPageLoad() {
	removeFullscreenSuggestions()
	removeSubscribedChannels()
	removeSearchRecommendations()
}

let url = location.href
function onDomChange(f) {
	let observer = new MutationObserver(() => {
		console.log("CHANGE")
		if (location.href != url) {
			url = location.href
			console.log("NAVIGATE")
			document.dispatchEvent(new CustomEvent("urlchanged"))
		}
		f()
	})
	observer.observe(document.body, { attributes: true, childList: true, subtree: true })
}

function handleNavigation() {
	if(location.href.includes("watch") && navigator.userAgentData.mobile) {
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
}

let id = e => e
async function main() {
	try { // Needed to run "eval"
		window.trustedTypes.createPolicy("default", {createHTML: id, createScript: id, createScriptURL: id})
	}catch {}
	handleNavigation()
	document.addEventListener("urlchanged", handleNavigation) // Custom event, defined above
	onPageLoad()
	onDomChange(onPageLoad)
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
