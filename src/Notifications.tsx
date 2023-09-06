import { Obfuscated } from './obfuscate';
import styles from './styles/Notifications.module.scss';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import type SvgIcon from '@mui/material/SvgIcon';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const ANIMATION = 0.3e3;

interface NotificationData {
	title?: ReactNode;
	description?: ReactNode;
	type?: 'warning' | 'error' | 'success' | 'info';
	duration?: number;
}

interface NotificationProps {
	data: NotificationData;
	close: () => void;
}

function Notification({ data, close }: NotificationProps) {
	const [hide, setHide] = useState(false);
	const duration = data.duration || 5e3;

	useEffect(() => {
		const timeout = setTimeout(() => {
			setHide(true);
			setTimeout(close, ANIMATION);
		}, duration);

		return () => clearTimeout(timeout);
	}, [close, duration]);

	let Icon: typeof SvgIcon;
	const type = data.type || 'info';

	switch (data.type) {
		case 'warning':
			Icon = Warning;
			break;
		case 'error':
			Icon = ErrorIcon;
			break;
		case 'success':
			Icon = CheckCircle;
			break;
		case 'info':
			Icon = Info;
			break;
		default:
			throw new Error('Invalid type');
	}

	return (
		<div
			className={clsx(
				styles.notification,
				hide && styles.hide,
				data.title && styles.title,
			)}
		>
			<Icon className={clsx(styles.icon, styles[type])} />
			<div className={styles.content}>
				{data.title && (
					<div className={styles.title}>
						<Obfuscated>{data.title}</Obfuscated>
					</div>
				)}
				{data.description && (
					<div className={styles.description}>
						<Obfuscated>{data.description}</Obfuscated>
					</div>
				)}
			</div>
			<div
				className={styles.timer}
				style={{ animationDuration: `${duration / 1000}s` }}
			/>
		</div>
	);
}

export type NotificationsManagerRef = (notification: NotificationData) => void;

const NotificationsManager = forwardRef<NotificationsManagerRef>(
	function NotificationsManager(_props, ref) {
		const [notifications, setNotifications] = useState<NotificationData[]>([]);

		useImperativeHandle(
			ref,
			() => (notification: NotificationData) => {
				setNotifications([...notifications, notification]);
			},
			[notifications],
		);

		return (
			<div className={styles.notifications}>
				{notifications.map((data, i) => (
					<Notification
						data={data}
						close={() => {
							const newNotifications = [...notifications];
							const i = newNotifications.indexOf(data);
							if (i !== -1) newNotifications.splice(i, 1);
							setNotifications(newNotifications);
						}}
						key={i}
					/>
				))}
			</div>
		);
	},
);

export default NotificationsManager;
