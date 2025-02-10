import { Module } from "@medusajs/framework/utils"
import SanityModuleService, { ModuleOptions } from "./service"

export type { DocumentDefinition as SanityDocumentDefinition } from "sanity"
export const SANITY_MODULE = "sanity"

export type SanityPluginOptions = ModuleOptions

export default Module(SANITY_MODULE, {
    service: SanityModuleService,
})
