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
