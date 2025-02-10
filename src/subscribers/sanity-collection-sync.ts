import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/medusa"
import {
    sanityWorkflows,
} from "../workflows/sanity-sync-products"
import { ProductEvents } from "@medusajs/framework/utils"

export default async function upsertSanityCollection({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    await sanityWorkflows.collection(container).run({
        input: {
            ids: [data.id],
        },
    })
}

export const config: SubscriberConfig = {
    event: [ProductEvents.PRODUCT_COLLECTION_CREATED, ProductEvents.PRODUCT_COLLECTION_UPDATED],
}
