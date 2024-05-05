import React, { useEffect } from 'react'
import Hack1 from '../assets/hack1.png'
import Hack2 from '../assets/hack2.png'
import ImageAsciiHolder from './ImageAsciiHolder'

export default function HackerArt() {
    const [index, setIndex] = React.useState<number>(0)
    const images = [Hack1, Hack2]
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % images.length)
        }, 200)
        return () => clearInterval(interval)
    })

    return (
        <div>
            <ImageAsciiHolder font_override={0.8} scale_override={130} url={images[index]} />
        </div>
    )
}
