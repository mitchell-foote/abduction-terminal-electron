import { ThoriumData } from 'src/shared/types'

export async function sendLRM(
    thoriumData: ThoriumData,
    LRM: {
        sender: string
        crew: boolean
        decoded: boolean
        message: string
    }
): Promise<unknown> {
    const lrmSystemId = thoriumData.shipSystems.find((each) => each.type === 'LongRangeComm')?.id
    if (!lrmSystemId) {
        console.log('No LRM system found')
        return 'No LRM system found'
    } else {
        const data = await window.api.sendLRM(thoriumData.selectedServer.url, lrmSystemId, LRM)
        return data
    }
}
