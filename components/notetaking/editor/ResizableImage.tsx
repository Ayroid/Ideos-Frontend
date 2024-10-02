import React, { useState, useRef, useEffect } from 'react'

interface ResizableImageProps {
  src: string
  alt: string
  initialWidth: number
  initialHeight: number
}

export const ResizableImage: React.FC<ResizableImageProps> = ({ src, alt, initialWidth, initialHeight }) => {
  const [width, setWidth] = useState(initialWidth)
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && imageRef.current) {
      const newWidth = e.clientX - imageRef.current.getBoundingClientRect().left
      const aspectRatio = initialWidth / initialHeight
      setWidth(newWidth)
      setHeight(newWidth / aspectRatio)
    }
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto"
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}