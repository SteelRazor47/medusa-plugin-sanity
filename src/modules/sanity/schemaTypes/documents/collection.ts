import { DocumentDefinition } from "sanity"

const collectionSchema: DocumentDefinition = {
    type: "document",
    name: "collection",
    title: "Collection Page",
    fields: [
        {
            name: "title",
            type: "string",
        },
        {
            group: "content",
            name: "specs",
            of: [
                {
                    fields: [
                        { name: "lang", title: "Language", type: "string" },
                        { name: "title", title: "Title", type: "string" },
                    ],
                    name: "spec",
                    type: "object",
                },
            ],
            type: "array",
        },
        {
            fields: [
                { name: "title", title: "Title", type: "string" },
                {
                    name: "products",
                    of: [{ to: [{ type: "product" }], type: "reference" }],
                    title: "Addons",
                    type: "array",
                    validation: (Rule) => Rule.max(3),
                },
            ],
            name: "addons",
            type: "object",
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
    groups: [{
        default: true,
        name: "content",
        title: "Content",
    }],
}

export default collectionSchema
