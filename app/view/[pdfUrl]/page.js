'use client'
import PdfViewer from '@/components/PdfCanvas'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const params = useParams()
    
  return (
    <div className='mx-auto'>
        <PdfViewer pdfUrl="/sample-local-pdf.pdf"/>
    </div>
  )
}

export default page