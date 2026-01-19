import styles from './DesktopShortcut.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	iconSrc: string;
	name: string;
}
const DesktopShortcut: React.FC<Props> = ({
	iconSrc,
	name,
	href = '',
	...props
}) => {
	return href.length ? (
		<a href={href} {...props} className={styles.desktopShortcut}>
			<img src={iconSrc} alt="" className={styles.icon} />
			{name}
		</a>
	) : (
		<div className={styles.desktopShortcut}>
			<img src={iconSrc} alt="" className={styles.icon} />
			{name}
		</div>
	);
};
export default DesktopShortcut;
