import React from 'react'
import {
    ConsolePicker,
    LoadingHelper,
    TerminalInputHelper,
    Types
} from 'react-terminal-game-builder'
import { ASCIIArt, GameDataInformation, TopLevelGameState } from '../types'
import {
    playTerminalCardChangeSound,
    playTerminalLogoutSound,
    playTerminalDownloadSound
} from '../helpers/audio_executors'

export type AbductionTerminalProps = Types.GameComponentProps<GameDataInformation>

type AbductionTerminalState = {
    gameState: TopLevelGameState
}

class AbductionTerminal extends React.Component<AbductionTerminalProps, AbductionTerminalState> {
    state: AbductionTerminalState = {
        gameState: TopLevelGameState.TERMINAL
    }
    componentDidMount(): void {
        this.executeTerminalStart()
    }

    executeTerminalStart = () => {
        playTerminalCardChangeSound()
        this.setState({ gameState: TopLevelGameState.NO_STATE }, () => {
            setTimeout(() => {
                this.props.addLine(['Starting terminal...'], () => {
                    this.goToCommandLine()
                })
            }, 3000)
        })
    }

    goToCommandLine = (fullText: boolean = true) => {
        playTerminalCardChangeSound()

        this.setState({ gameState: TopLevelGameState.NO_STATE }, () => {
            this.props.overallState.updateBackgroundAscii(ASCIIArt.NETWORK)
            if (fullText) {
                this.props.writeText(
                    {
                        message: `Command line ready, please type "help" for a list of available commands`
                    },
                    () => {
                        this.setState({ gameState: TopLevelGameState.TERMINAL })
                    }
                )
            } else {
                this.setState({ gameState: TopLevelGameState.TERMINAL })
            }
        })
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: TopLevelGameState.NO_STATE }, callback)
    }

    doHelp = () => {
        playTerminalCardChangeSound()
        const helpArray: unknown[] = []
        helpArray.push('Available commands:', '')
        helpArray.push('logout - Logout of the terminal', `example: "> logout"`, '', '')
        helpArray.push('clear - Clear the terminal screen', `example: "> clear"`, '', '')
        helpArray.push('help - Display this help message', `example: "> help"`, '', '')
        this.props.overallState.hasHackedAccount &&
            helpArray.push(
                'crash_system - Crash the system. Warning, only use when you are done using the terminal',
                `example: "> crash_system"`,
                '',
                ''
            )
        helpArray.push('logs - Access available logs', `example: "> logs"`, '', '')
        this.props.overallState.hasHackedAccount &&
            helpArray.push(
                'research - Access available research data',
                `example: "> research"`,
                '',
                ''
            )
        !this.props.overallState.hasHackedAccount &&
            helpArray.push(
                'remote_access <access_code> - Execute remote access',
                `example: "> remote_access name_of_access_code"`,
                '',
                ''
            )
        this.props.addLine(helpArray, () => {
            this.goToCommandLine(false)
        })
    }

    doLogout = () => {
        this.removeCommandLine(() => {
            this.props.clearLines(() => {
                playTerminalLogoutSound()
                this.props.writeText({ message: `Logging out...` }, () => {
                    this.props.updateOverallState({
                        ...this.props.overallState,
                        hasLoggedIn: false
                    })
                })
            })
        })
    }

    generateJammedString = (length: number) => {
        const unfinishedAscii = '░'
        const partialAscii = '▒'
        const completeAscii = '▓'
        const jammedStringArray = [unfinishedAscii, partialAscii, completeAscii, ' ', ' ']
        let jammedString = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * 4)
            jammedString += jammedStringArray[randomIndex]
        }
        return jammedString
    }

    doCrashSystem = () => {
        this.removeCommandLine(() => {
            this.props.clearLines(() => {
                this.props.writeText(
                    {
                        message: 'WARNING! SYSTEM CRASH IMMINENT...',
                        color: 'red',
                        keystrokeTiming: 150
                    },
                    () => {
                        this.props.updateOverallState(
                            { ...this.props.overallState, hasSystemCrashed: true },
                            () => {
                                this.props.overallState.updateBackgroundAscii(ASCIIArt.HACKER)
                                this.props.addLine([
                                    <LoadingHelper
                                        message="Crashing system..."
                                        startPercent={0}
                                        endPercent={100}
                                        transitionSpeed={100}
                                        showPercent
                                        color
                                        onFinish={() => {
                                            const repeater = setInterval(
                                                () => this.props.updateScroll(),
                                                100
                                            )

                                            this.props.addLine(['System crashed'], () => {
                                                setTimeout(() => {
                                                    this.props.writeText(
                                                        {
                                                            message:
                                                                this.generateJammedString(10000),
                                                            color: 'red',
                                                            keystrokeTiming: 2
                                                        },
                                                        () => {
                                                            clearInterval(repeater)
                                                        }
                                                    )
                                                }, 3000)
                                            })
                                        }}
                                    />
                                ])
                            }
                        )
                    }
                )
            })
        })
    }

    doRemoteAccess = (args: string[]) => {
        if (this.props.overallState.hasHackedAccount) {
            this.props.addLine(['This account has already been compromised'], () => {
                this.goToCommandLine(false)
            })
        } else {
            if (args.length === 0) {
                this.props.addLine(
                    ['Please provide an access code', 'Example: > remote_access program.exe'],
                    () => {
                        this.goToCommandLine(false)
                    }
                )
            } else {
                if (args[0] === this.props.overallState.overrideCode) {
                    playTerminalCardChangeSound()
                    this.removeCommandLine(() => {
                        this.props.addLine([
                            <LoadingHelper
                                message="Accessing remote server..."
                                startPercent={0}
                                endPercent={100}
                                transitionSpeed={30}
                                onFinish={() => {
                                    playTerminalCardChangeSound()

                                    this.props.addLine([
                                        <LoadingHelper
                                            message="Locating remote executable..."
                                            startPercent={0}
                                            endPercent={100}
                                            transitionSpeed={30}
                                            onFinish={() => {
                                                playTerminalCardChangeSound()

                                                this.props.addLine([
                                                    <LoadingHelper
                                                        message="Executing remote access..."
                                                        startPercent={0}
                                                        endPercent={100}
                                                        onFinish={() => {
                                                            this.props.writeText(
                                                                {
                                                                    message:
                                                                        'WARNING: ACCOUNT IS BEING COMPROMISED',
                                                                    color: 'red'
                                                                },
                                                                () => {
                                                                    playTerminalCardChangeSound()

                                                                    this.props.addLine([
                                                                        <LoadingHelper
                                                                            message="Accessing locked features..."
                                                                            startPercent={0}
                                                                            endPercent={100}
                                                                            color
                                                                            showPercent={true}
                                                                            onFinish={() => {
                                                                                this.props.addLine(
                                                                                    [
                                                                                        'Access granted',
                                                                                        'Account compromised'
                                                                                    ],
                                                                                    () => {
                                                                                        this.props.updateOverallState(
                                                                                            {
                                                                                                ...this
                                                                                                    .props
                                                                                                    .overallState,
                                                                                                hasHackedAccount:
                                                                                                    true
                                                                                            },
                                                                                            () => {
                                                                                                this.props.clearLines(
                                                                                                    () => {
                                                                                                        this.props.writeText(
                                                                                                            {
                                                                                                                message:
                                                                                                                    "Terminal online. New commands and functions are available. Type 'help' for a list of commands."
                                                                                                            },
                                                                                                            () => {
                                                                                                                this.goToCommandLine(
                                                                                                                    false
                                                                                                                )
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }}
                                                                        />
                                                                    ])
                                                                }
                                                            )
                                                        }}
                                                    />
                                                ])
                                            }}
                                        />
                                    ])
                                }}
                            />
                        ])
                    })
                } else {
                    this.props.addLine(['Access denied', 'Incorrect access code'], () => {
                        this.goToCommandLine(false)
                    })
                }
            }
        }
    }

    doUnknownCommand = (command: string) => {
        this.props.addLine(
            [`Unknown command: ${command}`, `Type "help" for a list of available commands`],
            () => {
                this.goToCommandLine(false)
            }
        )
    }

    doClear = () => {
        this.props.clearLines(() => {
            this.goToCommandLine(false)
        })
    }

    doLogs = () => {
        playTerminalCardChangeSound()
        this.setState({ gameState: TopLevelGameState.NO_STATE }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: 'Accessing logs...' }, () => {
                    this.props.addLine(['Logs accessed successfully'], () => {
                        setTimeout(() => {
                            this.setState({ gameState: TopLevelGameState.LOGS }, () =>
                                this.props.overallState.updateBackgroundAscii(ASCIIArt.LOGS)
                            )
                        }, 2000)
                    })
                })
            })
        })
    }

    doAccessDenied = (callback?: () => void) => {
        this.props.addLine(
            [
                '-------------------',
                <span style={{ color: 'red' }}>Access denied</span>,
                <span style={{ color: 'red' }}>Firewall enabled</span>,
                '-------------------'
            ],
            callback
        )
    }

    doResearch = () => {
        playTerminalCardChangeSound()
        this.setState({ gameState: TopLevelGameState.NO_STATE }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: 'Accessing research data...' }, () => {
                    if (this.props.overallState.hasHackedAccount) {
                        this.props.addLine(['Research data accessed successfully'], () => {
                            this.setState({ gameState: TopLevelGameState.RESEARCH }, () =>
                                this.props.overallState.updateBackgroundAscii(ASCIIArt.DATABASE)
                            )
                        })
                    } else {
                        this.doAccessDenied(() => this.goToCommandLine(false))
                    }
                })
            })
        })
    }

    handleCommandLineFeedback = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            switch (command) {
                case 'help':
                    this.doHelp()
                    break
                case 'clear':
                    this.doClear()
                    break
                case 'logs':
                    this.doLogs()
                    break
                case 'research':
                    this.props.overallState.hasHackedAccount && this.doResearch()
                    !this.props.overallState.hasHackedAccount && this.doUnknownCommand(command)
                    break
                case 'crash_system':
                    this.props.overallState.hasHackedAccount && this.doCrashSystem()
                    !this.props.overallState.hasHackedAccount && this.doUnknownCommand(command)
                    break
                case 'remote_access':
                    this.doRemoteAccess(args)
                    break
                case 'logout':
                    this.doLogout()
                    break
                default:
                    this.doUnknownCommand(command)
                    break
            }
        })
    }

    generateLogs = () => {
        const logsArray: Types.OptionChoice[] = []
        this.props.overallState.logs.forEach((log) => {
            logsArray.push({
                name: log.name,
                description: log.description,
                action: () => {
                    if (log.restricted && !this.props.overallState.hasHackedAccount) {
                        this.doAccessDenied(() => {})
                    } else {
                        this.props.addLine(
                            ['-----------------', log.message, '-----------------'],
                            () => {}
                        )
                    }
                }
            })
        })
        logsArray.push({
            name: 'Download',
            description: 'Download all logs',
            action: () => {
                if (!this.props.overallState.hasHackedAccount) {
                    this.doAccessDenied(() => {})
                } else {
                    this.props.writeText({ message: 'Downloading logs...' }, () => {
                        playTerminalDownloadSound()
                        this.removeCommandLine(() => {
                            this.props.addLine([
                                <LoadingHelper
                                    message="Downloading logs..."
                                    startPercent={0}
                                    endPercent={100}
                                    transitionSpeed={20.75}
                                    showPercent={true}
                                    onFinish={() => {
                                        this.props.addLine(['Logs downloaded successfully'], () => {
                                            this.setState({ gameState: TopLevelGameState.LOGS })
                                        })
                                    }}
                                />
                            ])
                        })
                    })
                }
            }
        })
        return logsArray
    }

    generateResearchData = () => {
        const researchArray: Types.OptionChoice[] = []
        this.props.overallState.researchData.forEach((research) => {
            researchArray.push({
                name: research.name,
                description: research.message,
                action: () => {
                    this.props.addLine(
                        ['-----------------', research.message, '-----------------'],
                        () => {
                            this.props.overallState.onUpdateImageArea(research.imageUrl, () => {})
                        }
                    )
                }
            })
        })
        researchArray.push({
            name: 'Download',
            description: 'Download all research data',
            action: () => {
                this.props.writeText({ message: 'Downloading research data...' }, () => {
                    playTerminalDownloadSound()
                    this.removeCommandLine(() => {
                        this.props.addLine([
                            <LoadingHelper
                                message="Downloading research data..."
                                startPercent={0}
                                endPercent={100}
                                transitionSpeed={20.75}
                                showPercent={true}
                                onFinish={() => {
                                    this.props.addLine(
                                        ['Research data downloaded successfully'],
                                        () => {
                                            this.setState({ gameState: TopLevelGameState.RESEARCH })
                                        }
                                    )
                                }}
                            />
                        ])
                    })
                })
            }
        })
        return researchArray
    }

    render() {
        return (
            <div>
                {this.state.gameState === TopLevelGameState.TERMINAL && (
                    <TerminalInputHelper onSumbitCommand={this.handleCommandLineFeedback} />
                )}
                {this.state.gameState === TopLevelGameState.LOGS && (
                    <ConsolePicker
                        scrollToBottom={this.props.updateScroll}
                        onBackout={() => this.props.clearLines(() => this.goToCommandLine())}
                        options={this.generateLogs()}
                    />
                )}
                {this.state.gameState === TopLevelGameState.RESEARCH && (
                    <ConsolePicker
                        scrollToBottom={this.props.updateScroll}
                        onBackout={() => this.props.clearLines(() => this.goToCommandLine())}
                        options={this.generateResearchData()}
                    />
                )}
            </div>
        )
    }
}

export default AbductionTerminal
