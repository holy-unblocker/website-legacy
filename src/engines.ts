export interface Engine {
	name: string;
	format: string;
}

const engines: Engine[] = [
	{
		name: 'Google',
		format: 'https://www.google.com/search?q=%s',
	},
	{
		name: 'DuckDuckGo',
		format: 'https://duckduckgo.com/?q=%s',
	},
	{
		name: 'Bing',
		format: 'https://www.bing.com/search?q=%s',
	},
	{
		name: 'Wikipedia',
		format: 'https://en.wikipedia.org/wiki/Special:Search?search=%s',
	},
	{
		name: 'Reddit',
		format: 'https://www.reddit.com/search/?q=%s',
	},
	{
		name: 'Hacker News',
		format: 'https://hn.algolia.com/?query=%s',
	},
];

export default engines;
