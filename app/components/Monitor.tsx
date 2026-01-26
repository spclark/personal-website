import { useEffect, useRef, useState } from 'react';
import { ScreenSizeContext } from '~/context/ScreenSizeContext';
import styles from './Monitor.module.scss';

const Monitor = ({ children }: { children: React.ReactNode }) => {
	const screenRef = useRef<HTMLDivElement>(null);
	const [screenSize, setScreenSize] = useState<{
		height: number;
		width: number;
	}>({
		height: 0,
		width: 0,
	});

	useEffect(() => {
		if (!screenRef.current) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			setScreenSize({
				height: screenRef.current?.clientHeight || 0,
				width: screenRef.current?.clientWidth || 0,
			});
		});
		resizeObserver.observe(screenRef.current);

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className={styles.monitor}>
			<div className={styles.indent}>
				<div className={styles.screen} ref={screenRef}>
					<ScreenSizeContext
						value={{ height: screenSize.height, width: screenSize.width }}
					>
						{children}
					</ScreenSizeContext>
				</div>
			</div>
		</div>
	);
};
export default Monitor;
