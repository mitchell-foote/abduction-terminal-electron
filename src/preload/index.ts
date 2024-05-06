import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import { ConfigFile } from '../shared/types'
import {
    getFlightSystems,
    getFlights,
    prepDefaultImageFiles,
    sendLRM,
    translateImagePaths
} from './helpers'

const CONFIG_FILE_DIRECTORY = process.env.HOME + '/Documents/abduction-terminal'
const CONFIG_FILE_PATH = CONFIG_FILE_DIRECTORY + '/config.json'
const ASSET_FOLDER = CONFIG_FILE_DIRECTORY + '/assets'

// Custom APIs for renderer
const api = {
    loadConfigFile: async (defaultState: ConfigFile): Promise<string> => {
        try {
            const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
            if (data) {
                const parsedFile = JSON.parse(data)
                const translatedFile = await translateImagePaths(parsedFile, ASSET_FOLDER)
                return JSON.stringify(translatedFile)
            } else {
                fs.mkdirSync(CONFIG_FILE_DIRECTORY, { recursive: true })
                fs.mkdirSync(ASSET_FOLDER, { recursive: true })
                const newFile = await prepDefaultImageFiles(defaultState, ASSET_FOLDER)
                const fileData = JSON.stringify({ ...newFile })
                const parsedFile = await translateImagePaths(newFile, ASSET_FOLDER)
                const data = JSON.stringify(parsedFile)
                fs.writeFileSync(CONFIG_FILE_PATH, fileData)
                return data
            }
        } catch (e) {
            fs.mkdirSync(CONFIG_FILE_DIRECTORY, { recursive: true })
            fs.mkdirSync(ASSET_FOLDER, { recursive: true })
            const newFile = await prepDefaultImageFiles(defaultState, ASSET_FOLDER)
            const fileData = JSON.stringify({ ...newFile })
            const parsedFile = await translateImagePaths(newFile, ASSET_FOLDER)
            const data = JSON.stringify(parsedFile)
            fs.writeFileSync(CONFIG_FILE_PATH, fileData)
            return data
        }
    },
    getFlights: async (serverUri: string) => {
        const flights = await getFlights(serverUri)
        const newFlights = flights.map((flight) => {
            return {
                id: flight.id,
                name: flight.name,
                simulator: flight.simulators[0]
            }
        })
        return newFlights
    },
    getFlightSystems: async (serverUri: string, simulatorId: string) => {
        return await getFlightSystems(serverUri, simulatorId)
    },
    sendLRM: async (
        serverUrl: string,
        lrmSystemId: string,
        LRM: { sender: string; crew: boolean; decoded: boolean; message: string }
    ) => {
        return await sendLRM(serverUrl, lrmSystemId, LRM)
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
