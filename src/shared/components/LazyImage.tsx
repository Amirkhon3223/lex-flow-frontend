/**
 * @file LazyImage.tsx
 * @description Performance-optimized image component with lazy loading,
 * placeholder skeleton, blur-up effect, error handling, and responsive srcset support.
 */

import { useState, useRef, useEffect, memo, type ImgHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** Source URL for the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional srcset for responsive images */
  srcSet?: string;
  /** Optional sizes attribute for responsive images */
  sizes?: string;
  /** Fallback image URL on error */
  fallbackSrc?: string;
  /** Custom placeholder element */
  placeholder?: React.ReactNode;
  /** Additional class for the container */
  containerClassName?: string;
  /** Whether to show blur-up effect */
  blurUp?: boolean;
  /** Aspect ratio for the skeleton (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
  /** Callback when image loads successfully */
  onLoadSuccess?: () => void;
  /** Callback when image fails to load */
  onLoadError?: (error: Error) => void;
}

/**
 * LazyImage - A performance-optimized image component
 *
 * Features:
 * - Native lazy loading with loading="lazy"
 * - Skeleton placeholder while loading
 * - Blur-up effect on load
 * - Error state with fallback image
 * - Responsive srcset support
 * - Memoized for performance
 */
export const LazyImage = memo(function LazyImage({
  src,
  alt,
  srcSet,
  sizes,
  fallbackSrc = '/placeholder-image.svg',
  placeholder,
  className,
  containerClassName,
  blurUp = true,
  aspectRatio,
  onLoadSuccess,
  onLoadError,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoadSuccess?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    // Try fallback if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }

    onLoadError?.(new Error(`Failed to load image: ${src}`));
  };

  // Aspect ratio style for skeleton
  const aspectRatioStyle = aspectRatio
    ? { aspectRatio }
    : undefined;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      style={aspectRatioStyle}
    >
      {/* Skeleton placeholder */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          {placeholder || (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">{alt || 'Image'}</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          // Blur-up effect
          blurUp && isLoading && 'blur-sm scale-105',
          blurUp && !isLoading && 'blur-0 scale-100',
          // Hide if error and no fallback worked
          hasError && 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
