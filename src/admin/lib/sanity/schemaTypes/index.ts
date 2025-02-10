import { SchemaPluginOptions } from "sanity"
import productSchema from "./documents/product"
import categorySchema from "./documents/category"
import collectionSchema from "./documents/collection"

export const schema: SchemaPluginOptions = {
  types: [productSchema, categorySchema, collectionSchema],
}
