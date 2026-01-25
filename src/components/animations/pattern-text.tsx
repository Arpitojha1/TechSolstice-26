import React from 'react';
import { cn } from '@/lib/utils';

export function PatternText({
	text = 'Text',
	className,
	...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { text: string }) {
	return (
		<p
			data-shadow={text}
			className={cn(
				'relative inline-block text-[10em] font-bold text-white',
				'[text-shadow:0.02em_0.02em_0_rgba(0,0,0,0.7)]',
				'after:absolute after:top-1 after:left-1 after:z-[-1] after:content-[attr(data-shadow)]',
				'after:bg-[length:0.04em_0.04em] after:bg-clip-text after:text-transparent',
				'after:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.25)_45%,rgba(255,255,255,0.25)_55%,transparent_0)]',
				'after:animate-shadanim',
				'md:after:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.2)_55%,transparent_0)]',
				'sm:after:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.3)_45%,rgba(255,255,255,0.3)_55%,transparent_0)]',
				className,
			)}
			{...props}
		>
			{text}
		</p>
	);
}
