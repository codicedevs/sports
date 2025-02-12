export default function objectToQueryString(data: Record<string, any>): string {
  let query = "";
  let first = true;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (first) {
        query += `where[${key}]=${data[key]}`;
        first = false;
      } else {
        query += `&[${key}]=${data[key]}`;
      }
    }
  }

  return query;
}
