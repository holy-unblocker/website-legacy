import { ObfuscatedA } from './obfuscate';
import type { ObfuscatedAProps } from './obfuscate';
import styles from './styles/ThemeElements.module.scss';
import ExpandMore from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import { useRef, forwardRef, useState } from 'react';
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
			className={clsx(styles.ThemeButton, className)}
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
		<div className={clsx(styles.ThemeInputBar, className)} {...attributes}>
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
			className={clsx(styles.ThemeInput, className)}
			{...attributes}
		>
			{children}
		</input>
	);
});

// <select ref={dummy_ref} forwardRef={ref}>

interface Option {
	name: string;
	value: string;
	disabled: boolean;
}

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
	const input = useRef<HTMLInputElement | null>(null);
	const container = useRef<HTMLDivElement | null>(null);
	const [lastSelect, setLastSelect] = useState(-1);
	const [open, setOpen] = useState(false);

	const options: Option[] = [];
	const availableOptions: number[] = [];

	let defaultSelected = 0;

	const c = children ? (Array.isArray(children) ? children : [children]) : [];

	for (const child of c) {
		if (child.type !== 'option') continue;

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

	const [selected, setSelected] = useState(defaultSelected);

	function setSelectedCB(value: number) {
		setSelected(value);
		setOpen(false);

		const i = input.current;

		if (!i) return;

		i.value = options[value]?.value || '';
		if (onChange) onChange({ target: i });
	}

	return (
		<div
			{...attributes}
			tabIndex={0}
			className={clsx(styles.ThemeSelect, className)}
			data-open={Number(open)}
			ref={container}
			onKeyDown={(event) => {
				let preventDefault = true;

				switch (event.code) {
					case 'ArrowDown':
					case 'ArrowUp':
						{
							const lastI = lastSelect;
							const lastIAvailable = availableOptions.indexOf(
								[...availableOptions].sort(
									(a, b) => Math.abs(a - lastI) - Math.abs(b - lastI),
								)[0],
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

							if (!open) setSelectedCB(nextI);
						}
						break;
					case 'Enter':
						if (open) setSelectedCB(lastSelect);
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
			<input ref={input} readOnly hidden />
			<div
				className={styles.toggle}
				onClick={() => {
					setOpen(!open);
					setLastSelect(selected);
					container.current?.focus();
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
				{options.map((option, i) => (
					<div
						className={clsx(
							styles.plainOption,
							i === lastSelect && styles.hover,
							option.disabled && styles.disabled,
						)}
						key={i}
						onClick={() => {
							if (!option.disabled) {
								setSelectedCB(i);
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
				))}
			</div>
		</div>
	);
}

export { styles as themeStyles };
