'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/admin/lib/sanity/env'
import { schema } from './src/admin/lib/sanity/schemaTypes'
import { structure } from './src/admin/lib/sanity/struct'

export default defineConfig({
    basePath: '/app/studio',
    projectId,
    dataset,
    // Add and edit the content schema in the './sanity/schemaTypes' folder
    schema,
    plugins: [
        structureTool({ structure }),
        // Vision is for querying with GROQ from inside the Studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
    ],
})
