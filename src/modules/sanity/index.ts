import { Module } from "@medusajs/framework/utils"
import SanityModuleService, { ModuleOptions } from "./service"

export type {
    DocumentDefinition as SanityDocumentDefinition,
    Rule as SanityRule,
} from "sanity"
export const SANITY_MODULE = "sanity"

export type SanityPluginOptions = ModuleOptions

export const sanityOptimizeDeps = [
    "qs", "styled-components",
    "sanity", "react-is",
    "react-compiler-runtime",
    "void-elements", "@sanity/mutator",
    "@rexxars/react-json-inspector",
    "sanity/router", "@sanity/schema",
    "prop-types", "lodash/*.js",
    "debug/**/*.js", "humanize-list",
    "leven", "object-inspect",
    "react-fast-compare", "speakingurl",
    "quick-lru", "shallow-equals"
]

export default Module(SANITY_MODULE, {
    service: SanityModuleService,
})
