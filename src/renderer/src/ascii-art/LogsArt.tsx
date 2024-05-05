import React, { useEffect } from 'react'
import Logs1 from '../assets/logs1.png'
import Logs2 from '../assets/logs2.png'
import Logs3 from '../assets/logs3.png'
import ImageAsciiHolder from './ImageAsciiHolder'

export default function LogsAsciiArt() {
    const [index, setIndex] = React.useState<number>(0)
    const images = [Logs1, Logs2, Logs3]
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % images.length)
        }, 1000)
        return () => clearInterval(interval)
    })

    return (
        <div>
            <ImageAsciiHolder scale_override={70} url={images[index]} />
        </div>
    )
}
