"use client";
import { useState, useEffect } from "react";

/**
 * useImagePreloader hook
 * @param images Array of image URLs to preload
 * @returns boolean indicating whether all images are loaded
 */
export function useImagePreloader(): boolean {
  const [isLoaded, setIsLoaded] = useState(false);
  const images = [
    "/assets/images/banner.png",
    "/assets/images/footer.png",
    "/assets/images/paper.png",
    "/assets/images/stars.png",
    "/assets/images/leaderboard.png",
  ];
  useEffect(() => {
    if (!images || images.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === images.length) setIsLoaded(true);
    };

    const imageElements = images.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      return img;
    });

    // Cleanup: optional
    return () => {
      imageElements.forEach((img) => {
        img.onload = null;
      });
    };
  }, [images]);

  return isLoaded;
}
