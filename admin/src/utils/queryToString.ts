import { Filter } from "../interfaces/interfaces";

export default function objectToQueryString<T>(data: Filter<T>): string {
  let queryParts = [];
  let first = true;

  for (const key in data) {
    if (key === "populate") {
      queryParts.push(`populate=${data[key]}`);
      first = false;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

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
        console.log("entro");
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
