import { ObfuscatedA } from './obfuscate';
import type { ObfuscatedAProps } from './obfuscate';
import styles from './styles/ThemeElements.module.scss';
import ExpandMore from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import { forwardRef, useState } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function ThemeButton({
	children,
	className,
	...attributes
}: JSX.IntrinsicElements['button'] & {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<button
			type="button"
			className={clsx(styles.themeButton, className)}
			{...attributes}
		>
			{children}
		</button>
	);
}

export function ThemeInputBar({
	children,
	className,
	...attributes
}: JSX.IntrinsicElements['div'] & {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx(styles.themeInputBar, className)} {...attributes}>
			{children}
		</div>
	);
}

export function ObfuscatedThemeA({
	children,
	className,
	...attributes
}: ObfuscatedAProps & { className?: string; children?: ReactNode }) {
	return (
		<ObfuscatedA className={clsx(styles.themeLink, className)} {...attributes}>
			{children}
		</ObfuscatedA>
	);
}

export function ThemeA({
	children,
	className,
	...attributes
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
	className?: string;
	children?: ReactNode;
}) {
	return (
		<a className={clsx(styles.themeLink, className)} {...attributes}>
			{children}
		</a>
	);
}

export function ThemeLink({
	children,
	className,
	...attributes
}: LinkProps & { className?: string; children?: ReactNode }) {
	return (
		<Link className={clsx(styles.themeLink, className)} {...attributes}>
			{children}
		</Link>
	);
}

export const ThemeInput = forwardRef<
	HTMLInputElement,
	JSX.IntrinsicElements['input'] & { className?: string; children?: ReactNode }
>(function ThemeInput({ children, className, ...attributes }, ref) {
	return (
		<input
			ref={ref}
			className={clsx(styles.themeInput, className)}
			{...attributes}
		>
			{children}
		</input>
	);
});

// <select ref={dummy_ref} forwardRef={ref}>

export function ThemeSelect({
	className,
	onChange,
	children,
	value,
	defaultValue,
	...attributes
}: Omit<JSX.IntrinsicElements['div'], 'onChange'> & {
	children?:
		| ReactElement<JSX.IntrinsicElements['option']>
		| ReactElement<JSX.IntrinsicElements['option']>[];
	className?: string;
	onChange?: (mockEvent: { target: HTMLInputElement }) => void;
	value?: string;
	defaultValue?: string;
}) {
	// ref target
	const [input, setInput] = useState<HTMLInputElement | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [lastSelect, setLastSelect] = useState(-1);
	const [open, setOpen] = useState(false);

	const list = [];

	interface Option {
		name: string;
		value: string;
		disabled: boolean;
	}

	const options: Option[] = [];
	const availableOptions: number[] = [];

	let defaultSelected = 0;

	if (!children) children = [];
	else if (!Array.isArray(children)) children = [children];

	for (const child of children) {
		if (child.type === 'option') {
			const option: Option = {
				name: child.props.children as string,
				value: child.props.value as string,
				disabled: child.props.disabled === true,
			};

			if (option.value === (value || defaultValue)) {
				defaultSelected = options.length;
			}

			if (!option.disabled) {
				availableOptions.push(options.length);
			}

			options.push(option);
		}
	}

	const [selected, _setSelected] = useState(defaultSelected);

	function setSelected(value: number) {
		_setSelected(value);
		setOpen(false);

		if (onChange) setTimeout(() => onChange({ target: input! }));
	}

	for (let i = 0; i < options.length; i++) {
		const option = options[i];

		list.push(
			<div
				className={clsx(
					styles.plainOption,
					i === lastSelect && styles.hover,
					option.disabled && styles.disabled
				)}
				key={i}
				onClick={() => {
					if (!option.disabled) {
						setSelected(i);
					}
				}}
				onMouseOver={() => {
					if (!option.disabled) {
						setLastSelect(i);
					}
				}}
			>
				{option.name}
			</div>
		);
	}

	return (
		<div
			{...attributes}
			tabIndex={0}
			className={clsx(styles.themeSelect, className)}
			data-open={Number(open)}
			ref={setContainer}
			onKeyDown={(event) => {
				let preventDefault = true;

				switch (event.code) {
					case 'ArrowDown':
					case 'ArrowUp':
						{
							const lastI = lastSelect;
							const lastIAvailable = availableOptions.indexOf(
								[...availableOptions].sort(
									(a, b) => Math.abs(a - lastI) - Math.abs(b - lastI)
								)[0]
							);

							let next;

							switch (event.code) {
								case 'ArrowDown':
									if (lastIAvailable === availableOptions.length - 1) {
										next = 0;
									} else {
										next = lastIAvailable + 1;
										if (options[lastI].disabled) {
											next--;
										}
									}
									break;
								case 'ArrowUp':
									if (lastIAvailable === 0) {
										next = availableOptions.length - 1;
									} else {
										next = lastIAvailable - 1;
										if (options[lastI].disabled) {
											next--;
										}
									}
									break;
								// no default
							}

							const nextI = availableOptions[next];

							setLastSelect(nextI);

							if (!open) setSelected(nextI);
						}
						break;
					case 'Enter':
						if (open) setSelected(lastSelect);
						else setOpen(true);
						break;
					case 'Space':
						setOpen(true);
						break;
					default:
						preventDefault = false;
						break;
					// no default
				}

				if (preventDefault) {
					event.preventDefault();
				}
			}}
			onBlur={(event) => {
				if (!event.target.contains(event.relatedTarget)) setOpen(false);
			}}
		>
			<input ref={setInput} value={options[selected]?.value} readOnly hidden />
			<div
				className={styles.toggle}
				onClick={() => {
					setOpen(!open);
					setLastSelect(selected);
					container!.focus();
				}}
			>
				{options[selected]?.name}
				<ExpandMore />
			</div>
			<div
				className={styles.list}
				onMouseLeave={() => {
					setLastSelect(-1);
				}}
			>
				{list}
			</div>
		</div>
	);
}

export { styles as themeStyles };
