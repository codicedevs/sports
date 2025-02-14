import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";

export function FilterPlugin(schema: Schema) {
  // Define the middleware function that will be used for each method.
  const filterMiddleware = function (next: CallbackWithoutResultAndOptionalError) {
    const { page = 1, limit = 0, populate, where = {} } = this.getQuery();
    const skip = (page - 1) * limit;
    if (Number(limit) > 0) {
      this.limit(limit);
    }

    if (populate) {
      this.populate(populate);
    }

    // Recursively transform and flatten the "where" object.
    const transformedWhere = transformFilter(where);

    // Use the schema information for additional type conversion.
    for (const [key, value] of Object.entries(transformedWhere)) {
      const schemaType = schema.path(key);
      if (schemaType && typeof value !== "object") {
        if (schemaType.instance === "Number") {
          transformedWhere[key] = Number(value);
        } else if (schemaType.instance === "Boolean") {
          transformedWhere[key] = value === "true";
        }
      }
    }

    // Replace the query with our transformed version.
    this.setQuery(transformedWhere);
    next();
  };

  // Attach the middleware only to 'find' and 'countDocuments'.
  schema.pre('find', filterMiddleware);
  schema.pre('countDocuments', filterMiddleware);
}

/**
 * Recursively flattens the filter object and converts any property
 * that has a key "LIKE" (in any case) into a regex condition.
 *
 * @param obj - The original filter object.
 * @param prefix - The prefix for nested keys (used internally).
 * @returns A new object with flattened keys in dot-notation.
 */
function transformFilter(obj: any, prefix: string = ''): Record<string, any> {
  let newObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Build the new key (flattening nested keys into dot notation)
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Look for any property (case-insensitive) named "like"
      const likeKey = Object.keys(value).find(
        k => k.toLowerCase() === 'like'
      );

      if (likeKey) {
        // Replace the condition with a regex filter
        newObj[newKey] = { $regex: value[likeKey], $options: 'i' };
      } else {
        // Otherwise, recursively flatten the nested object.
        Object.assign(newObj, transformFilter(value, newKey));
      }
    } else {
      // Direct assignment if value is not an object.
      newObj[newKey] = value;
    }
  }
  return newObj;
}
