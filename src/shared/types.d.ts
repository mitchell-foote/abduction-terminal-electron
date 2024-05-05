export interface Log {
    name: string
    description: string
    message: string
    restricted: boolean
}

export interface ResearchData {
    name: string
    message: string
    description: string
    imageUrl?: string
}

export type ConfigFile = {
    username: string
    password: string
    logs: Log[]
    researchData: ResearchData[]
    overrideCode: string
}
