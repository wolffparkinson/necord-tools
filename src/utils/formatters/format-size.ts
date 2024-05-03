/**
 * Formats the given number of bytes into a human-readable format.
 *
 * @param {number} bytes - The number of bytes to format
 * @param {number} decimals - (Optional) The number of decimal places to include (default is 2)
 * @return {string} The formatted bytes in a human-readable format
 */
export function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
