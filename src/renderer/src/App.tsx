import { Route, Link, Routes, HashRouter } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import WrappedAbductionTerminal from './terminal-components/WrappedAbductionTerminal'
import { playTerminalTypeSound } from './helpers/audio_executors'

import { generateDefaultConfig } from './default-config'
import { ConfigFile } from './types'
import ThoriumConnector from './thorium-connectors/ThoriumConnector'
import { AvailableFlight, AvailableServer, ThoriumData } from 'src/shared/types'

const App: React.FC = () => {
    const [config, setConfig] = useState<ConfigFile>()
    // const [servers, setServers] = useState<string[]>([])
    const [selectedServer, setSelectedServer] = useState<AvailableServer>()
    const [selectedFlight, setSelectedFlight] = useState<AvailableFlight>()
    const [shipSystems, setShipSystems] = useState<{ id: string; type: string }[]>()

    useEffect(() => {
        window.api.loadConfigFile(generateDefaultConfig()).then((value) => {
            setConfig(JSON.parse(value))
        })
    }, [])
    const thoriumInfo = useMemo<ThoriumData | undefined>(() => {
        if (selectedServer && selectedFlight && shipSystems) {
            return {
                selectedServer,
                selectedFlight,
                shipSystems
            }
        } else {
            return undefined
        }
    }, [selectedServer, selectedFlight, shipSystems])

    return (
        <>
            <HashRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    color: 'limegreen'
                                }}
                            >
                                <span>
                                    Remember the username is {config?.username} and the password is{' '}
                                    {config?.password}{' '}
                                </span>
                                <span>Special remote access code is: {config?.overrideCode}</span>
                                <ThoriumConnector
                                    onUpdateSelectedFlight={(flight) => {
                                        setSelectedFlight(flight)
                                    }}
                                    onUpdateSelectedServer={(server) => {
                                        setSelectedServer({ ...server })
                                    }}
                                    onUpdateShipSystems={(systems) => {
                                        setShipSystems(systems)
                                    }}
                                    selectedFlight={selectedFlight}
                                    selectedServer={selectedServer}
                                />
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
                                    thoriumData={thoriumInfo}
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
