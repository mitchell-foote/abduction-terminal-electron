import { ConfigFile } from '../shared/types'
import fs from 'fs/promises'
import mime from 'mime'

export async function prepDefaultImageFiles(defaultState: ConfigFile, assetFolder: string) {
    const imageFiles = defaultState.researchData.map((researchData) => researchData.imageUrl)
    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        if (imageFile) {
            const imageFileName = 'generic_image.png'
            const newImageFilePath = assetFolder + '/' + imageFileName
            try {
                await fs.writeFile(newImageFilePath, imageFile, 'base64')
            } catch (e) {
                console.log(e)
            }

            defaultState.researchData[i].imageUrl = imageFileName
        }
    }
    return defaultState
}

export async function translateImagePaths(state: ConfigFile, assetFolder: string) {
    const imageFiles = state.researchData.map((researchData) => researchData.imageUrl)
    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        if (imageFile) {
            const imageFileName = imageFile
            const newImageFilePath = assetFolder + '/' + imageFileName
            const memeType = mime.getType(newImageFilePath)
            const base64DataUri = await fs.readFile(newImageFilePath, 'base64')
            const base64Data = `data:${memeType};base64,${base64DataUri}`
            state.researchData[i].imageUrl = base64Data
        }
    }
    return { ...state }
}

export async function getFlights(
    serverUri: string
): Promise<{ id: string; name: string; simulators: { id: string }[] }[]> {
    const urlObj = new URL(serverUri)
    const correctUrl = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}/graphql`
    const query = `{
        flights {
            id
            name
            simulators {
                id
            }
        }
    }`
    const response = await fetch(correctUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data.flights
}

export async function getFlightSystems(serverUrl: string, simulatorId: string) {
    const urlObj = new URL(serverUrl)
    const correctUrl = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}/graphql`
    const query = `{
        systems(simulatorId: "${simulatorId}") {
            id
            type
        }
    }`
    const response = await fetch(correctUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json.data.systems
}

export async function sendLRM(
    serverUrl: string,
    lrmSystemId: string,
    LRM: { sender: string; crew: boolean; decoded: boolean; message: string }
) {
    const urlObj = new URL(serverUrl)
    const correctUrl = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}/graphql`
    const query = `mutation sendLRM($id: ID!, $sender: String, $crew: Boolean!, $message: String!, $decoded: Boolean) {
        sendLongRangeMessage(id: $id, crew: $crew, sender: $sender, message: $message, decoded: $decoded)
    }
    `
    const variables = {
        crew: LRM.crew,
        decoded: LRM.decoded,
        sender: LRM.sender,
        message: LRM.message,
        id: lrmSystemId
    }
    const response = await fetch(correctUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables, operationName: 'sendLRM' })
    })
    const json = await response.json()
    return json.data
}
