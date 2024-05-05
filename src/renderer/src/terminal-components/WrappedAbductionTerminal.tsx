import React from 'react'
import { ASCIIArt, GameDataInformation, Log, ResearchData } from '../types'
import { GameWrapper } from 'react-terminal-game-builder'
import AbductionTerminal from './TerminalAccess'
import TerminalLogin from './TerminalLogin'
import { Fade } from 'react-awesome-reveal'
import './wrapped-abduction.css'
import { MatrixRainV12 } from '../helpers/Matrix'
import HackerArt from '../ascii-art/HackerArt'
import DatabaseAsciiArt from '../ascii-art/DatabaseArt'
import LogsAsciiArt from '../ascii-art/LogsArt'
import NetworkAsciiArt from '../ascii-art/NetworkArt'
interface WrappedAbductionTerminalProps {
    logs: Log[]
    researchData: ResearchData[]
    username: string
    password: string
    overrideCode: string
}

interface WrappedAbductionTerminalState {
    gameData: GameDataInformation
    currentImgUrl?: string
    asciiArt: ASCIIArt
}

export class WrappedAbductionTerminal extends React.Component<
    WrappedAbductionTerminalProps,
    WrappedAbductionTerminalState
> {
    constructor(props: WrappedAbductionTerminalProps) {
        super(props)
        this.state = {
            gameData: {
                hasLoggedIn: false,
                hasHackedAccount: false,
                hasSystemCrashed: false,
                username: this.props.username,
                password: this.props.password,
                logs: this.props.logs || [],
                researchData: this.props.researchData || [],
                overrideCode: this.props.overrideCode,
                onUpdateImageArea: this.updateImageArea,
                updateBackgroundAscii: (ascii: ASCIIArt) => {
                    this.setState({ asciiArt: ascii })
                }
            },
            asciiArt: ASCIIArt.NETWORK
        }
    }
    state: WrappedAbductionTerminalState

    componentDidMount(): void {
        this.moveToLogin()
    }

    moveToLogin = (callback?: () => void) => {
        this.setState({ gameData: { ...this.state.gameData, hasLoggedIn: false } }, callback)
    }

    updateImageArea = (imgUrl?: string, callback?: () => void) => {
        this.setState({ currentImgUrl: imgUrl }, callback)
    }

    moveToTerminal = (callback?: () => void) => {
        this.setState({ gameData: { ...this.state.gameData, hasLoggedIn: true } }, callback)
    }

    moveToTerminalOverload = (callback?: () => void) => {
        this.setState({ gameData: { ...this.state.gameData, hasLoggedIn: true } }, callback)
    }

    generateAsciiArt = () => {
        switch (this.state.asciiArt) {
            case ASCIIArt.NETWORK:
                return <NetworkAsciiArt />
            case ASCIIArt.DATABASE:
                return <DatabaseAsciiArt />
            case ASCIIArt.LOGS:
                return <LogsAsciiArt />
            default:
                return <HackerArt />
        }
    }

    render() {
        return (
            <React.Fragment>
                {!this.state.gameData.hasLoggedIn && (
                    <Fade duration={2000}>
                        <div style={{ width: '75vw', height: '75vh' }}>
                            <GameWrapper
                                overallState={this.state.gameData}
                                onUpdateExternalState={(state, callback) => {
                                    this.setState({ gameData: state }, callback)
                                }}
                                startingComponent={TerminalLogin}
                            />
                        </div>
                    </Fade>
                )}
                {this.state.gameData.hasLoggedIn && (
                    <Fade duration={2000}>
                        <div
                            className={`matrix ${this.state.gameData.hasSystemCrashed && 'glitch'}`}
                        >
                            <MatrixRainV12
                                useRed={this.state.gameData.hasSystemCrashed}
                                useYellow={
                                    this.state.gameData.hasHackedAccount &&
                                    !this.state.gameData.hasSystemCrashed
                                }
                            />
                        </div>
                        <div
                            style={{ zIndex: 90000 }}
                            className={`terminal-grid-parent ${this.state.gameData.hasSystemCrashed && 'glitch'} ${this.state.gameData.hasHackedAccount && !this.state.gameData.hasSystemCrashed && 'all-yellow'} ${this.state.gameData.hasSystemCrashed && 'all-red'}`}
                        >
                            <div className="terminal">
                                <GameWrapper
                                    overallState={this.state.gameData}
                                    onUpdateExternalState={(state, callback) => {
                                        this.setState({ gameData: state }, callback)
                                    }}
                                    startingComponent={AbductionTerminal}
                                />
                            </div>
                            <div id="image-holder" className="image">
                                {this.state.currentImgUrl && (
                                    <img
                                        style={{ objectFit: 'fill', width: '100%' }}
                                        src={this.state.currentImgUrl}
                                        alt="current"
                                    />
                                )}
                                {!this.state.currentImgUrl && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            width: '100%',
                                            overflow: 'hidden',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}
                                    >
                                        {this.generateAsciiArt()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Fade>
                )}
            </React.Fragment>
        )
    }
}

export default WrappedAbductionTerminal
