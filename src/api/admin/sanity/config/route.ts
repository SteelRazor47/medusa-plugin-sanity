import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { schema } from "../../../../admin/lib/sanity/schemaTypes"
import { SANITY_MODULE } from "src/modules/sanity"
import SanityModuleService from "src/modules/sanity/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const sanityModule = req.scope.resolve(SANITY_MODULE) as SanityModuleService
    const options = sanityModule.getOptions()
    if (!options || !Array.isArray(schema.types))
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Plugin options not found")

    const schemas = Object.values(options.extra_schemas ?? {}).flatMap((schema) => schema.schema)
    const mergedSchemaTypes = schema.types.concat(schemas ?? [])
    const typeNames = mergedSchemaTypes.map((type) => type.name)

    res.json({
        projectId: options.project_id,
        dataset: options.dataset,
        apiVersion: options.api_version,
        schema: {
            types: mergedSchemaTypes,
            templates: (templates) => templates.filter(
                (template) => !typeNames.includes(template.schemaType)
            ),
        },
    })
}
