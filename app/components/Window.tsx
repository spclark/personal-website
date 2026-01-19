import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import iconFullscreen from '~/assets/icons/fullscreen.png';
import iconMinimize from '~/assets/icons/minimize.png';
import iconX from '~/assets/icons/x.png';
import BezeledButton from '~/components/BezeledButton';
import { ROUTES } from '~/constants';
import { ScreenSizeContext } from '~/context/ScreenSizeContext';
import styles from './Window.module.scss';

const KEYBOARD_MOVE_STEP = 20;

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
	const pointerPrevPositionRef = useRef<{ x: number; y: number } | null>(null);

	const navigate = useNavigate();

	const clampPosition = useCallback(
		(x: number, y: number) => {
			if (!windowRef.current) {
				return { x, y };
			}
			const { width, height } = windowRef.current.getBoundingClientRect();
			return {
				x: Math.max(0, Math.min(x, screenSizeContext.width - width)),
				y: Math.max(0, Math.min(y, screenSizeContext.height - height)),
			};
		},
		[screenSizeContext.width, screenSizeContext.height],
	);

	const handlePointerDown = (e: React.PointerEvent) => {
		// Ignore any mouse button besides the main (left) mouse button.
		if (e.pointerType === 'mouse' && e.button !== 0) {
			return;
		}

		const target = e.target as HTMLElement;
		if (target.closest('button')) {
			return;
		}

		pointerPrevPositionRef.current = { x: e.clientX, y: e.clientY };
		setIsDragging(true);
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!windowRef.current || !pointerPrevPositionRef.current) {
				return;
			}

			const deltaX = pointerPrevPositionRef.current.x - e.clientX;
			const deltaY = pointerPrevPositionRef.current.y - e.clientY;

			setPosition((prev) => clampPosition(prev.x - deltaX, prev.y - deltaY));

			pointerPrevPositionRef.current = { x: e.clientX, y: e.clientY };
		},
		[clampPosition],
	);

	const handlePointerUp = useCallback((e: React.PointerEvent) => {
		pointerPrevPositionRef.current = null;
		setIsDragging(false);
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest('button')) {
			return;
		}

		let deltaX = 0;
		let deltaY = 0;
		const step = e.shiftKey ? KEYBOARD_MOVE_STEP * 3 : KEYBOARD_MOVE_STEP;

		switch (e.key) {
			case 'ArrowUp':
				deltaY = -step;
				break;
			case 'ArrowDown':
				deltaY = step;
				break;
			case 'ArrowLeft':
				deltaX = -step;
				break;
			case 'ArrowRight':
				deltaX = step;
				break;
			default:
				return;
		}

		e.preventDefault();
		setPosition((prev) => clampPosition(prev.x + deltaX, prev.y + deltaY));
	};

	// Ensure that screen resizing does not place the window out of bounds.
	useEffect(() => {
		setPosition((prev) => clampPosition(prev.x, prev.y));
	}, [clampPosition]);

	return (
		<section
			ref={windowRef}
			className={styles.window}
			aria-hidden={!isOpen}
			style={{
				top: position.y,
				left: position.x,
				cursor: isDragging ? 'grabbing' : 'default',
				touchAction: 'none',
			}}
		>
			<div
				className={styles.titleBar}
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
				role="slider"
				aria-label={`Move ${title} window. Use arrow keys to reposition.`}
				aria-valuenow={position.x}
				aria-valuetext={`Position: ${position.x} pixels from left, ${position.y} pixels from top`}
				tabIndex={0}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onKeyDown={handleKeyDown}
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
