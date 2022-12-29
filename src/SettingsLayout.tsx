import { MenuTab, navStyles } from './MainLayout';
import { getHot } from './routes';
import styles from './styles/Settings.module.scss';
import Brush from '@mui/icons-material/Brush';
import BrushOutlined from '@mui/icons-material/BrushOutlined';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import DriveFileRenameOutlineOutlined from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import Public from '@mui/icons-material/Public';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsLayout = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation('link');

	return (
		<main className={styles.main}>
			<div className={clsx('menu', styles.menu)}>
				<div className={clsx(navStyles.menuList, styles.menuList)}>
					<MenuTab
						className={styles.entry}
						route={getHot('settings appearance').path}
						name={t('settingsAppearance')}
						iconClassName={styles.icon}
						iconFilled={<Brush />}
						iconOutlined={<BrushOutlined />}
					/>
					<MenuTab
						className={styles.entry}
						route={getHot('settings proxy').path}
						name={t('proxy')}
						iconClassName={styles.icon}
						iconFilled={<Public />}
					/>
					<MenuTab
						className={styles.entry}
						route={getHot('settings tabcloak').path}
						name={t('settingsTabMask')}
						iconClassName={styles.icon}
						iconFilled={<DriveFileRenameOutline />}
						iconOutlined={<DriveFileRenameOutlineOutlined />}
					/>
				</div>
			</div>
			{children}
		</main>
	);
};

export default SettingsLayout;
