import React from 'react'
import { LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder'
import { GameDataInformation, TopLevelGameState } from '../types'
import {
    playTerminalLoginFailSound,
    playTerminalLoginSuccessSound
} from '../helpers/audio_executors'

export type AbductionTerminalLoginProps = Types.GameComponentProps<GameDataInformation>

type AbductionTerminalLoginState = {
    gameState: TopLevelGameState
    username: string
    password: string
}

class AbductionTerminalLogin extends React.Component<
    AbductionTerminalLoginProps,
    AbductionTerminalLoginState
> {
    state: AbductionTerminalLoginState = {
        gameState: TopLevelGameState.NO_STATE,
        username: '',
        password: ''
    }
    componentDidMount(): void {
        this.executeLoginStart()
    }

    moveToStartup = (callback?: () => void) => {
        this.setState({ gameState: TopLevelGameState.STARTUP }, callback)
    }

    moveToLogin = (callback?: () => void) => {
        this.setState({ gameState: TopLevelGameState.LOGIN }, callback)
    }

    moveToTerminal = (callback?: () => void) => {
        this.props.updateOverallState({ ...this.props.overallState, hasLoggedIn: true }, () => {
            this.setState({ gameState: TopLevelGameState.TERMINAL }, callback)
        })
    }

    executeLoginStart = (fast?: boolean) => {
        this.setState({ gameState: TopLevelGameState.NO_STATE }, () => {
            if (fast) {
                this.props.addLine(
                    [`Gamma level terminal interface active, please login...`, 'Username:'],
                    () => {
                        this.setState({ gameState: TopLevelGameState.LOGIN })
                    }
                )
            } else {
                this.props.writeText(
                    { message: `Gamma level terminal interface active, please login...` },
                    () => {
                        this.props.addLine(['Username:'], () => {
                            this.setState({ gameState: TopLevelGameState.LOGIN })
                        })
                    }
                )
            }
        })
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: TopLevelGameState.NO_STATE }, callback)
    }

    resetLogin = () => {
        this.setState({ username: '', password: '' }, () => {
            this.props.clearLines(() => {
                this.executeLoginStart(true)
            })
        })
    }

    handleLoginCommandLineFeedback = (command: string, _: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            if (!command) {
                this.removeCommandLine(() => {
                    this.props.addLine(['No data detected, please try again.'], () => {
                        this.moveToLogin()
                    })
                })
            } else if (!this.state.username) {
                this.setState({ username: fullText.split('> ')[1] }, () => {
                    this.removeCommandLine(() => {
                        this.props.addLine(['Password:'], () => {
                            this.moveToLogin()
                        })
                    })
                })
            } else {
                this.setState({ password: fullText.split('> ')[1] }, () => {
                    this.removeCommandLine(() => {
                        const message = `Attempting Login...`
                        let onFinish
                        let executeSound
                        if (
                            this.state.username === this.props.overallState.username &&
                            this.state.password === this.props.overallState.password
                        ) {
                            executeSound = playTerminalLoginSuccessSound
                            onFinish = () => {
                                this.props.addLine(['Login successful.'], () => {
                                    setTimeout(() => {
                                        this.moveToTerminal()
                                    }, 3000)
                                })
                            }
                        } else {
                            executeSound = playTerminalLoginFailSound
                            onFinish = () => {
                                this.props.addLine(['Login failure. Please try again.'], () => {
                                    setTimeout(() => {
                                        this.resetLogin()
                                    }, 3000)
                                })
                            }
                        }
                        executeSound()
                        this.props.addLine([
                            <LoadingHelper
                                message={message}
                                startPercent={0}
                                endPercent={100}
                                transitionSpeed={20.75}
                                onFinish={onFinish}
                            />
                        ])
                    })
                })
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.gameState === TopLevelGameState.LOGIN && (
                    <TerminalInputHelper onSumbitCommand={this.handleLoginCommandLineFeedback} />
                )}
            </div>
        )
    }
}

export default AbductionTerminalLogin
