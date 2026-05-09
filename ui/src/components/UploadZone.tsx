import { useCallback, useState } from 'react'
import { Upload, FileText, FileSpreadsheet, Receipt } from 'lucide-react'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

const supportedTypes = [
  { icon: FileText, label: 'W-2', color: 'text-[#6C3CE1]' },
  { icon: FileSpreadsheet, label: '1099', color: 'text-[#6C3CE1]' },
  { icon: Receipt, label: 'Receipts', color: 'text-[#6C3CE1]' },
  { icon: FileText, label: 'PDF', color: 'text-[#E55A25]' },
  { icon: FileSpreadsheet, label: 'CSV/XLS', color: 'text-[#00A88F]' },
  { icon: FileText, label: 'Images', color: 'text-[#3D6A8E]' },
]

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
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-250 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragOver
          ? 'border-accent bg-accent-bg scale-[1.01] shadow-lg'
          : 'border-[#E5E4E7] hover:border-accent hover:bg-[#F8F7FA] hover:shadow-md'}`}
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
      <div className="flex flex-col items-center gap-5">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-250 ${isDragOver ? 'bg-accent/15 text-accent scale-110' : 'bg-[#E6FAF6] text-[#00A88F]'}`}>
          <Upload size={32} />
        </div>
        <div>
          <p className="text-base font-bold text-[#1A1523] mb-1">
            {isDragOver ? 'Drop files to upload' : 'Drag & drop your tax documents'}
          </p>
          <p className="text-sm text-[#8B8599]">or click to browse files</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {supportedTypes.map((t) => (
            <div key={t.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F7FA] border border-[#E5E4E7]">
              <t.icon size={13} className={t.color} />
              <span className="text-xs font-medium text-[#3D364A]">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
