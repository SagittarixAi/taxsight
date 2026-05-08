import { useCallback, useState } from 'react'
import { Upload, FileText, FileSpreadsheet, Receipt } from 'lucide-react'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export default function UploadZone({ onFilesSelected, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items?.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      if (disabled) return
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected, disabled],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        onFilesSelected(Array.from(e.target.files))
        e.target.value = ''
      }
    },
    [onFilesSelected],
  )

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-250 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragOver
          ? 'border-[#00D5B3] bg-[#E6FAF6] scale-[1.01]'
          : 'border-[#E5E4E7] hover:border-[#00D5B3] hover:bg-[#F8F7FA]'}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('file-upload-input')?.click()}
    >
      <input
        id="file-upload-input"
        type="file"
        className="hidden"
        multiple
        onChange={handleFileInput}
        disabled={disabled}
        accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls,.doc,.docx"
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-250 ${isDragOver ? 'bg-[#00D5B3]/10 text-[#00D5B3]' : 'bg-[#E6FAF6] text-[#00A88F]'}`}>
          <Upload size={28} />
        </div>
        <div>
          <p className="text-base font-semibold text-[#1A1523] mb-1">
            {isDragOver ? 'Drop files here' : 'Drag & drop your tax documents'}
          </p>
          <p className="text-sm text-[#8B8599]">or click to browse files</p>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F7FA] border border-[#E5E4E7]">
            <FileText size={14} className="text-[#6C3CE1]" />
            <span className="text-xs font-medium text-[#3D364A]">W-2</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F7FA] border border-[#E5E4E7]">
            <FileSpreadsheet size={14} className="text-[#6C3CE1]" />
            <span className="text-xs font-medium text-[#3D364A]">1099</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F7FA] border border-[#E5E4E7]">
            <Receipt size={14} className="text-[#6C3CE1]" />
            <span className="text-xs font-medium text-[#3D364A]">Receipts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
