import Window from '~/components/Window';

const TrippedUp = () => (
	<Window title="TrippedUp!">
		<p>
			A project that arose from a desire to learn about web APIs. Given two
			locations and a mode of transport, the site calculates the distance and
			travel time between them. If you've ever wondered how long in dog years it
			would take you to commute to work by pogo stick, this is the website for
			you!
		</p>
		<br />
		<p>
			You can visit the site{' '}
			<a
				href="https://trippedup.stevenclark.xyz"
				target="_blank"
				rel="noopener"
			>
				here
			</a>{' '}
			or view the GitHub repository{' '}
			<a
				href="https://github.com/spclark/trippedup"
				target="_blank"
				rel="noreferrer"
			>
				here
			</a>
			.
		</p>
	</Window>
);
export default TrippedUp;
