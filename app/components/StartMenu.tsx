import { useContext, useEffect, useRef, useState } from 'react';
import iconGPS from '~/assets/icons/gps.png';
import iconInfo from '~/assets/icons/info.png';
import iconLogOff from '~/assets/icons/log-off.png';
import iconLogo from '~/assets/icons/logo.png';
import iconProjects from '~/assets/icons/projects.png';
import iconRoutes from '~/assets/icons/routes.png';
import iconSettings from '~/assets/icons/settings.png';
import iconShutDown from '~/assets/icons/shut-down.png';
import BezeledButton from '~/components/BezeledButton';
import { ROUTES } from '~/constants';
import { ScreenSizeContext } from '~/context/ScreenSizeContext';
import styles from './StartMenu.module.scss';

const StartMenuDivider: React.FC = () => (
	<li className="_display-contents">
		<div className={styles.startMenuDivider}></div>
	</li>
);

type StartMenuItemProps = {
	iconSrc: string;
	children?: React.ReactNode;
} & (
	| {
			href: string;
	  }
	| {
			onClick: () => void;
	  }
);
const StartMenuItem: React.FC<StartMenuItemProps> = ({
	iconSrc,
	children,
	...props
}) => (
	<li className="_display-contents">
		{props.href ? (
			<a href={props.href} className={styles.startMenuItem}>
				<div className={styles.iconWrapper}>
					<img src={iconSrc} alt="" className={styles.icon} />
				</div>
				{children}
			</a>
		) : (
			<button
				type="button"
				className={styles.startMenuItem}
				onClick={props.onClick}
			>
				<div className={styles.iconWrapper}>
					<img src={iconSrc} alt="" className={styles.icon} />
				</div>
				{children}
			</button>
		)}
	</li>
);

interface StartMenuDirectoryProps {
	children: React.ReactNode;
	iconSrc: string;
	title: React.ReactNode;
}
const StartMenuDirectory: React.FC<StartMenuDirectoryProps> = ({
	children,
	iconSrc,
	title,
}) => {
	const screenSizeContext = useContext(ScreenSizeContext);

	return (
		<li className={styles.startMenuDirectory}>
			<div className={styles.startMenuItem}>
				<div className={styles.iconWrapper}>
					<img src={iconSrc} alt="" className={styles.icon} />
				</div>
				{title}
			</div>
			<div
				className={styles.window}
				style={{
					maxWidth: screenSizeContext.width * 0.5,
				}}
			>
				<ul className={styles.menuOptions}>{children}</ul>
			</div>
		</li>
	);
};

const StartMenu: React.FC = () => {
	const screenSizeContext = useContext(ScreenSizeContext);

	const [isOpen, setIsOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const eventListener = (e: PointerEvent) => {
			if (!menuRef.current?.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};

		window.addEventListener('click', eventListener);

		return () => {
			window.removeEventListener('click', eventListener);
		};
	}, []);

	return (
		<div className={styles.startMenu} ref={menuRef}>
			<nav
				className={styles.window}
				style={{
					maxWidth: screenSizeContext.width * 0.5,
					maxHeight: screenSizeContext.height * 0.75,
				}}
				aria-hidden={!isOpen}
			>
				<h1 className={styles.gradient}>
					Steven<span className={styles.thin}>Clark</span>
				</h1>
				<ul className={styles.menuOptions}>
					<StartMenuItem href={ROUTES.ABOUT} iconSrc={iconInfo}>
						<span className={styles.underline}>A</span>bout
					</StartMenuItem>
					<StartMenuDivider />
					<StartMenuDirectory
						title={
							<>
								<span className={styles.underline}>P</span>rojects
							</>
						}
						iconSrc={iconProjects}
					>
						<StartMenuItem href={ROUTES.PROTEC} iconSrc={iconGPS}>
							Pro-Tec System One GPS Tracker
						</StartMenuItem>
						<StartMenuItem href={ROUTES.TRIPPED_UP} iconSrc={iconRoutes}>
							TrippedUp!
						</StartMenuItem>
					</StartMenuDirectory>
					<StartMenuDirectory
						title={
							<>
								<span className={styles.underline}>S</span>ettings
							</>
						}
						iconSrc={iconSettings}
					>
						<StartMenuItem href={ROUTES.TRIPPED_UP} iconSrc={iconRoutes}>
							TrippedUp!
						</StartMenuItem>
					</StartMenuDirectory>
					<StartMenuDivider />
					<StartMenuItem iconSrc={iconLogOff} onClick={() => window.close()}>
						<span className={styles.underline}>L</span>og Off Steven...
					</StartMenuItem>
					<StartMenuItem iconSrc={iconShutDown} onClick={() => window.close()}>
						Sh<span className={styles.underline}>u</span>t Down...
					</StartMenuItem>
				</ul>
			</nav>
			<BezeledButton onClick={() => setIsOpen(!isOpen)}>
				<div className={styles.startButton}>
					<img src={iconLogo} alt="" className={styles.icon} />
					Start
				</div>
			</BezeledButton>
		</div>
	);
};
export default StartMenu;
