type StyleObject = {
  [key: string]: any;
};

const style: StyleObject = typeof document !== 'undefined'
  ? document.createElement('p').style
  : {};

const prefixes: string[] = ['O', 'ms', 'Moz', 'Webkit'];
const upper: RegExp = /([A-Z])/g;
const memo: { [key: string]: string } = {};

/**
 * prefix `key`
 *
 *   prefix('transform') // => WebkitTransform
 *
 * @param key - Property name to prefix
 * @return Prefixed property name
 */
export function prefix(key: string): string {
  // Camel case
  key = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  // Without prefix
  if (style[key] !== undefined) return key;

  // With prefix
  const Key: string = key.charAt(0).toUpperCase() + key.slice(1);
  let i: number = prefixes.length;
  while (i--) {
    const name: string = prefixes[i] + Key;
    if (style[name] !== undefined) return name;
  }

  return key;
}

/**
 * Memoized version of `prefix`
 *
 * @param key - Property name to prefix
 * @return Prefixed property name
 */
export function prefixMemozied(key: string): string {
  return key in memo
    ? memo[key]
    : memo[key] = prefix(key);
}

/**
 * Create a dashed prefix
 *
 * @param key - Property name to convert to dashed prefix
 * @return Dashed prefixed property name
 */
export function prefixDashed(key: string): string {
  key = prefix(key);
  if (upper.test(key)) {
    key = `-${key.replace(upper, '-$1')}`;
    upper.lastIndex = 0;
  }
  return key.toLowerCase();
}
