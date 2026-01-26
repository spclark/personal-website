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
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 300;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

interface Props {
	title: string;
	children?: React.ReactNode;
	fill?: 'solid' | 'inset';
}

const Window: React.FC<Props> = ({ title, children, fill = 'inset' }) => {
	const screenSizeContext = useContext(ScreenSizeContext);

	const [{ position, size }, setPositionAndSize] = useState({
		position: { x: 0, y: 0 },
		size: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
	});

	// Track whether we've done the initial positioning.
	const isInitializedRef = useRef(false);

	const setPosition = useCallback(
		(updater: (prev: { x: number; y: number }) => { x: number; y: number }) => {
			setPositionAndSize((prev) => ({
				...prev,
				position: updater(prev.position),
			}));
		},
		[],
	);

	const setSize = useCallback(
		(
			updater: (prev: { width: number; height: number }) => {
				width: number;
				height: number;
			},
		) => {
			setPositionAndSize((prev) => ({
				...prev,
				size: updater(prev.size),
			}));
		},
		[],
	);

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
		[clampPosition, setPosition],
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

			setSize((prev) => clampSize(prev.width + deltaX, prev.height + deltaY));

			pointerPrevPositionRef.current = { x: e.clientX, y: e.clientY };
		},
		[clampSize, setSize],
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
		setSize((prev) =>
			clampSize(prev.width + deltaWidth, prev.height + deltaHeight),
		);
	};

	// Handle initial centering and subsequent screen resizes.
	useEffect(() => {
		// Wait for valid screen dimensions.
		if (screenSizeContext.width === 0 || screenSizeContext.height === 0) {
			return;
		}

		if (!isInitializedRef.current) {
			// Initial positioning: center the window on screen.
			isInitializedRef.current = true;
			const width = Math.min(DEFAULT_WIDTH, screenSizeContext.width);
			const height = Math.min(DEFAULT_HEIGHT, screenSizeContext.height);
			setPositionAndSize({
				position: {
					x: Math.max(0, Math.floor((screenSizeContext.width - width) / 2)),
					y: Math.max(0, Math.floor((screenSizeContext.height - height) / 2)),
				},
				size: { width, height },
			});
		} else {
			// Screen resize: clamp size first, then position.
			setPositionAndSize((prev) => {
				const maxWidth = screenSizeContext.width;
				const maxHeight = screenSizeContext.height;
				const newWidth = Math.max(
					MIN_WIDTH,
					Math.min(prev.size.width, maxWidth),
				);
				const newHeight = Math.max(
					MIN_HEIGHT,
					Math.min(prev.size.height, maxHeight),
				);
				const newX = Math.max(
					0,
					Math.min(prev.position.x, screenSizeContext.width - newWidth),
				);
				const newY = Math.max(
					0,
					Math.min(prev.position.y, screenSizeContext.height - newHeight),
				);
				return {
					position: { x: newX, y: newY },
					size: { width: newWidth, height: newHeight },
				};
			});
		}
	}, [screenSizeContext.width, screenSizeContext.height]);

	return (
		<section
			ref={windowRef}
			className={styles.window}
			aria-hidden={!isOpen}
			style={{
				top: position.y,
				left: position.x,
				width: size.width,
				height: size.height,
				cursor: isDragging || isResizing ? 'grabbing' : 'default',
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
				aria-valuenow={size.width}
				aria-valuetext={`Size: ${size.width} pixels wide, ${size.height} pixels tall`}
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
