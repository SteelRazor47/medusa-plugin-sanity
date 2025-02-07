/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import sanityConfig from '../../../../sanity.config'
import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Sanity } from '@medusajs/icons'

// export const dynamic = 'force-static'

// export { metadata, viewport } from 'next-sanity/studio'

export const config = defineRouteConfig({
    label: "Sanity - Studio",
    icon: Sanity,
})

export default function StudioPage() {
    return <NextStudio config={sanityConfig} />
}
