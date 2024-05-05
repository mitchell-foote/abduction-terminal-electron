import { Route, Link, Routes, HashRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import WrappedAbductionTerminal from './terminal-components/WrappedAbductionTerminal'
import { playTerminalTypeSound } from './helpers/audio_executors'

import { generateDefaultConfig } from './default-config'
import { ConfigFile } from './types'

const App: React.FC = () => {
    const [config, setConfig] = useState<ConfigFile>()

    useEffect(() => {
        window.api.loadConfigFile(generateDefaultConfig()).then((value) => {
            setConfig(JSON.parse(value))
        })
    }, [])
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>
                                    Remember the username is {config?.username} and the password is{' '}
                                    {config?.password}{' '}
                                </span>
                                <span>Special remote access code is: {config?.overrideCode}</span>
                                <Link to="/terminal">Click here to begin</Link>
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/terminal"
                        element={
                            <div onKeyDown={() => playTerminalTypeSound()}>
                                <WrappedAbductionTerminal
                                    logs={config?.logs || []}
                                    researchData={config?.researchData || []}
                                    username={config?.username || 'username'}
                                    password={config?.password || 'password'}
                                    overrideCode={config?.overrideCode || 'override'}
                                />
                            </div>
                        }
                    ></Route>
                </Routes>
            </HashRouter>
        </>
    )
}

export default App
