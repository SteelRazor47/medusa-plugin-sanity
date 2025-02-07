import {
    createWorkflow,
    ReturnWorkflow,
    StepFunction,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { syncCategoryStep, syncCollectionStep, syncProductStep, SyncStepInput } from "./steps/sync"

export type SanitySyncWorkflowInput = {
    ids?: string[];
};

export type SanityWorkflowType = "product" | "category" | "collection"

type StepType = StepFunction<SyncStepInput, { total: number; }>

const createSanityWorkflow = (type: SanityWorkflowType, step: StepType) => createWorkflow(
    { name: `sanity-sync-${type}`, retentionTime: 10000 },
    function (input: SanitySyncWorkflowInput) {
        const result = step(input)

        return new WorkflowResponse(result)
    }
)

export const sanityWorkflows: Record<SanityWorkflowType, ReturnType<typeof createSanityWorkflow>> = {
    product: createSanityWorkflow("product", syncProductStep),
    category: createSanityWorkflow("category", syncCategoryStep),
    collection: createSanityWorkflow("collection", syncCollectionStep)
};
