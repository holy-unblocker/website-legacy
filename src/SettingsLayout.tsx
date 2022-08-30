import type { HolyPage } from './App';
import { MenuTab, navStyles } from './MainLayout';
import resolveRoute from './resolveRoute';
import styles from './styles/Settings.module.scss';
import Brush from '@mui/icons-material/Brush';
import BrushOutlined from '@mui/icons-material/BrushOutlined';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import DriveFileRenameOutlineOutlined from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import Public from '@mui/icons-material/Public';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';

const SettingsLayout: HolyPage = () => {
	return (
		<>
			<main className={styles.main}>
				<div className={clsx('menu', styles.menu)}>
					<div className={clsx(navStyles.menuList, styles.menuList)}>
						<MenuTab
							className={styles.entry}
							route={resolveRoute('/settings/', 'search')}
							name="Search"
							iconFilled={<Public />}
						/>
						<MenuTab
							className={styles.entry}
							route={resolveRoute('/settings/', 'appearance')}
							name="Appearance"
							iconFilled={<Brush />}
							iconOutlined={<BrushOutlined />}
						/>
						<MenuTab
							className={styles.entry}
							route={resolveRoute('/settings/', 'tabcloak')}
							name="Tab Cloak"
							iconFilled={<DriveFileRenameOutline />}
							iconOutlined={<DriveFileRenameOutlineOutlined />}
						/>
					</div>
				</div>
				<Outlet />
			</main>
		</>
	);
};

export default SettingsLayout;
