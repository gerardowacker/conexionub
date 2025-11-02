"use client"

import React from 'react'
import ResourceList from '@/components/list/ResourceList'
import {Resource} from "@/types/resources";

type Props = {
    initialResources?: Resource[]
    initialHasMore?: boolean
    initialLastResource?: string | null
    authorName: string
    pageSize: number
    desc: boolean
}

export default function ResourcesListWrapper({
                                                 initialResources = [],
                                                 initialHasMore = false,
                                                 initialLastResource = null,
                                                 authorName,
                                                 pageSize,
                                                 desc,
                                             }: Props) {
    const baseEndpoint = '/resources'
    const initialQuery = `?author=${encodeURIComponent(authorName)}&pageSize=${pageSize}&desc=${desc}`

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
