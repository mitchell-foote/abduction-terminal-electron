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

export type AvailableServer = {
    name: string
    url: string
}

export type AvailableFlight = {
    id: string
    name: string
    simulator: {
        id: string
    }
}

export type ThoriumData = {
    selectedServer: AvailableServer
    selectedFlight: AvailableFlight
    shipSystems: { id: string; type: string }[]
}
