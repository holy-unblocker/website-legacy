export interface Category {
	id: string;
	name: string;
	short?: string;
}

const categories: Category[] = [
	{
		id: 'action',
		short: 'Action',
		name: 'Action & Adventure',
	},
	{
		id: 'platformer',
		name: 'Platformer',
	},
	{
		id: 'shooter',
		short: 'Shooters',
		name: 'Shooters & Strategy',
	},
	{
		id: 'rpg',
		name: 'RPG',
	},
	{
		id: 'sandbox',
		name: 'Sandbox',
	},
	{
		id: 'survival',
		short: 'Survival',
		name: 'Survival & Horror',
	},
	{
		id: 'sports',
		short: 'Sports',
		name: 'Simulation & Sports',
	},
	{
		id: 'puzzle',
		name: 'Puzzle',
	},
];

export default categories;
