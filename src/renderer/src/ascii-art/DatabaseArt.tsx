import React, { useEffect } from 'react'
import Database1 from '../assets/database1.png'
import Database2 from '../assets/database2.png'
import ImageAsciiHolder from './ImageAsciiHolder'

export default function DatabaseAsciiArt() {
    const [index, setIndex] = React.useState<number>(0)
    const images = [Database1, Database2]
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
