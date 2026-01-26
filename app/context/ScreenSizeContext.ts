import { createContext } from 'react';

export const ScreenSizeContext = createContext<{
	height: number;
	width: number;
}>({
	height: 0,
	width: 0,
});
