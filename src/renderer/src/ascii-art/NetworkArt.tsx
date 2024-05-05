import React, { useEffect } from 'react'
import Network1 from '../assets/network1.png'
import Network2 from '../assets/network2.png'
import Network3 from '../assets/network3.png'
import ImageAsciiHolder from './ImageAsciiHolder'

export default function NetworkAsciiArt() {
    const [index, setIndex] = React.useState<number>(0)
    const images = [Network1, Network2, Network3]
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % images.length)
        }, 1000)
        return () => clearInterval(interval)
    })

    return (
        <div>
            <ImageAsciiHolder scale_override={60} url={images[index]} />
        </div>
    )
}
