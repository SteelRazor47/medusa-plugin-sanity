import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import {
    sanityWorkflows,
} from "src/workflows/sanity-sync-products"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const workflowEngine = req.scope.resolve(
        Modules.WORKFLOW_ENGINE
    )

    const [executions, count] = await workflowEngine
        .listAndCountWorkflowExecutions(
            {
                workflow_id: Object.values(sanityWorkflows).map(w => w.getName()),
            },
            { order: { created_at: "DESC" } }
        )

    res.json({ workflow_executions: executions, count })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const transactions = await Promise.all(
        Object.values(sanityWorkflows).map(w =>
            w(req.scope)
                .run({ input: {}, })
                .then(t => t.transaction.transactionId)
        )
    )

    res.json({ transaction_ids: transactions })
}
