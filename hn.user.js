// ==UserScript==
// @name           HN remove AI
// @namespace      http://tampermonkey.net/
// @version        2024-11-08
// @description    Removes AI news
// @author         You
// @match          https://*news.ycombinator.com/*
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require        https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// ==/UserScript==

let ignore = ["AI", "Grok", "Gemini", "LLM", "ML", "Deep", "MCP", "Llama", "Ollama", "GPT", "RL", "Devin", ".ai"]
let ignoreCaseless = ["prompt", "model", "agent", "context engin", "vibe cod", "vibe-cod", "neural"]

function shouldIgnore(text) {
	for(let word of ignore) {
		if (text.includes(word)) return true
	}
	text = text.toLowerCase()
	for(let word of ignoreCaseless) {
		if (text.includes(word)) return true
	}
	return false
}

[...document.querySelectorAll(".submission")]
	.filter(e => shouldIgnore(e.textContent))
	.forEach(e => {
		undisplayElement(e)
		undisplayElement(e.nextElementSibling)
		undisplayElement(e.nextElementSibling.nextElementSibling)
	});
[...document.querySelectorAll(".score")].forEach(removeElement);
[...document.querySelectorAll(".age")].forEach(removeElement);
[...document.querySelectorAll("a")].filter(e => e.textContent.includes("comment") && e.getAttribute("href").includes("item?id"))
	.forEach(e => e.innerHTML = "comments")

