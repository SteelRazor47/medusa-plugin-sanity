import {
    Logger,
    ProductCategoryDTO,
    ProductCollectionDTO,
    ProductDTO,
} from "@medusajs/framework/types"
import {
    createClient,
    FirstDocumentMutationOptions,
    SanityClient,
} from "@sanity/client"
import { SchemaTypeDefinition } from "sanity";
import { createSanityWorkflow, ReturnSanityWorkflow, sanityWorkflows, StepType } from "../../workflows/sanity-sync-products";


const SyncDocumentTypes = {
    PRODUCT: "product",
    CATEGORY: "category",
    COLLECTION: "collection"
} as const

type SyncDocumentTypes =
    (typeof SyncDocumentTypes)[keyof typeof SyncDocumentTypes];

export type ModuleOptions = {
    api_token: string;
    project_id: string;
    dataset: string;
    api_version: string;
    backend_url: string;
    extra_schemas?: {
        [type: string]: {
            schema: SchemaTypeDefinition;
            step: StepType,
            transformForCreate: (data: any) => any;
            transformForUpdate: (data: any) => any;
        }
    }
}

type SyncDocumentInputs<T> =
    T extends "product" ? ProductDTO :
    T extends "category" ? ProductCategoryDTO :
    T extends "collection" ? ProductCollectionDTO :
    never

type TransformationMap<T> = Record<
    SyncDocumentTypes,
    (data: SyncDocumentInputs<T>) => any
>;

type InjectedDependencies = {
    logger: Logger
};

class SanityModuleService {
    private options: ModuleOptions
    private workflows: Record<string, ReturnSanityWorkflow>
    private client: SanityClient
    private logger: Logger

    private typeMap: Record<SyncDocumentTypes, string>
    private createTransformationMap: TransformationMap<SyncDocumentTypes>
    private updateTransformationMap: TransformationMap<SyncDocumentTypes>

    constructor({
        logger,
    }: InjectedDependencies, options: ModuleOptions) {
        this.client = createClient({
            projectId: options.project_id,
            apiVersion: options.api_version,
            dataset: options.dataset,
            token: options.api_token,
        })
        this.options = options
        const extra_workflows = Object.fromEntries(Object.entries(options.extra_schemas ?? {}).map(([type, s]) => {
            return [type, createSanityWorkflow(type, s.step)]
        }))

        this.workflows = Object.assign({}, sanityWorkflows, extra_workflows)

        this.logger = logger


        this.typeMap = {
            [SyncDocumentTypes.PRODUCT]: "product",
            [SyncDocumentTypes.CATEGORY]: "category",
            [SyncDocumentTypes.COLLECTION]: "collection",
        }

        const createMap = Object.fromEntries(Object.entries(options.extra_schemas ?? {}).map(([type, s]) => {
            return [type, s.transformForCreate]
        }))

        const updateMap = Object.fromEntries(Object.entries(options.extra_schemas ?? {}).map(([type, s]) => {
            return [type, s.transformForUpdate]
        }))


        this.createTransformationMap = Object.assign({}, {
            [SyncDocumentTypes.PRODUCT]: this.transformProductForCreate,
            [SyncDocumentTypes.CATEGORY]: this.transformCategoryForCreate,
            [SyncDocumentTypes.COLLECTION]: this.transformCollectionForCreate,
        }, createMap)

        this.updateTransformationMap = Object.assign({}, {
            [SyncDocumentTypes.PRODUCT]: this.transformProductForUpdate,
            [SyncDocumentTypes.CATEGORY]: this.transformCategoryForUpdate,
            [SyncDocumentTypes.COLLECTION]: this.transformCollectionForUpdate,
        }, updateMap)

        this.logger.info("Connected to Sanity")
    }

    getOptions() {
        return this.options
    }

    getWorkflows() {
        return this.workflows
    }

    private transformProductForCreate = (product: ProductDTO) => {
        return {
            _type: this.typeMap[SyncDocumentTypes.PRODUCT],
            _id: product.id,
            title: product.title,
            specs: [
                {
                    _key: product.id,
                    _type: "spec",
                    title: product.title,
                    lang: "en",
                },
            ],
        }
    }

    private transformCategoryForCreate = (category: ProductCategoryDTO) => {
        return {
            _type: this.typeMap[SyncDocumentTypes.CATEGORY],
            _id: category.id,
            title: category.name,
            specs: [
                {
                    _key: category.id,
                    _type: "spec",
                    title: category.name,
                    lang: "en",
                },
            ],
        }
    }

    private transformCollectionForCreate = (collection: ProductCollectionDTO) => {
        return {
            _type: this.typeMap[SyncDocumentTypes.COLLECTION],
            _id: collection.id,
            title: collection.title,
            specs: [
                {
                    _key: collection.id,
                    _type: "spec",
                    title: collection.title,
                    lang: "en",
                },
            ],
        }
    }

    private transformProductForUpdate = (product: ProductDTO) => {
        return {
            set: {
                title: product.title,
            },
        }
    }

    private transformCategoryForUpdate = (category: ProductCategoryDTO) => {
        return {
            set: {
                title: category.name,
            },
        }
    }

    private transformCollectionForUpdate = (collection: ProductCollectionDTO) => {
        return {
            set: {
                title: collection.title,
            },
        }
    }

    async upsertSyncDocument<T extends SyncDocumentTypes>(
        type: T,
        data: SyncDocumentInputs<T>
    ) {
        const existing = await this.client.getDocument(data.id)
        if (existing) {
            return await this.updateSyncDocument(type, data)
        }

        return await this.createSyncDocument(type, data)
    }

    async createSyncDocument<T extends SyncDocumentTypes>(
        type: T,
        data: SyncDocumentInputs<T>,
        options?: FirstDocumentMutationOptions
    ) {
        const doc = this.createTransformationMap[type](data)
        return await this.client.create(doc, options)
    }

    async updateSyncDocument<T extends SyncDocumentTypes>(
        type: T,
        data: SyncDocumentInputs<T>
    ) {
        const operations = this.updateTransformationMap[type](data)
        return await this.client.patch(data.id, operations).commit()
    }

    async getStudioLink(
        type: string,
        id: string,
        config: { explicit_type?: boolean } = {}
    ) {
        const resolvedType = config.explicit_type ? type : this.typeMap[type]
        if (!this.options.backend_url) {
            throw new Error("No backend URL provided")
        }
        return `${this.options.backend_url}/app/studio/structure/${resolvedType};${id}`
    }


    async retrieve(id: string) {
        return this.client.getDocument(id)
    }

    async delete(id: string) {
        return this.client.delete(id)
    }

    async update(id: string, data: any) {
        return await this.client.patch(id, {
            set: data,
        }).commit()
    }

    async list(
        filter: {
            id: string | string[]
        }
    ) {
        const data = await this.client.getDocuments(
            Array.isArray(filter.id) ? filter.id : [filter.id]
        )

        return data.map((doc) => ({
            id: doc?._id,
            ...doc,
        }))
    }

}

export default SanityModuleService
