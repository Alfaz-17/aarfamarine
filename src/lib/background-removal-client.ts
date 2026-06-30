/**
 * Mock background removal for fast client compiling and performance.
 * Simply returns the original file.
 */
export async function removeBackgroundClient(imageFile: File | Blob): Promise<Blob> {
  console.log("[BG Client Mock] Background removal simulated - bypassed for local optimization.");
  return imageFile;
}
