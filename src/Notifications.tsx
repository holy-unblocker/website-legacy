import { Obfuscated } from './obfuscate';
import styles from './styles/Notifications.module.scss';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import type SvgIcon from '@mui/material/SvgIcon';
import clsx from 'clsx';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const ANIMATION = 0.3e3;

interface NotificationStubProps {
	title?: ReactNode;
	description?: ReactNode;
	type?: 'warning' | 'error' | 'success' | 'info';
	duration?: number;
}

interface RealNotificationProps extends NotificationStubProps {
	manager: RefObject<NotificationsManagerRef>;
	id: string;
}

function RealNotification({
	id,
	title,
	description,
	manager,
	duration,
	type,
}: RealNotificationProps) {
	const [hide, setHide] = useState(false);

	duration ||= 5e3;

	useEffect(() => {
		setTimeout(() => {
			setHide(true);
			setTimeout(() => {
				if (!manager.current) return;
				manager.current.delete(id);
			}, ANIMATION);
		}, duration);
	}, [duration, id, manager]);

	let Icon: typeof SvgIcon;

	switch (type) {
		case 'warning':
			Icon = Warning;
			break;
		case 'error':
			Icon = ErrorIcon;
			break;
		case 'success':
			Icon = CheckCircle;
			break;
		default:
		case 'info':
			type = 'info';
			Icon = Info;
			break;
	}

	return (
		<div
			className={clsx(
				styles.notification,
				hide && styles.hide,
				title && styles.title
			)}
		>
			<Icon className={clsx(styles.icon, styles[type])} />
			<div className={styles.content}>
				{title && (
					<div className={styles.title}>
						<Obfuscated>{title}</Obfuscated>
					</div>
				)}
				{description && (
					<div className={styles.description}>
						<Obfuscated>{description}</Obfuscated>
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

export function Notification(props: NotificationStubProps): JSX.Element {
	throw new Error(
		'<Notifications> is an abstract component, it should never be rendered.'
	);
}

export interface NotificationsManagerRef {
	add: (notification: ReactElement<Notification>) => void;
	delete: (id: string) => void;
}

const NotificationsManager = forwardRef<NotificationsManagerRef>(
	function NotificationsManager(props, ref) {
		const [notifications, setNotifications] = useState<
			ReactElement<RealNotificationProps>[]
		>([]);

		useImperativeHandle(
			ref,
			() => ({
				add: (notification: ReactElement<Notification>) => {
					const id = Math.random().toString(36);
					const _notifications = [...notifications];

					_notifications.push(
						<RealNotification
							{...notification.props}
							key={id}
							id={id}
							manager={ref as RefObject<NotificationsManagerRef>}
						/>
					);

					setNotifications(_notifications);
				},
				delete: (id: string) => {
					const _notifications = [...notifications];

					for (let i = 0; i < _notifications.length; i++) {
						const notification = _notifications[i];

						if (notification.props.id !== id) continue;

						_notifications.splice(i, 1);
						setNotifications(_notifications);

						return true;
					}

					return false;
				},
			}),
			[notifications, ref]
		);

		return <div className={styles.notifications}>{notifications}</div>;
	}
);

export default NotificationsManager;
