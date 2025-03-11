/**
 * How it works:
 * Make Request to API of Feed-Roll and Paginate upto like 5-6 news,
 * use headless browser, puppetter and scrap data!
 * ask the LLM to summarize the feeds
 * and result to the user!
 */

export interface RSSFeed {
	title: string;
	publishedDate: string;
	name: string;
	link: string;
	content?: string;
}

// I've used https://github.com/mystica2000/feed-roll to retrieve the RSS Feeds from different blogs, run it locally to get the API running
// const API_CALL = "";
const PAGE_SIZE = 2; // from the latest posts, how many url to fetch and summarize result to!

export const newsAggregator = async (args: Record<string, unknown>) => {
	console.log("news");

	try {
		// const aResult = await fetch(API_CALL);
		// const aRes: RSSFeed[] = await aResult.json();
		const result = latestFeeds().sort(
			(a, b) =>
				new Date(b.publishedDate).getTime() -
				new Date(a.publishedDate).getTime(),
		);

		const latest = result.slice(0, PAGE_SIZE);
		return latest;
	} catch (error: unknown) {
		console.error("Error fetching news:", error);
		throw new Error("Failed to fetch news");
	}
};

// instead of calling API, hardcoded for easier testing
export const latestFeeds = (): RSSFeed[] => {
	return [
		{
			title: "How to take ownership of your work (and why you should)",
			publishedDate: "Thu, 06 Mar 2025 21:18:16 +0000",
			link: "https://www.atlassian.com/blog/productivity/how-to-take-ownership-of-your-work",
			name: "atlassian",
		},
		{
			title:
				"Desktop 4.39: Smarter AI Agent, Docker Desktop CLI in GA, and Effortless Multi-Platform Builds",
			publishedDate: "Thu, 06 Mar 2025 18:29:59 +0000",
			link: "https://www.docker.com/blog/docker-desktop-4-39/",
			name: "docker",
		},
		{
			title:
				"Scale and deliver game streaming experiences with Amazon GameLift Streams",
			publishedDate: "Thu, 06 Mar 2025 17:03:02 +0000",
			link: "https://aws.amazon.com/blogs/aws/scale-and-deliver-game-streaming-experiences-with-amazon-gamelift-streams/",
			name: "aws",
		},
		{
			title:
				"Request for developer feedback: controlling the performance of embedded web content",
			publishedDate: "Thu, 06 Mar 2025 17:00:26 +0000",
			link: "https://blogs.windows.com/msedgedev/2025/03/06/request-for-feedback-controlling-performance-of-embedded-content/",
			name: "edge",
		},
		{
			title: "Build, Launch, and Grow with Auth0",
			publishedDate: "Thu, 06 Mar 2025 15:56:00 GMT",
			link: "https://auth0.com/blog/build-launch-and-grow-with-auth0/",
			name: "auth0",
		},
		{
			title: "Stop Exposing Secrets! Secure Your APIs in Postman Like a Pro",
			publishedDate: "Thu, 06 Mar 2025 11:42:44 GMT",
			link: "https://medium.com/better-practices/stop-exposing-secrets-secure-your-apis-in-postman-like-a-pro-cbd6f978aaa8?source=rss----410f2fbc015d---4",
			name: "postman",
		},
		{
			title: "How can AI perform on the edge?",
			publishedDate: "Wed, 05 Mar 2025 05:44:00 GMT",
			link: "https://stackoverflow.blog/2025/03/05/how-can-ai-perform-on-the-edge/",
			name: "stackoverflow",
		},
	];
};
