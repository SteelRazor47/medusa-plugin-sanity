import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ProductCategoryDTO, ProductCollectionDTO, ProductDTO } from "@medusajs/framework/types"
import {
    ContainerRegistrationKeys,
    promiseAll,
} from "@medusajs/framework/utils"
import SanityModuleService from "../../../modules/sanity/service"
import { SANITY_MODULE } from "../../../modules/sanity"

export type SyncStepInput = {
    ids?: string[];
}

export const syncProductStep = createStep(
    { name: "sync-product-step", async: true },
    async (input: SyncStepInput, { container }) => {
        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)
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
                data: products,
                metadata: { count } = {},
            } = await query.graph({
                entity: "product",
                fields: [
                    "id",
                    "title",
                    // @ts-ignore
                    "sanity_product.*",
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
                    products.map(async (prod) => {
                        const after = await sanityModule.upsertSyncDocument(
                            "product",
                            prod as ProductDTO
                        )

                        upsertMap.push({
                            // @ts-ignore
                            before: prod.sanity_product,
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
            total += products.length

        }

        return new StepResponse({ total }, upsertMap)
    },

    async (upsertMap, { container }) => {
        if (!upsertMap) {
            return
        }

        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)

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


export const syncCategoryStep = createStep(
    { name: "sync-category-step", async: true },
    async (input: SyncStepInput, { container }) => {
        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)
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
                data: categories,
                metadata: { count } = {},
            } = await query.graph({
                entity: "product_category",
                fields: [
                    "id",
                    "name",
                    // @ts-ignore
                    "sanity_category.*",
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
                    categories.map(async (cat) => {
                        const after = await sanityModule.upsertSyncDocument(
                            "category",
                            cat as ProductCategoryDTO
                        )

                        upsertMap.push({
                            // @ts-ignore
                            before: cat.sanity_category,
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
            total += categories.length

        }

        return new StepResponse({ total }, upsertMap)
    },

    async (upsertMap, { container }) => {
        if (!upsertMap) {
            return
        }

        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)

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

export const syncCollectionStep = createStep(
    { name: "sync-collection-step", async: true },
    async (input: SyncStepInput, { container }) => {
        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)
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
                data: collections,
                metadata: { count } = {},
            } = await query.graph({
                entity: "product_collection",
                fields: [
                    "id",
                    "title",
                    // @ts-ignore
                    "sanity_collection.*",
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
                    collections.map(async (coll) => {
                        const after = await sanityModule.upsertSyncDocument(
                            "collection",
                            coll as ProductCollectionDTO
                        )

                        upsertMap.push({
                            // @ts-ignore
                            before: coll.sanity_collection,
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
            total += collections.length

        }

        return new StepResponse({ total }, upsertMap)
    },

    async (upsertMap, { container }) => {
        if (!upsertMap) {
            return
        }

        const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE)

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
