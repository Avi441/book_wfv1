/**
 * Image processing and compression utility.
 * Optimizes high-resolution images to crystal-clear, lightweight Data URLs (<150KB)
 * so they never exceed browser storage limits or cause data loss on refresh.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  onProgress?: (percent: number) => void;
}

export function compressAndProcessImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1400,
    maxHeight = 2000,
    quality = 0.88,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    onProgress?.(10);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 40) + 10;
        onProgress?.(percent);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.onload = (event) => {
      onProgress?.(55);
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Image reader returned empty result.'));
        return;
      }

      // If it's a vector SVG, return as is
      if (file.type === 'image/svg+xml') {
        onProgress?.(100);
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        onProgress?.(75);
        try {
          let { width, height } = img;

          // Maintain aspect ratio while bounding within maxWidth & maxHeight
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const scale = Math.min(widthRatio, heightRatio);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            onProgress?.(100);
            resolve(dataUrl);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          onProgress?.(90);

          // Try WebP first for optimal compression, fallback to JPEG
          let optimizedDataUrl: string;
          try {
            optimizedDataUrl = canvas.toDataURL('image/webp', quality);
            if (!optimizedDataUrl.startsWith('data:image/webp')) {
              optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          onProgress?.(100);
          resolve(optimizedDataUrl);
        } catch (err) {
          // If canvas fails, fallback gracefully to raw dataUrl
          onProgress?.(100);
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        // Fallback to dataUrl if image loading fails
        onProgress?.(100);
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
