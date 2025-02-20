import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";

export function FilterPlugin(schema: Schema) {
  // Define the middleware function that will be used for each method.
  const filterMiddleware = function (next: CallbackWithoutResultAndOptionalError) {
    const { page = 1, limit = 0, populate, where = {} } = this.getQuery();
    // Only apply pagination (skip/limit and populate) if this is a find query.
    if (this.op === 'find') {
      const skip = (page - 1) * limit;
      this.skip(skip);
      if (Number(limit) > 0) {
        this.limit(limit);
      }
      if (populate) {
        this.populate(populate);
      }
    }

    if (populate) {
      this.populate(populate);
    }

    this.setQuery(where);

    next();
  };

  // Attach the middleware to both 'find' and 'countDocuments'
  schema.pre('find', filterMiddleware);
  schema.pre('countDocuments', filterMiddleware);
}
