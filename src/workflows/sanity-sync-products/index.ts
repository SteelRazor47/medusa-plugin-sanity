import {
    createWorkflow,
    StepFunction,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { syncCategoryStep, syncCollectionStep, syncProductStep, SyncStepInput } from "./steps/sync"

type SanitySyncWorkflowInput = {
    ids?: string[];
};

export type StepType = StepFunction<SyncStepInput, { total: number; }>

export type ReturnSanityWorkflow = ReturnType<typeof createSanityWorkflow>

export const createSanityWorkflow = (type: string, step: StepType) => createWorkflow(
    { name: `sanity-sync-${type}`, retentionTime: 10000 },
    function (input: SanitySyncWorkflowInput) {
        const result = step(input)

        return new WorkflowResponse(result)
    }
)

export const sanityWorkflows: Record<string, ReturnSanityWorkflow> = {
    product: createSanityWorkflow("product", syncProductStep),
    category: createSanityWorkflow("category", syncCategoryStep),
    collection: createSanityWorkflow("collection", syncCollectionStep)
};
