import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Pattern effect settings for different breakpoints
 * Controls the diagonal stripe overlay opacity
 */
const PATTERN_TEXT_CONFIG = {
	/** Default stripe gradient (base) */
	defaultGradient: 'linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.25)_45%,rgba(255,255,255,0.25)_55%,transparent_0)',
	/** Medium screens gradient (slightly less opacity) */
	mdGradient: 'linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.2)_55%,transparent_0)',
	/** Small screens gradient (more visible) */
	smGradient: 'linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.3)_45%,rgba(255,255,255,0.3)_55%,transparent_0)',
	/** Shadow offset for depth effect */
	shadowOffset: '0.02em_0.02em_0_rgba(0,0,0,0.7)',
	/** Pattern size relative to font size */
	patternSize: '0.04em_0.04em',
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface PatternTextProps extends Omit<React.ComponentProps<'p'>, 'children'> {
	/** Text content to display with pattern effect */
	text: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Text component with animated diagonal stripe pattern overlay.
 * Font size is inherited from parent container for flexible responsive sizing.
 * 
 * @example
 * <div style={{ fontSize: '3rem' }}>
 *   <PatternText text="Hello" className="text-white" />
 * </div>
 */
export function PatternText({ text = 'Text', className, ...props }: PatternTextProps) {
	return (
		<p
			data-shadow={text}
			className={cn(
				// Base styles - inherits font size from parent for responsive control
				'relative inline-block text-inherit font-bold text-white',
				// Text shadow for depth
				`[text-shadow:${PATTERN_TEXT_CONFIG.shadowOffset}]`,
				// Pseudo-element for pattern overlay
				'after:absolute after:top-1 after:left-1 after:z-[-1] after:content-[attr(data-shadow)]',
				`after:bg-[length:${PATTERN_TEXT_CONFIG.patternSize}] after:bg-clip-text after:text-transparent`,
				// Pattern gradients (breakpoint-specific)
				`after:bg-[${PATTERN_TEXT_CONFIG.defaultGradient}]`,
				'after:animate-shadanim',
				`md:after:bg-[${PATTERN_TEXT_CONFIG.mdGradient}]`,
				`sm:after:bg-[${PATTERN_TEXT_CONFIG.smGradient}]`,
				// User overrides
				className,
			)}
			{...props}
		>
			{text}
		</p>
	);
}
