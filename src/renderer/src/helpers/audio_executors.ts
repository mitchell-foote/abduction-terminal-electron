import Terminal_Type from '../assets/Terminal_Type.mp3'
import Terminal_download from '../assets/Terminal_download.mp3'
import Terminal_Card_Change from '../assets/Terminal_Card_Change.mp3'
import Terminal_Login_Fail from '../assets/Terminal_Login_Fail.mp3'
import Terminal_Login_success from '../assets/Terminal_login_success.mp3'
import Terminal_logout from '../assets/Terminal_logout.mp3'

async function loadAudio(url: string) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await context.decodeAudioData(arrayBuffer)
    return audioBuffer
}

class AudioManager {
    constructor() {
        loadAudio(Terminal_Type).then((audioBuffer) => {
            this.terminalTypeBuffer = audioBuffer
        })
        loadAudio(Terminal_download).then((audioBuffer) => {
            this.terminalDownloadBuffer = audioBuffer
        })
        loadAudio(Terminal_Card_Change).then((audioBuffer) => {
            this.terminalCardChangeBuffer = audioBuffer
        })
        loadAudio(Terminal_Login_Fail).then((audioBuffer) => {
            this.terminalLoginFailBuffer = audioBuffer
        })
        loadAudio(Terminal_Login_success).then((audioBuffer) => {
            this.terminalLoginSuccessBuffer = audioBuffer
        })
        loadAudio(Terminal_logout).then((audioBuffer) => {
            this.terminalLogoutBuffer = audioBuffer
        })
    }
    terminalTypeBuffer: AudioBuffer | undefined
    terminalDownloadBuffer: AudioBuffer | undefined
    terminalCardChangeBuffer: AudioBuffer | undefined
    terminalLoginFailBuffer: AudioBuffer | undefined
    terminalLoginSuccessBuffer: AudioBuffer | undefined
    terminalLogoutBuffer: AudioBuffer | undefined
}

const context = new AudioContext()
const audioManager = new AudioManager()

export function playTerminalTypeSound() {
    audioManager.terminalTypeBuffer && play(audioManager.terminalTypeBuffer)
}

export function playTerminalDownloadSound() {
    audioManager.terminalDownloadBuffer && play(audioManager.terminalDownloadBuffer)
}

export function playTerminalCardChangeSound() {
    audioManager.terminalCardChangeBuffer && play(audioManager.terminalCardChangeBuffer)
}

export function playTerminalLoginFailSound() {
    audioManager.terminalLoginFailBuffer && play(audioManager.terminalLoginFailBuffer)
}

export function playTerminalLoginSuccessSound() {
    audioManager.terminalLoginSuccessBuffer && play(audioManager.terminalLoginSuccessBuffer)
}

export function playTerminalLogoutSound() {
    audioManager.terminalLogoutBuffer && play(audioManager.terminalLogoutBuffer)
}

function play(audioBuffer: AudioBuffer) {
    const source = context.createBufferSource()
    source.buffer = audioBuffer
    source.connect(context.destination)
    source.start()
}
