import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router';
import Desktop from '~/components/Desktop';
import Monitor from '~/components/Monitor';
import Taskbar from '~/components/Taskbar';
import type { Route } from './+types/root';
import '~/assets/app.scss';

export const Layout = ({ children }: { children: React.ReactNode }) => (
	<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body>
			<Monitor>
				<Desktop>{children}</Desktop>
				<Taskbar />
			</Monitor>
			<ScrollRestoration />
			<Scripts />
		</body>
	</html>
);

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
};

const App = () => <Outlet />;
export default App;
