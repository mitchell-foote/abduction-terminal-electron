import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: {
            loadConfigFile: (defaultState: ConfigFile) => Promise<string>
        }
    }
}
