import { useEffect, useState } from 'react'
import ImageAsciiHolder from './ImageAsciiHolder'

export const VideoAsciiHolder = (props: { url: string }) => {
    const [frames, setFrames] = useState<string[]>([])
    const [index, setIndex] = useState<number>(0)
    useEffect(() => {
        console.log(props.url)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        const video = document.createElement('video')
        video.src = props.url
        video.setAttribute('type', 'video/gif')
        canvas.width = video.width
        canvas.height = video.height
        const frames: string[] = []
        const updateCanvas = () => {
            console.log('updateCanvas')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const scaledImageUrl = canvas.toDataURL('image/jpeg')
            frames.push(scaledImageUrl)
            // Re-register the callback to run on the next frame
            video.requestVideoFrameCallback(updateCanvas)
        }

        // Initial registration of the callback to run on the first frame
        video.requestVideoFrameCallback(updateCanvas)
        video.onended = () => {
            setFrames(frames)
        }
        video
            .play()
            .then((e) => {
                console.log(e)
            })
            .catch((e) => {
                console.error(e)
            })
    }, [props.url])

    useEffect(() => {
        if (frames.length) {
            const interval = setInterval(() => {
                setIndex((index + 1) % frames.length)
            }, 1000 / 30)
            return () => clearInterval(interval)
        } else {
            return () => {}
        }
    }, [frames])

    return (
        <div>{frames.length && <ImageAsciiHolder scale_override={60} url={frames[index]} />}</div>
    )
}
