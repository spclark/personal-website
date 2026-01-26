import { Outlet } from 'react-router';

export const meta = () => [
	{ title: 'Steven Clark' },
	{ name: 'description', content: "Steven Clark's personal website" },
	{
		name: 'keywords',
		content: 'Steven, Clark, web, developer, programmer, portfolio',
	},
];

const Home: React.FC = () => <Outlet />;
export default Home;
