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

export enum TopLevelGameState {
    STARTUP,
    LOGIN,
    LOGS,
    RESEARCH,
    TERMINAL,
    TERMINAL_OVERLOAD,
    NO_STATE
}

export interface GameDataInformation {
    hasLoggedIn: boolean
    hasHackedAccount: boolean
    hasSystemCrashed: boolean
    username: string
    password: string
    overrideCode: string
    logs: Log[]
    researchData: ResearchData[]
    onUpdateImageArea: (imgUrl?: string, callback?: () => void) => void
    updateBackgroundAscii: (ascii: ASCIIArt) => void
}

export enum ASCIIArt {
    NETWORK,
    DATABASE,
    LOGS,
    HACKER
}

export type ConfigFile = {
    username: string
    password: string
    logs: Log[]
    researchData: ResearchData[]
    overrideCode: string
}
