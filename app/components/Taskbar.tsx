import { useEffect, useState } from 'react';
import iconGithub from '~/assets/icons/github.png';
import iconLinkedIn from '~/assets/icons/linkedin.png';
import iconOutlook from '~/assets/icons/outlook.png';
import iconSpeaker from '~/assets/icons/speaker.png';
import StartMenu from '~/components/StartMenu';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '~/constants';
import styles from './Taskbar.module.scss';

const getFormattedCurrentTime = () =>
	new Intl.DateTimeFormat(undefined, {
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date());

const Divider: React.FC = () => <div className={styles.divider} />;

const Clock: React.FC = () => {
	const [time, setTime] = useState<string>(getFormattedCurrentTime());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(getFormattedCurrentTime());
		}, 1000);

		return () => clearInterval(interval);
	});

	return (
		<div className={styles.clock}>
			<img src={iconSpeaker} alt="" />
			{time}
		</div>
	);
};

const Taskbar = () => {
	return (
		<footer className={styles.taskbar}>
			<StartMenu />
			<Divider />
			<div className={styles.shortcuts}>
				<a href={`mailto:${EMAIL}`}>
					<img src={iconOutlook} alt="" className={styles.shortcutIcon} />
				</a>
				<a href={GITHUB_URL} target="_blank" rel="noreferrer">
					<img src={iconGithub} alt="" className={styles.shortcutIcon} />
				</a>
				<a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
					<img src={iconLinkedIn} alt="" className={styles.shortcutIcon} />
				</a>
			</div>
			<Divider />
			<div className={styles.tabs}></div>
			<Divider />
			<Clock />
		</footer>
	);
};
export default Taskbar;
