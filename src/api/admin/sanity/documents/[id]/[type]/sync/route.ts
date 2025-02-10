import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { SANITY_MODULE } from "../../../../../../../../src/modules/sanity"
import SanityModuleService from "../../../../../../../../src/modules/sanity/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const sanityModule = req.scope.resolve(SANITY_MODULE) as SanityModuleService
    const workflows = sanityModule.getWorkflows()
    const { transaction } = await workflows[req.params.type](req.scope)
        .run({
            input: { ids: [req.params.id] },
        })

    res.json({ transaction_id: transaction.transactionId })
}
