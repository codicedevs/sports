export default function objectToQueryString(data: Record<string, any>): string {
  let queryParts = [];
  let first = true;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Si el valor es un objeto (y no un array ni null)
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        for (const operator in value) {
          if (Object.prototype.hasOwnProperty.call(value, operator)) {
            const opValue = value[operator];

            if (opValue !== "all") {
              if (first) {
                queryParts.push(`where[${key}][${operator}]=${opValue}`);
                first = false;
              } else {
                queryParts.push(`where[${key}][${operator}]=${opValue}`);
              }
            }
          }
        }
      } else {
        // Valor directo
        if (value !== "all") {
          if (first) {
            queryParts.push(`where[${key}]=${value}`);
            first = false;
          } else {
            queryParts.push(`where[${key}]=${value}`);
          }
        }
      }
    }
  }

  return queryParts.join("&");
}
