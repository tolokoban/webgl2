/**
 * Wait for `delay` milliseconds then resolve.
 * @param delay Time to sleep in msec.
 */
export function sleep(delay: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, delay))
}
