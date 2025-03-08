export function devLog(...args: unknown[]) {
  if (!__DEV__) {
    return;
  }
  console.log(`[${new Date().toLocaleTimeString()}]`, ...args);
}
