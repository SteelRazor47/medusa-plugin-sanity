import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/medusa"
import {
    sanityWorkflows,
} from "../workflows/sanity-sync-products"

export default async function upsertSanityProduct({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    await sanityWorkflows.product(container).run({
        input: {
            ids: [data.id],
        },
    })
}

export const config: SubscriberConfig = {
    event: ["product.created", "product.updated"],
}
