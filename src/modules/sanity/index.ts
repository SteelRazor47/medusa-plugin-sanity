import { Module } from "@medusajs/framework/utils"
import SanityModuleService from "./service"

export type {
    DocumentDefinition as SanityDocumentDefinition,
    Rule as SanityRule,
} from "sanity"

export type { ModuleOptions as SanityPluginOptions } from "./service"


export const SANITY_MODULE = "sanity"

export default Module(SANITY_MODULE, {
    service: SanityModuleService,
})
