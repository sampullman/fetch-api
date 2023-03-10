// Returns a serialized array for use in an API query string
// e.g. objectToQuery('things', {a: 1, b: 2}) => 'things[a]=1&things[b]=2'
export function objectToQuery(name: string, obj: Record<string, unknown>): string {
  let result = '';
  for (const [key, val] of Object.entries(obj)) {
    result += `&${name}[${key}]=${val}`;
  }
  // Remove & prefix
  if (result.startsWith('&')) {
    result = result.slice(1);
  }
  return result;
}
