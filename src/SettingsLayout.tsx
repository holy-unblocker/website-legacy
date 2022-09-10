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

const SettingsLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className={styles.main}>
			<div className={clsx('menu', styles.menu)}>
				<div className={clsx(navStyles.menuList, styles.menuList)}>
					<MenuTab
						className={styles.entry}
						route={getHot('settings search').path}
						name="Search"
						iconFilled={<Public />}
					/>
					<MenuTab
						className={styles.entry}
						route={getHot('settings appearance').path}
						name="Appearance"
						iconFilled={<Brush />}
						iconOutlined={<BrushOutlined />}
					/>
					<MenuTab
						className={styles.entry}
						route={getHot('settings tabcloak').path}
						name="Tab Cloak"
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
