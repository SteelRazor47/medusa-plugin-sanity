import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import { SANITY_MODULE } from "../modules/sanity"

export default defineLink(
    {
        ...ProductModule.linkable.productCategory.id,
        field: "id",
    },
    {
        linkable: {
            serviceName: SANITY_MODULE,
            alias: "sanity_category",
            primaryKey: "id",
        },
    },
    {
        readOnly: true,
    }
)
