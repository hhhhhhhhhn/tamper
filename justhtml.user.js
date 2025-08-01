// ==UserScript==
// @name           Just HTML
// @namespace      http://tampermonkey.net/
// @version        2024-11-08
// @author         You
// @match          https://*/*
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require        https://github.com/hhhhhhhhhn/tamper/raw/refs/heads/dev/lib.user.js
// ==/UserScript==

function removeInlineStyles(el) {
	el.removeAttribute('style')

	el.childNodes.forEach(x => {
		if(x.nodeType == 1) removeInlineStyles(x)
	})
}

unsafeWindow.removeElement = removeElement

onDomChange(() => {
	removeInlineStyles(document.body);
	[...document.querySelectorAll("style")].filter(e => e.id != "userscriptcss").forEach(removeElement);
	[...document.querySelectorAll("link")]
		.filter(e => (e.getAttribute("rel") || "").toLowerCase() == "stylesheet")
		.forEach(removeElement);
	[...document.querySelectorAll("link")]
		.filter(e => (e.getAttribute("type") || "").toLowerCase() == "text/css")
		.forEach(removeElement);
	[...document.querySelectorAll("script")].forEach(removeElement);
})

let control = GM_xmlhttpRequest({
	url: "https://unpkg.com/awsm.css/dist/awsm.min.css",
	onload: (resp) => {
		console.log(resp.response)
		GM_addStyle(resp.response).id = "userscriptcss"
		GM_addStyle(`
			svg {
				display: none;
			}

			body {
				max-width: 80vw !important;
			}
		`).id = "userscriptcss"

		if (document.querySelector("main")) {
			GM_addStyle(`
				*:not(:has(main)):not(html, body, main, main *) {
					display: none;
				}
			`).id = "userscriptcss"
		}
	},
})
