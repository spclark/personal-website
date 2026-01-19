import { redirect } from 'react-router';
import iconError from '~/assets/icons/error.png';
import BezeledButton from '~/components/BezeledButton';
import Window from '~/components/Window';
import { ROUTES } from '~/constants';
import styles from './not-found.module.scss';

const NotFound: React.FC = () => (
	<Window title="Error" fill="solid">
		<div className={styles.contentWrapper}>
			<div className={styles.errorMessage}>
				<img src={iconError} alt="error" />
				<p>The page you are looking for doesn't exist.</p>
			</div>
			<BezeledButton onClick={() => redirect(ROUTES.HOME)}>
				<span className={styles.button}>OK</span>
			</BezeledButton>
		</div>
	</Window>
);
export default NotFound;
