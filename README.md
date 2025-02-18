<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin Sanity
</h1>

Adds Sanity CMS integration to a Medusa V2 backend, closely following the Medusa implementation [guide](https://docs.medusajs.com/resources/integrations/guides/sanity). The following features are available:
- Embedded Sanity Studio
- Sync-all admin page
- Support for redefining/adding schemas for any model
- Built-in support for the following Medusa models, including admin widgets and subscribers for manual and automatic sync:
  - Product: Title, Description
  - Category: Name
  - Collection: Title
  - Shipping Option: Name

## Required configs 
### Plugin options

```
import { SanityPluginOptions, sanityOptimizeDeps } from "medusa-plugin-sanity/modules/sanity"

module.exports = defineConfig({
  ...

  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    vite: () => ({
      optimizeDeps: {
        include: sanityOptimizeDeps
      }
    }),
  },
  plugins: [
    {
      resolve: "medusa-plugin-sanity",
      options: {
        api_token: process.env.SANITY_API_TOKEN,
        project_id: process.env.SANITY_PROJECT_ID,
        dataset: "development",
        backend_url: process.env.MEDUSA_BACKEND_URL,
        api_version: ...,
        extra_schemas: {
          "custom-model": {
            schema: ...,
            step: ...,
            transformForCreate: ...,
            transformForUpdate: ...,
          }
        }
      } satisfies SanityPluginOptions
    },
  ]

```



## Extra schemas

To implement additional schemas, you MUST define a link from your model to the Sanity module([example](src/admin/lib/sanity/schemaTypes/documents/category.ts)).
Optionally you can define subscribers([example](src/subscribers/sanity-category-sync.ts)) and admin widgets([example](src/admin/widgets/sanity-category.tsx)).

The following is an example of the properties that need to be added to the plugin options for a custom schema:

[template](TEMPLATE.md)


## Known issues

- Studio links and refreshes do not work, Medusa at the moment doesn't support catch-all routes in admin pages

- Long loading time(5-10s instead of 1-2s), possibily because of the many optimizeDeps includes required
