import { ConfigFile } from './types'
import genericPurple from './Generic Purple.png?base64'
export function generateDefaultConfig(): ConfigFile {
    return {
        username: 'username',
        password: 'password',
        logs: [
            {
                name: 'Log 902',
                description: 'Description goes here',
                message: 'This is a message that is completely unrestricted',
                restricted: false
            },
            {
                name: 'Log 903',
                description: 'Description goes here',
                message: 'This is a message that is completely restricted',
                restricted: true
            }
        ],
        researchData: [
            {
                name: 'Research Exp 1',
                message: 'This is a research message',
                description: 'This is a description',
                imageUrl: genericPurple
            },
            {
                name: 'Research Exp 2',
                message: 'This is a research message',
                description: 'This is a description',
                imageUrl: genericPurple
            },
            {
                name: 'Research Exp 3',
                message: 'This is a research message',
                description: 'This is a description'
            }
        ],
        overrideCode: 'override'
    }
}
