import React from 'react'

interface PDFViewerProps {
  src: string
  title?: string
  width?: string
  height?: string
  className?: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  src,
  title = 'PDF Document',
  width = 'w-full',
  height = 'h-screen',
  className = '',
}) => {
  return (
    <div className={`${width} ${height} ${className}`}>
      <embed
        src={src}
        type="application/pdf"
        width="100%"
        height="100%"
        className="border border-gray-300 rounded-lg shadow-lg"
        title={title}
      />
    </div>
  )
}

export default function Documentacion() {
    return (
      <main className="container mx-auto p-4">
        <PDFViewer
          src="/manual.pdf"
          title="Sample PDF"
          height="h-[600px]"
          className="max-w-3xl mx-auto"
        />
      </main>
    )
  }


