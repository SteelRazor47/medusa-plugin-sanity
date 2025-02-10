```
import { ShippingOptionDTO } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SanityDocumentDefinition, SanityRule } from "medusa-plugin-sanity/modules/sanity"

export const shippingOptionSchema: SanityDocumentDefinition = {
    type: "document",
    name: "shipping-option",
    title: "Shipping Option Page",
    fields: [
        {
            name: "title",
            type: "string",
        },
        {
            group: "content",
            name: "specs",
            of: [
                {
                    fields: [
                        { name: "lang", title: "Language", type: "string" },
                        { name: "title", title: "Title", type: "string" },
                    ],
                    name: "spec",
                    type: "object",
                },
            ],
            type: "array",
        },
        {
            fields: [
                { name: "title", title: "Title", type: "string" },
                {
                    name: "products",
                    of: [{ to: [{ type: "product" }], type: "reference" }],
                    title: "Addons",
                    type: "array",
                    validation: (Rule: SanityRule) => Rule.max(3),
                },
            ],
            name: "addons",
            type: "object",
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
    groups: [{
        default: true,
        name: "content",
        title: "Content",
    }],
}

export const syncShippingOptionStep = createStep(
    { name: "sync-shipping-option-step", async: true },
    async (input: any, { container }) => {
        const sanityModule: any = container.resolve("sanity")
        const query = container.resolve(ContainerRegistrationKeys.QUERY)

        let total = 0
        const upsertMap: {
            before: any
            after: any
        }[] = []

        const batchSize = 200
        let hasMore = true
        let offset = 0
        const filters = input.ids ? {
            id: input.ids,
        } : {}

        while (hasMore) {
            const {
                data: options,
                metadata: { count } = {},
            } = await query.graph({
                entity: "shipping_option",
                fields: [
                    "id",
                    "name",
                    // @ts-ignore
                    "sanity_shipping_option.*",
                ],
                filters,
                pagination: {
                    skip: offset,
                    take: batchSize,
                    order: {
                        id: "ASC",
                    },
                },
            })
            try {
                await promiseAll(
                    options.map(async (so) => {
                        const after = await sanityModule.upsertSyncDocument(
                            "shipping-option",
                            so as unknown as ShippingOptionDTO
                        )

                        upsertMap.push({
                            // @ts-ignore
                            before: so.sanity_shipping_option,
                            after,
                        })

                        return after
                    })
                )
            } catch (e) {
                return StepResponse.permanentFailure(
                    `An error occurred while syncing documents: ${e}`,
                    upsertMap
                )
            }

            offset += batchSize
            hasMore = offset < (count ?? 0)
            total += options.length

        }

        return new StepResponse({ total }, upsertMap)
    },

    async (upsertMap, { container }) => {
        if (!upsertMap) {
            return
        }

        const sanityModule: any = container.resolve("sanity")

        await promiseAll(
            upsertMap.map(({ before, after }) => {
                if (!before) {
                    // delete the document
                    return sanityModule.delete(after._id)
                }

                const { _id: id, ...oldData } = before

                return sanityModule.update(
                    id,
                    oldData
                )
            })
        )
    }

)

export const transformShippingOptionForCreate = (so: ShippingOptionDTO) => {
    return {
        _type: "shipping-option",
        _id: so.id,
        title: so.name,
        specs: [
            {
                _key: so.id,
                _type: "spec",
                title: so.name,
                lang: "en",
            },
        ],
    }
}

export const transformShippingOptionForUpdate = (so: ShippingOptionDTO) => {
    return {
        set: {
            title: so.name,
        },
    }
}
```
