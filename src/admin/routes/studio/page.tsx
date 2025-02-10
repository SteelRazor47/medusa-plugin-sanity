import { defineRouteConfig } from '@medusajs/admin-sdk'
import { usePluginConfig } from '../../hooks/sanity'
import { defineConfig, Studio } from 'sanity'
import { visionTool } from '@sanity/vision'
import { StructureResolver, structureTool } from 'sanity/structure'
import { Sanity } from '@medusajs/icons'
import { useMemo } from 'react'

const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items(S.documentTypeListItems())

export default function StudioPage() {
    const { data } = usePluginConfig()

    const sanityConfig = useMemo(() => !data ? null : defineConfig({
        basePath: '/app/studio',
        projectId: data.projectId,
        dataset: data.dataset,
        schema: data.schema,
        plugins: [
            structureTool({ structure }),
            visionTool({ defaultApiVersion: data.apiVersion }),
        ],
    }), [data])

    if (!sanityConfig)
        return <div>Loading...</div>

    return (
        <div className="h-[100vh]">
            <Studio config={sanityConfig} />
        </div>
    )
}

export const config = defineRouteConfig({
    label: "Sanity - Studio",
    icon: Sanity,
})
