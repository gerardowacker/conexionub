"use client"

import React from 'react'
import ResourceList from '@/components/list/ResourceList'
import {Resource} from "@/types/resources";

type Props = {
    initialResources?: Resource[]
    initialHasMore?: boolean
    initialLastResource?: string | null
    slug: string
    pageSize: number
    desc: boolean
}

export default function ResourcesListWrapper({
                                                 initialResources = [],
                                                 initialHasMore = false,
                                                 initialLastResource = null,
                                                 slug,
                                                 pageSize,
                                                 desc,
                                             }: Props) {
    const baseEndpoint = `/collection/${slug}`
    const initialQuery = `?pageSize=${pageSize}&desc=${desc}`

    return (
        <ResourceList
            initialResources={initialResources}
            initialHasMore={initialHasMore}
            initialLastResource={initialLastResource}
            baseEndpoint={baseEndpoint}
            initialQuery={initialQuery}
        />
    )
}
