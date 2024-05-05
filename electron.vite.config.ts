import { resolve } from 'path'
import { Plugin } from 'vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const base64Loader: Plugin = {
    name: 'base64-loader',
    transform(_: any, id: string) {
        const [path, query] = id.split('?')
        if (query != 'base64') return null

        const data = fs.readFileSync(path)
        const base64 = data.toString('base64')

        return `export default '${base64}';`
    }
}

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), base64Loader]
    },
    preload: {
        plugins: [externalizeDepsPlugin(), base64Loader]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [react(), base64Loader]
    }
})
