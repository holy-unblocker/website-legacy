import type { HolyPage } from '../../App';
import Meta from '../../Meta';
import TheatreCategory from '../../TheatreCategory';
import { useTranslation } from 'react-i18next';

const AllAppsMeta = () => (
	<Meta title="Apps" description="Find apps on Holy Unblocker." />
);

const AllApps: HolyPage = (props) => {
	const { t } = useTranslation('theatre');

	return (
		<>
			<AllAppsMeta />
			<TheatreCategory
				{...props}
				name={t('apps')}
				key="apps"
				category="app"
				placeholder={t('searchByApp')}
			/>
		</>
	);
};

export default AllApps;
