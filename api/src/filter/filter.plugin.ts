import { CallbackWithoutResultAndOptionalError, model, Schema, Types } from "mongoose";


export function FilterPlugin(schema: Schema) {
    schema.pre('find', function (next: CallbackWithoutResultAndOptionalError) {
        const { page = 1, limit = 0, populate, where = {} } = this.getQuery();
        const skip = (page - 1) * limit;
        this.skip(skip).limit(limit);

        if (populate) {
            this.populate(populate);
        }

        const transformedWhere = Object.entries(where).reduce((acc, [key, value]) => {
            const schemaType = schema.path(key); // Obtener el tipo del schema de Mongoose
            if (!schemaType) {
                acc[key] = value; // Si el campo no está en el schema, se deja igual
            } else if (
                schemaType.instance === "String" &&
                typeof value === "object" &&
                value !== null &&
                "LIKE" in value
            ) {
                acc[key] = { $regex: value.LIKE, $options: "i" }; // Aplicar regex solo a valores con { LIKE: ... }
            } else {
                acc[key] = value; // Mantener cualquier otro tipo sin cambios
            }
            return acc;
        }, {} as Record<string, any>);
        // this.setQuery(transformedWhere);
        this.setQuery(transformedWhere)

        next();
    });
}