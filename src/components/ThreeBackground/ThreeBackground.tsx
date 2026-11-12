"use client";

import { useEffect, useRef } from "react";

import { animateObjects } from "./animations";
import { createThreeScene } from "./scene";
import { IPointer, IThreeScene } from "./ThreeBackground.types";

import styles from "./ThreeBackground.module.scss";

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    let isDisposed = false;
    let animationFrameId = 0;

    let threeScene: IThreeScene | null = null;
    let themeObserver: MutationObserver | null = null;

    // Respect the user's operating system motion preferences.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Store actual and interpolated pointer positions.
    const pointer: IPointer = { x: 0, y: 0 };
    const currentPointer: IPointer = { x: 0, y: 0 };

    // Store actual and interpolated scroll progress.
    let scrollProgress = 0;
    let currentScrollProgress = 0;

    // Calculate scroll progress between 0 and 1.
    const updateScrollProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollProgress =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    };

    // Convert mouse coordinates into normalized values (-1 to 1).
    const updatePointer = (event: PointerEvent) => {
      if (reducedMotion.matches) return;

      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    // Smoothly interpolate pointer and scroll values.
    const updateInteractionValues = () => {
      const pointerEase = reducedMotion.matches ? 1 : 0.035;
      const scrollEase = reducedMotion.matches ? 1 : 0.04;

      currentPointer.x += (pointer.x - currentPointer.x) * pointerEase;

      currentPointer.y += (pointer.y - currentPointer.y) * pointerEase;

      currentScrollProgress +=
        (scrollProgress - currentScrollProgress) * scrollEase;
    };

    // Update objects and render the scene on each animation frame.
    const animate = (time: number) => {
      if (!threeScene || isDisposed) return;

      animationFrameId = window.requestAnimationFrame(animate);

      const elapsed = reducedMotion.matches ? 0 : time * 0.001;

      updateInteractionValues();

      animateObjects(threeScene.pyramid, threeScene.cube, {
        elapsed,
        pointerX: currentPointer.x,
        pointerY: currentPointer.y,
        scrollProgress: currentScrollProgress,
      });

      threeScene.renderer.render(threeScene.scene, threeScene.camera);
    };

    // Start the animation loop if the document is visible.
    const startAnimation = () => {
      if (isDisposed || document.hidden) return;

      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(animate);
    };

    // Pause rendering when the tab is hidden.
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrameId);
        return;
      }

      startAnimation();
    };

    // Update camera and renderer dimensions on viewport resize.
    const handleResize = () => {
      threeScene?.resize();
    };

    // Initialize Three.js and observe theme changes.
    const initialize = () => {
      try {
        if (isDisposed) return;

        threeScene = createThreeScene(canvas);

        themeObserver = new MutationObserver(() => {
          threeScene?.updateTheme();
        });

        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class", "style", "data-theme"],
        });

        updateScrollProgress();
        startAnimation();
      } catch (error) {
        if (!isDisposed) {
          console.error("ThreeBackground initialization failed:", error);
        }
      }
    };

    // Register browser event listeners.
    window.addEventListener("pointermove", updatePointer, {
      passive: true,
    });

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    initialize();

    // Clean up listeners, observers, animation, and GPU resources.
    return () => {
      isDisposed = true;

      window.cancelAnimationFrame(animationFrameId);

      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", handleResize);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      themeObserver?.disconnect();
      themeObserver = null;

      threeScene?.dispose();
      threeScene = null;
    };
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      <div className={`${styles.glow} ${styles.leftGlow}`} />
      <div className={`${styles.glow} ${styles.rightGlow}`} />

      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
