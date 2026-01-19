import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import iconFullscreen from '~/assets/icons/fullscreen.png';
import iconMinimize from '~/assets/icons/minimize.png';
import iconX from '~/assets/icons/x.png';
import BezeledButton from '~/components/BezeledButton';
import { ROUTES } from '~/constants';
import { ScreenSizeContext } from '~/context/ScreenSizeContext';
import styles from './Window.module.scss';

interface Props {
	title: string;
	children?: React.ReactNode;
	fill?: 'solid' | 'inset';
}
const Window: React.FC<Props> = ({ title, children, fill = 'inset' }) => {
	const screenSizeContext = useContext(ScreenSizeContext);

	// By default, position the window at the center of the screen.
	const [position, setPosition] = useState({
		x: Math.floor(screenSizeContext.width / 2),
		y: Math.floor(screenSizeContext.height / 2),
	});
	const [isOpen, setIsOpen] = useState(true);
	const [isDragging, setIsDragging] = useState(false);

	const windowRef = useRef<HTMLElement>(null);
	const mousePrevPositionRef = useRef<{ x: number; y: number } | null>(null);

	const navigate = useNavigate();

	const handleMouseDown = (e: React.MouseEvent) => {
		// Ignore any mouse button besides the main (left) mouse button.
		if (e.button !== 0) {
			return;
		}

		const target = e.target as HTMLElement;
		if (target.closest('button')) {
			return;
		}

		mousePrevPositionRef.current = { x: e.clientX, y: e.clientY };
		setIsDragging(true);
	};

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!windowRef.current || !mousePrevPositionRef.current) {
			return;
		}

		const deltaX = mousePrevPositionRef.current.x - e.clientX;
		const deltaY = mousePrevPositionRef.current.y - e.clientY;
		setPosition((prev) => ({
			x: Math.max(prev.x - deltaX, 0),
			y: Math.max(prev.y - deltaY, 0),
		}));

		mousePrevPositionRef.current = { x: e.clientX, y: e.clientY };
	}, []);

	const handleMouseUp = useCallback(() => {
		mousePrevPositionRef.current = null;
		setIsDragging(false);
	}, []);

	// Add and remove event listeners when dragging and dropping, respectively.
	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// Ensure that resizing does not place the window out of bounds.
	useEffect(() => {
		if (!windowRef.current) {
			return;
		}

		const { height, width } = windowRef.current.getBoundingClientRect();
		if (position.x + width > screenSizeContext.width) {
			setPosition(({ y }) => ({
				x: Math.min(screenSizeContext.width - width, 0),
				y,
			}));
		}
		if (position.y + height > screenSizeContext.height) {
			setPosition(({ x }) => ({
				x,
				y: Math.min(screenSizeContext.height - height, 0),
			}));
		}
	}, [position, screenSizeContext]);

	return (
		<section
			ref={windowRef}
			className={styles.window}
			aria-hidden={!isOpen}
			style={{
				top: position.y,
				left: position.x,
				cursor: isDragging ? 'grabbing' : 'default',
			}}
		>
			<div
				className={styles.titleBar}
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
				role="button"
				tabIndex={0}
				onMouseDown={handleMouseDown}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
					}
				}}
			>
				<h2 className={styles.windowTitle}>{title}</h2>
				<BezeledButton
					aria-label="Minimize window"
					onClick={() => setIsOpen(false)}
					disabled
				>
					<img src={iconMinimize} alt="" className={styles.buttonIcon} />
				</BezeledButton>
				<BezeledButton aria-label="Maximize window" disabled>
					<img src={iconFullscreen} alt="" className={styles.buttonIcon} />
				</BezeledButton>
				<BezeledButton
					aria-label="Close window"
					onClick={() => navigate(ROUTES.HOME)}
				>
					<img src={iconX} alt="" className={styles.buttonIcon} />
				</BezeledButton>
			</div>
			<div className={`${styles.content} ${styles[fill]}`}>{children}</div>
		</section>
	);
};
export default Window;
