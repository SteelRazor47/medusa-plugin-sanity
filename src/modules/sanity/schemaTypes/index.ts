import { SchemaPluginOptions } from "sanity"
import productSchema from "./documents/product.js"
import categorySchema from "./documents/category.js"
import collectionSchema from "./documents/collection.js"

export const schema: SchemaPluginOptions = {
  types: [productSchema, categorySchema, collectionSchema],
}
