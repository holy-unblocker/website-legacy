import DatabaseAPI from './DatabaseAPI';
import { THEATRE_CDN } from './consts';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/TheatreCategory.module.scss';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * one of the above types or a letter/key such as A,B,TAB,SPACE,SHIFT
 */
export type KeyLike =
	| 'mouseleft'
	| 'mouseright'
	| 'scrollup'
	| 'scrolldown'
	| 'wasd'
	| 'arrows'
	| string;

export interface Control {
	keys: KeyLike[];
	label: string;
}

export interface TheatreEntry {
	type:
		| 'emulator.nes'
		| 'emulator.gba'
		| 'emulator.genesis'
		| 'flash'
		| 'embed'
		| 'proxy'
		| string;
	controls: Control[];
	category: string[];
	id: string;
	name: string;
	plays: number;
	src: string;
}

export interface LoadingTheatreEntry {
	id: string;
	loading: true;
	category: string[];
}

export interface CategoryData {
	total: number;
	entries: TheatreEntry[];
}

export interface LoadingCategoryData {
	total: number;
	entries: (TheatreEntry | LoadingTheatreEntry)[];
	loading: true;
}

export interface TheatreEntry {
	type:
		| 'emulator.nes'
		| 'emulator.gba'
		| 'emulator.genesis'
		| 'flash'
		| 'embed'
		| 'proxy'
		| string;
	controls: Control[];
	category: string[];
	id: string;
	name: string;
	plays: number;
	src: string;
}
export function isLoading(
	data: CategoryData | LoadingCategoryData
): data is LoadingCategoryData;

export function isLoading(
	data: TheatreEntry | LoadingTheatreEntry
): data is LoadingTheatreEntry;

export function isLoading(
	data: TheatreEntry | LoadingTheatreEntry | CategoryData | LoadingCategoryData
): data is LoadingTheatreEntry | LoadingCategoryData {
	return 'loading' in data && data.loading === true;
}

export class TheatreAPI extends DatabaseAPI {
	async show(id: String) {
		return await this.fetch<TheatreEntry>(`./theatre/${id}/`);
	}
	async plays(id: string) {
		return await this.fetch<TheatreEntry>(`./theatre/${id}/plays`, {
			method: 'PUT',
		});
	}
	async category(params: {
		leastGreatest?: boolean;
		sort?: string;
		category?: string;
		search?: string;
		offset?: number;
		limit?: number;
		limitPerCategory?: number;
	}) {
		return await this.fetch<CategoryData>(
			'./theatre/?' + new URLSearchParams(this.sortParams(params))
		);
	}
}

export function Item({ id, name }: { id: string; name: string }) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Link
			className={styles.item}
			to={`${getHot('theatre player').path}?id=${id}`}
		>
			<div className={styles.thumbnail} data-loaded={Number(loaded)}>
				<img
					alt=""
					loading="lazy"
					onLoad={() => setLoaded(true)}
					src={new URL(`./thumbnails/${id}.webp`, THEATRE_CDN).toString()}
				></img>
			</div>
			<div className={styles.name}>
				<Obfuscated ellipsis>{name}</Obfuscated>
			</div>
		</Link>
	);
}

export function LoadingItem() {
	return (
		<div className={clsx(styles.item, styles.loading)}>
			<div className={styles.thumbnail} />
			<div className={styles.name} />
		</div>
	);
}

export function ItemList({
	items,
	...attributes
}: JSX.IntrinsicElements['div'] & {
	items: (TheatreEntry | LoadingTheatreEntry)[];
}) {
	const children = [];

	for (const item of items) {
		if (isLoading(item)) {
			children.push(<LoadingItem key={item.id} />);
		} else {
			children.push(<Item key={item.id} id={item.id} name={item.name} />);
		}
	}

	return <div {...attributes}>{children}</div>;
}
