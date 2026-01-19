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
const KEYBOARD_RESIZE_STEP = 20;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

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
	const [size, setSize] = useState<{
		width: number | null;
		height: number | null;
	}>({
		width: null,
		height: null,
	});
	const [isOpen, setIsOpen] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);

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

	const clampSize = useCallback(
		(width: number, height: number) => {
			const maxWidth = screenSizeContext.width - position.x;
			const maxHeight = screenSizeContext.height - position.y;
			return {
				width: Math.max(MIN_WIDTH, Math.min(width, maxWidth)),
				height: Math.max(MIN_HEIGHT, Math.min(height, maxHeight)),
			};
		},
		[screenSizeContext.width, screenSizeContext.height, position.x, position.y],
	);

	const handleResizePointerDown = (e: React.PointerEvent) => {
		if (e.pointerType === 'mouse' && e.button !== 0) {
			return;
		}

		pointerPrevPositionRef.current = { x: e.clientX, y: e.clientY };
		setIsResizing(true);
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const handleResizePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!windowRef.current || !pointerPrevPositionRef.current) {
				return;
			}

			const deltaX = e.clientX - pointerPrevPositionRef.current.x;
			const deltaY = e.clientY - pointerPrevPositionRef.current.y;

			setSize((prev) => {
				const rect = windowRef.current?.getBoundingClientRect();
				const currentWidth = prev.width ?? rect?.width ?? MIN_WIDTH;
				const currentHeight = prev.height ?? rect?.height ?? MIN_HEIGHT;
				return clampSize(currentWidth + deltaX, currentHeight + deltaY);
			});

			pointerPrevPositionRef.current = { x: e.clientX, y: e.clientY };
		},
		[clampSize],
	);

	const handleResizePointerUp = useCallback((e: React.PointerEvent) => {
		pointerPrevPositionRef.current = null;
		setIsResizing(false);
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}, []);

	const handleResizeKeyDown = (e: React.KeyboardEvent) => {
		let deltaWidth = 0;
		let deltaHeight = 0;
		const step = e.shiftKey ? KEYBOARD_RESIZE_STEP * 3 : KEYBOARD_RESIZE_STEP;

		switch (e.key) {
			case 'ArrowUp':
				deltaHeight = -step;
				break;
			case 'ArrowDown':
				deltaHeight = step;
				break;
			case 'ArrowLeft':
				deltaWidth = -step;
				break;
			case 'ArrowRight':
				deltaWidth = step;
				break;
			default:
				return;
		}

		e.preventDefault();
		setSize((prev) => {
			const currentWidth =
				prev.width ??
				windowRef.current?.getBoundingClientRect().width ??
				MIN_WIDTH;
			const currentHeight =
				prev.height ??
				windowRef.current?.getBoundingClientRect().height ??
				MIN_HEIGHT;
			return clampSize(currentWidth + deltaWidth, currentHeight + deltaHeight);
		});
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
				width: size.width ?? undefined,
				height: size.height ?? undefined,
				cursor: isDragging || isResizing ? 'grabbing' : 'default',
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
			<div
				className={styles.resizeHandle}
				role="slider"
				aria-label={`Resize ${title} window. Use arrow keys to adjust size.`}
				aria-valuenow={size.width ?? 0}
				aria-valuetext={`Size: ${size.width ?? 'auto'} pixels wide, ${size.height ?? 'auto'} pixels tall`}
				tabIndex={0}
				style={{ cursor: isResizing ? 'grabbing' : 'nwse-resize' }}
				onPointerDown={handleResizePointerDown}
				onPointerMove={handleResizePointerMove}
				onPointerUp={handleResizePointerUp}
				onPointerCancel={handleResizePointerUp}
				onKeyDown={handleResizeKeyDown}
			/>
		</section>
	);
};
export default Window;
