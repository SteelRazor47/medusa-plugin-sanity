import {
    QueryKey,
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { FetchError } from "@medusajs/js-sdk"
import { SchemaPluginOptions } from "sanity"

export const useTriggerSanityEntitySync = (
    id: string,
    type: string,
    options?: UseMutationOptions
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () =>
            sdk.client.fetch(`/admin/sanity/documents/${id}/${type}/sync`, {
                method: "post",
            }),
        onSuccess: (data: any, variables: any, context: any) => {
            queryClient.invalidateQueries({
                queryKey: [`sanity_document`, `sanity_document_${id}`],
            })

            options?.onSuccess?.(data, variables, context)
        },
        ...options,
    })
}





export const useSanityDocument = (
    id: string,
    query?: Record<any, any>,
    options?: Omit<
        UseQueryOptions<
            Record<any, any>,
            FetchError,
            { sanity_document: Record<any, any>; studio_url: string },
            QueryKey
        >,
        "queryKey" | "queryFn"
    >
) => {
    const fetchSanityProductStatus = async (query?: Record<any, any>) => {
        return await sdk.client.fetch<Record<any, any>>(
            `/admin/sanity/documents/${id}`,
            {
                query,
            }
        )
    }

    const { data, ...rest } = useQuery({
        queryFn: async () => fetchSanityProductStatus(query),
        queryKey: [`sanity_document_${id}`],
        ...options,
    })

    return { ...data, ...rest }
}


export const useTriggerSanitySync = (options?: UseMutationOptions) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () =>
            sdk.client.fetch(`/admin/sanity/syncs`, {
                method: "post",
            }),
        onSuccess: (data: any, variables: any, context: any) => {
            queryClient.invalidateQueries({
                queryKey: [`sanity_sync`],
            })

            options?.onSuccess?.(data, variables, context)
        },
        ...options,
    })
}

export const useSanitySyncs = (
    query?: Record<any, any>,
    options?: Omit<
        UseQueryOptions<
            Record<any, any>,
            FetchError,
            { workflow_executions: Record<any, any>[] },
            QueryKey
        >,
        "queryKey" | "queryFn"
    >
) => {
    const fetchSanitySyncs = async (query?: Record<any, any>) => {
        return await sdk.client.fetch<Record<any, any>>(`/admin/sanity/syncs`, {
            query,
        })
    }

    const { data, ...rest } = useQuery({
        queryFn: async () => fetchSanitySyncs(query),
        queryKey: [`sanity_sync`],
        ...options,
    })

    return { ...data, ...rest }
}

export type PluginOptions = { projectId: string, dataset: string, apiVersion: string, schema: SchemaPluginOptions }
export const usePluginConfig = (
    query?: Record<any, any>,
    options?: Omit<
        UseQueryOptions<
            Record<any, any>,
            FetchError,
            PluginOptions,
            QueryKey
        >,
        "queryKey" | "queryFn"
    >
) => {
    const fetchSanityConfig = async (query?: Record<any, any>) => {
        return await sdk.client.fetch<PluginOptions>(
            `/admin/sanity/config`,
            {
                query,
            }
        )
    }

    const { data, ...rest } = useQuery({
        queryFn: async () => fetchSanityConfig(query),
        queryKey: [`sanity_config`],
        ...options,
    })

    return { data, ...rest }
}
