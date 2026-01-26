import bin from '~/assets/icons/bin.png';
import network from '~/assets/icons/network.png';
import pc from '~/assets/icons/pc.png';
import resume from '~/assets/icons/resume.png';
import DesktopShortcut from '~/components/DesktopShortcut';
import styles from './Desktop.module.scss';

const Desktop = ({ children }: { children: React.ReactNode }) => (
	<main className={styles.desktop}>
		<DesktopShortcut iconSrc={pc} name="My Computer" />
		<DesktopShortcut iconSrc={bin} name="Recycle Bin" />
		<DesktopShortcut iconSrc={network} name="Network Neighborhood" />
		<DesktopShortcut
			href="steven_clark_resume.pdf"
			target="_blank"
			rel="noopener"
			iconSrc={resume}
			name="resume.pdf"
		/>
		{children}
	</main>
);
export default Desktop;
