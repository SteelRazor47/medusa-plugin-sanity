import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { SANITY_MODULE } from "../../../../../src/modules/sanity"
import SanityModuleService from "../../../../../src/modules/sanity/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const workflowEngine = req.scope.resolve(
        Modules.WORKFLOW_ENGINE
    )
    const sanityModule = req.scope.resolve(SANITY_MODULE) as SanityModuleService
    const workflows = sanityModule.getWorkflows()

    const [executions, count] = await workflowEngine
        .listAndCountWorkflowExecutions(
            {
                workflow_id: Object.values(workflows).map(w => w.getName()),
            },
            { order: { created_at: "DESC" } }
        )

    res.json({ workflow_executions: executions, count })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const sanityModule = req.scope.resolve(SANITY_MODULE) as SanityModuleService
    const workflows = sanityModule.getWorkflows()

    const transactions = await Promise.all(
        Object.values(workflows).map(w =>
            w(req.scope)
                .run({ input: {}, })
                .then(t => t.transaction.transactionId)
        )
    )

    res.json({ transaction_ids: transactions })
}
