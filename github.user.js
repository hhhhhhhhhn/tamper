// ==UserScript==
// @name           Github
// @namespace      http://tampermonkey.net/
// @version        2024-11-08
// @description    Github
// @author         You
// @match          https://*github.com/*
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require        https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// ==/UserScript==

onDomChange(() => {
	[...document.querySelectorAll(".copilotPreview__container")].forEach(removeElement);
	[...document.querySelectorAll(".AppHeader-CopilotChat")].forEach(removeElement);
	[...document.querySelectorAll("ul:has(> li[data-command-name=\"search-copilot-chat\"])")]
		.forEach(e => {removeElement(e.previousSibling.previousSibling); removeElement(e)});
	[...document.querySelectorAll(".ActionListItem")].filter(e => e.textContent.includes("Copilot")).map(removeElement);
	[...document.querySelectorAll(".prc-ActionList-ActionListItem-uq6I7")].filter(e => e.textContent.includes("Copilot")).map(removeElement);
})
