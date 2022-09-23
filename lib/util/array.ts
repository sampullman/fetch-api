export function toArray<T>(arr: void | T | T[]): T[] {
  if (!arr) {
    return [];
  }
  if (Array.isArray(arr)) {
    return arr;
  }
  return [arr];
}

// Returns a serialized array for use in an API query string
// e.g. arrayToQuery('num', [1, 2, 3]) => 'num[]=1&num[]=2&num[]=3'
export function arrayToQuery(arrayName: string, array: Array<number | string>): string {
  let result = array.reduce(
    (prev: string, cur) => `${prev}&${arrayName}[]=${encodeURIComponent(cur.toString())}`,
    '',
  );
  // Remove & prefix
  if (result.startsWith('&')) {
    result = result.slice(1);
  }
  return result;
}
