'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import styles from './scroll-path-animation.module.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function ScrollPathAnimation() {
  const mainRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const createTimeline = () => {
      ctx && ctx.revert();

      ctx = gsap.context(() => {
        const box = boxRef.current;
        if (!box) return;

        const boxStartRect = box.getBoundingClientRect();

        // All marker elements
        const markers = markerRefs.current.filter(Boolean) as HTMLElement[];

        // Grab the points to animate between
        const points = markers.map((marker) => {
          const r = marker.getBoundingClientRect();

          return {
            x: r.left + r.width / 2 - (boxStartRect.left + boxStartRect.width / 2),
            y: r.top + r.height / 2 - (boxStartRect.top + boxStartRect.height / 2)
          };
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box.parentElement,
            start: 'top center',
            endTrigger: finalRef.current,
            end: 'top center',
            scrub: 1
          }
        });

        tl.to(box, {
          duration: 1,
          ease: 'none',
          motionPath: {
            path: points,
            curviness: 1.5
          }
        });
      }, mainRef);
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(createTimeline, 100);

    const handleResize = () => createTimeline();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      ctx && ctx.revert();
    };
  }, []);

  return (
    <>
      <div className={styles.spacer}>
        <div>Scroll down to see the path animation</div>
      </div>

      <div ref={mainRef} className={styles.main}>
        <div className={`${styles.container} ${styles.initial}`}>
          <div ref={boxRef} className={styles.box}></div>
        </div>

        <div className={`${styles.container} ${styles.second}`}>
          <div ref={(el) => markerRefs.current[0] = el} className={styles.marker}></div>
        </div>
        <div className={`${styles.container} ${styles.third}`}>
          <div ref={(el) => markerRefs.current[1] = el} className={styles.marker}></div>
        </div>
        <div className={`${styles.container} ${styles.fourth}`}>
          <div ref={(el) => markerRefs.current[2] = el} className={styles.marker}></div>
        </div>
        <div className={`${styles.container} ${styles.fifth}`}>
          <div ref={(el) => markerRefs.current[3] = el} className={styles.marker}></div>
        </div>
        <div className={`${styles.container} ${styles.sixth}`}>
          <div ref={(el) => markerRefs.current[4] = el} className={styles.marker}></div>
        </div>
      </div>

      <div ref={finalRef} className={styles.spacer}></div>
    </>
  );
}