import styles from './BezeledButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
}
const BezeledButton: React.FC<Props> = ({
	children,
	type = 'button',
	...props
}) => (
	<button type={type} className={styles.bezeledButton} {...props}>
		<div className={styles.innerBorder}>{children}</div>
	</button>
);
export default BezeledButton;
