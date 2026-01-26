import { type RouteConfig, route } from '@react-router/dev/routes';
import { ROUTES } from './constants';

export default [
	route(ROUTES.HOME, 'routes/home.tsx', [
		route(ROUTES.ABOUT, 'routes/about.tsx'),
		route(ROUTES.PERSONAL_WEBSITE, 'routes/projects/personal-website.tsx'),
		route(ROUTES.PROTEC, 'routes/projects/protec.tsx'),
		route(ROUTES.TRIPPED_UP, 'routes/projects/tripped-up.tsx'),
		route('*', 'routes/not-found.tsx'),
	]),
] satisfies RouteConfig;
