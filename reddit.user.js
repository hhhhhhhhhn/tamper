// ==UserScript==
// @name           Old reddit redirect
// @namespace      http://tampermonkey.net/
// @version        2024-11-08
// @author         You
// @run-at         document-start
// @match          https://*reddit.com/*
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

if (!location.href.includes("old.reddit.com")) {
	location.replace("https://old.reddit.com" + location.href.split("reddit.com").pop())
}
