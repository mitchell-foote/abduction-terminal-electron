import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: {
            loadConfigFile: (defaultState: ConfigFile) => Promise<string>
            getFlights: (serverUri: string) => Promise<
                {
                    id: string
                    name: string
                    simulator: {
                        id: string
                    }
                }[]
            >
            getFlightSystems: (
                serverUri: string,
                simulatorId: string
            ) => Promise<{ id: string; type: string }[]>
            sendLRM: (
                serverUrl: string,
                lrmSystemId: string,
                LRM: { sender: string; crew: boolean; decoded: boolean; message: string }
            ) => Promise<unknown>
        }
    }
}
