import puppeteer from "puppeteer";
import type { RSSFeed } from "../tools/newsAggregator";
import { htmlToText } from "html-to-text";

export async function fetchContentWithPuppeteer(url: string) {
	const browser = await puppeteer.launch({
		headless: true,
	});

	try {
		const page = await browser.newPage();

		await page.setViewport({ width: 1280, height: 800 });

		await page.goto(url, {
			waitUntil: "domcontentloaded",
			timeout: 30000,
		});

		const skipLinkSelectors = [
			'a[href="#main"]',
			'a[href="#content"]',
			'a[href="#mainContent"]',
			'a[href="#main-content"]',
			"a.skip-link",
			"a.skip-to-content",
			"a.skip-main",
			"div#main-content",
			'a[href*="main"]:not([href*="http"])',
			'a[href="#aws-page-skip-to-main"]',
		];

		let mainContentSelector = null;

		for (const selector of skipLinkSelectors) {
			console.log("checking!!", selector);
			const skipLink = await page.$(selector);
			if (skipLink) {
				console.log("checking!! skipLink", skipLink);

				const hrefProperty = await skipLink.getProperty("href");
				const href = await hrefProperty.jsonValue();

				if (href && typeof href === "string") {
					// Extract the anchor part of the URL
					const anchor = href.split("#")[1];
					if (anchor) {
						mainContentSelector = `#${anchor}`;
						console.log(
							`\n Found skip link pointing to: ${mainContentSelector}`,
						);
						break;
					}
				}
			}
		}

		let content = "";
		if (mainContentSelector) {
			const mainElement = await page.$(mainContentSelector);
			if (mainElement) {
				content = await page.evaluate((el) => el.innerHTML, mainElement);
			}
		} else {
			// Fallback: try common main selectors!!
			const fallbackSelectors = [
				"main",
				"article",
				"#content",
				"#main",
				".content",
				".main-content",
				"#main-content",
			];
			for (const selector of fallbackSelectors) {
				const element = await page.$(selector);
				if (element) {
					content = await page.evaluate((el) => el.innerHTML, element);
					console.log(
						`No skip link found, but found content using selector: ${selector}`,
					);
					break;
				}
			}
		}

		await browser.close();

		if (content) {
			const plainText = htmlToText(content, {
				selectors: [
					{ selector: "img", format: "skip" },
					{ selector: "a", options: { ignoreHref: true } },
				],
			});
			console.log(plainText.slice(0, 250));
			return plainText;
		}
	} finally {
		await browser.close();
	}
}

export const fetchArticleContent = async (feed: RSSFeed) => {
	try {
		console.log(`\n ⏳ Fetching content for: ${feed.title}`);
		const content = await fetchContentWithPuppeteer(feed.link);

		return {
			...feed,
			content,
		};
	} catch (err: unknown) {
		console.error(`Error fetching content for ${feed.title}`);
		return null;
	}
};
