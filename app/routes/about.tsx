import Window from '~/components/Window';
import { EMAIL, LINKEDIN_URL } from '~/constants';

const About: React.FC = () => (
	<Window title="About">
		<p>Hi, I'm Steven. Thanks for visiting my site!</p>
		<br />
		<p>
			I'm a full-stack web developer living in New York City. I'm interested in
			design systems, 3D visuals on the web, and net art. When I'm not coding,
			you can find me running around Central Park, visiting a museum, or picking
			up a new find from Facebook Marketplace.
		</p>
		<br />
		<p>
			Feel free to{' '}
			<a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
				connect with me on LinkedIn
			</a>{' '}
			or <a href={`mailto:${EMAIL}`}>send me an email</a> if you'd like to chat!
		</p>
	</Window>
);
export default About;
