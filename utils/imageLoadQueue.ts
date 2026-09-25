/**
 * Image Concurrency & Queue Manager
 * Prevents network congestion, thread blocking, and frame drops by limiting
 * how many images can actively download and decode simultaneously.
 */

type QueueTask = {
  src: string;
  priority: number; // Higher number = higher priority
  resolve: (src: string) => void;
  reject: (err: any) => void;
  cancelled: boolean;
};

class ImageLoadQueue {
  private queue: QueueTask[] = [];
  private activeCount = 0;
  // Allows up to 6 concurrent downloads (standard browser parallel connection limit)
  // preventing choke while eliminating network starvation
  private readonly maxConcurrent = 6;
  // In-memory cache of successfully loaded image URLs
  private loadedCache = new Set<string>();

  /**
   * Check if an image URL has already been loaded and decoded in the current session
   */
  public isLoaded(src: string): boolean {
    return this.loadedCache.has(src);
  }

  /**
   * Enqueue an image for controlled, sequential/prioritized loading.
   */
  public enqueue(
    src: string,
    priority = 0
  ): { promise: Promise<string>; cancel: () => void } {
    if (!src) {
      return {
        promise: Promise.reject(new Error('Invalid image source')),
        cancel: () => {},
      };
    }

    // Fast-path: image already loaded & cached
    if (this.loadedCache.has(src)) {
      return {
        promise: Promise.resolve(src),
        cancel: () => {},
      };
    }

    let task: QueueTask;

    const promise = new Promise<string>((resolve, reject) => {
      task = {
        src,
        priority,
        resolve: (loadedSrc) => {
          this.loadedCache.add(loadedSrc);
          resolve(loadedSrc);
        },
        reject,
        cancelled: false,
      };

      this.insertByPriority(task);
      this.processQueue();
    });

    const cancel = () => {
      if (task) {
        task.cancelled = true;
        const index = this.queue.indexOf(task);
        if (index !== -1) {
          this.queue.splice(index, 1);
        }
      }
    };

    return { promise, cancel };
  }

  private insertByPriority(task: QueueTask) {
    const index = this.queue.findIndex((t) => t.priority < task.priority);
    if (index === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(index, 0, task);
    }
  }

  private processQueue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      if (!nextTask || nextTask.cancelled) continue;

      this.activeCount++;

      this.loadImage(nextTask.src)
        .then((loadedSrc) => {
          if (!nextTask.cancelled) {
            nextTask.resolve(loadedSrc);
          }
        })
        .catch((err) => {
          if (!nextTask.cancelled) {
            nextTask.reject(err);
          }
        })
        .finally(() => {
          this.activeCount--;
          this.processQueue();
        });
    }
  }

  private loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Handlers MUST be attached before setting src to prevent missing cached/fast loads
      img.onload = () => {
        // Pre-decode off-screen if available, but never reject if decode encounters a non-fatal glitch
        if ('decode' in img) {
          img
            .decode()
            .then(() => resolve(src))
            .catch(() => {
              // Image data is already loaded via onload, so resolve safely
              resolve(src);
            });
        } else {
          resolve(src);
        }
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = src;
    });
  }
}

export const imageLoadQueue = new ImageLoadQueue();
