import { BadRequestException } from "@nestjs/common";
import { CallbackWithoutResultAndOptionalError, Schema, Types } from "mongoose";

export function FilterPlugin(schema: Schema) {
    schema.pre('find', function (next: CallbackWithoutResultAndOptionalError) 
    {
        const { page = 1, limit = 0, populate, where = {} } = this.getQuery();
        const skip = (page - 1) * limit;
        this.skip(skip).limit(limit);

        if (populate) {
            this.populate(populate);
        }

        this.setQuery(where);

        next();
    });
}