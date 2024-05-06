import { useEffect, useMemo, useState } from 'react'
import { FormGroup, Input, Label, Spinner } from 'reactstrap'
import { AvailableFlight, AvailableServer } from 'src/shared/types'

export type ThoriumConnectorProps = {
    onUpdateSelectedServer: (server: AvailableServer) => void
    onUpdateSelectedFlight: (flight: AvailableFlight) => void
    onUpdateShipSystems: (systems: { id: string; type: string }[]) => void
    selectedServer?: AvailableServer
    selectedFlight?: AvailableFlight
}

export const ThoriumConnector: React.FC<ThoriumConnectorProps> = ({
    onUpdateSelectedServer,
    onUpdateSelectedFlight,
    onUpdateShipSystems,
    selectedServer,
    selectedFlight
}) => {
    const [availableServers, setAvailableServers] = useState<AvailableServer[]>([])
    const [availableFlights, setAvailableFlights] = useState<AvailableFlight[]>([])
    useEffect(() => {
        window.electron.ipcRenderer.on('updateServers', (_, servers) => {
            setAvailableServers(servers)
        })
        window.electron.ipcRenderer.send('getServers')
    }, [])
    useEffect(() => {
        if (selectedServer) {
            window.api.getFlights(selectedServer.url).then((flights) => {
                console.log('Flights: ', flights)
                setAvailableFlights(flights)
            })
        }
    }, [selectedServer])
    useEffect(() => {
        if (selectedFlight && selectedServer) {
            window.api
                .getFlightSystems(selectedServer.url, selectedFlight.simulator.id)
                .then((systems) => {
                    onUpdateShipSystems(systems)
                })
        }
    }, [selectedFlight, selectedServer])
    const serverMap = useMemo(() => {
        return availableServers.reduce(
            (acc, server) => {
                acc[server.url] = server
                return acc
            },
            {} as Record<string, AvailableServer>
        )
    }, [availableServers])

    const flightMap = useMemo(() => {
        if (!availableFlights) {
            return {}
        } else {
            return (
                availableFlights &&
                availableFlights.reduce(
                    (acc, flight) => {
                        acc[flight.id] = flight
                        return acc
                    },
                    {} as Record<string, AvailableFlight>
                )
            )
        }
    }, [availableFlights])
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Available Thorium Connections</h2>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    {availableServers.length > 0 && (
                        <FormGroup>
                            <Label for="serverSelect">Select a server</Label>
                            <Input
                                id="serverSelect"
                                type="select"
                                value={selectedServer?.url || ''}
                                onChange={(e) => {
                                    e.target.value &&
                                        onUpdateSelectedServer(serverMap[e.target.value])
                                }}
                            >
                                <option></option>
                                {availableServers.map((server) => {
                                    return (
                                        <option key={server.url} value={server.url}>
                                            {server.name}
                                        </option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    )}
                    {availableServers.length === 0 && <Spinner color="success" />}
                    {selectedServer && selectedServer.name && !availableFlights.length && (
                        <Spinner color="success" />
                    )}
                    {selectedServer && selectedServer.name && availableFlights.length > 0 && (
                        <FormGroup>
                            <Label for="flightSelect">Select a flight</Label>
                            <Input
                                id="flightSelect"
                                type="select"
                                value={selectedFlight?.id || ''}
                                onChange={(e) => {
                                    e.target.value &&
                                        onUpdateSelectedFlight(flightMap[e.target.value])
                                }}
                            >
                                <option></option>
                                {availableFlights.map((flight) => {
                                    return (
                                        <option key={flight.id} value={flight.id}>
                                            {flight.name}
                                        </option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ThoriumConnector
