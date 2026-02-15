interface PdfPageProps {
  content: string
  pageNumber: number
  totalPages: number
}

export function PdfPage({ content, pageNumber, totalPages }: PdfPageProps) {
  return (
    <div className="mx-auto mb-6 w-full max-w-[612px] rounded-sm border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-50">
      <div className="px-12 py-10" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">{content}</div>
      </div>
      <div className="border-t border-gray-100 px-12 py-3 text-center">
        <span className="text-xs text-gray-400">
          Page {pageNumber} of {totalPages}
        </span>
      </div>
    </div>
  )
}
