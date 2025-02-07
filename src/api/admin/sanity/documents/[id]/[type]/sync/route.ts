import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import {
    sanityWorkflows,
} from "src/workflows/sanity-sync-products"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { transaction } = await sanityWorkflows[req.params.type](req.scope)
        .run({
            input: { ids: [req.params.id] },
        })

    res.json({ transaction_id: transaction.transactionId })
}
