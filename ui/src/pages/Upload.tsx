import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, FileSpreadsheet, Receipt, AlertCircle, Loader2, Calculator, Trash2 } from 'lucide-react'
import api from '../api/client'
import UploadZone from '../components/UploadZone'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

interface UploadedFile {
  id: number
  filename: string
  status: 'processing' | 'complete' | 'error'
  document_type?: string
}

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'w-2': FileText,
  '1099': FileSpreadsheet,
  receipt: Receipt,
  default: FileText,
}

export default function Upload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchFiles = useCallback(async () => {
    try {
      const res = await api.get('/documents/')
      setFiles(res.data)
    } catch {
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchFiles()
  }, [navigate, fetchFiles])

  const handleFilesSelected = useCallback(
    async (newFiles: File[]) => {
      setIsUploading(true)
      setUploadProgress(0)
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i]
        const formData = new FormData()
        formData.append('file', file)

        try {
          const res = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          setFiles((prev) => [...prev, res.data])
        } catch {
          const filename = file.name
          const fakeFile: UploadedFile = {
            id: Date.now() + i,
            filename,
            status: 'error',
          }
          setFiles((prev) => [...prev, fakeFile])
        }
        setUploadProgress(Math.round(((i + 1) / newFiles.length) * 100))
      }
      setIsUploading(false)
      setUploadProgress(0)
      fetchFiles()
    },
    [fetchFiles],
  )

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/documents/${id}`)
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch {
      // silently fail
    }
  }

  const processedCount = files.filter((f) => f.status === 'complete').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1523] tracking-tight">Upload Documents</h1>
        <p className="text-sm text-[#8B8599] mt-1">Upload W-2s, 1099s, and receipts for AI processing</p>
      </div>

      {isUploading && (
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 size={18} className="text-[#6C3CE1] animate-spin" />
            <span className="text-sm font-medium text-[#3D364A]">Uploading... {uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#F0EFF3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C3CE1] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <UploadZone onFilesSelected={handleFilesSelected} disabled={isUploading} />

      {files.length === 0 ? (
        <EmptyState
          icon={<FileText size={40} />}
          title="No documents uploaded yet"
          description="Drag and drop your tax documents above, or click to browse files."
        />
      ) : (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1A1523]">
                Uploaded Files <span className="text-[#8B8599] font-normal">({files.length})</span>
              </h3>
            </div>
            <div className="space-y-2">
              {files.map((file) => {
                const docType = file.document_type || 'default'
                const Icon = typeIcons[docType] || typeIcons.default
                const isError = file.status === 'error'
                const isProcessing = file.status === 'processing'
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#F8F7FA] hover:bg-[#F0EFF3] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isError ? 'bg-[#FFF5F5] text-[#E53E3E]' : 'bg-[#F4F0FC] text-[#6C3CE1]'}`}>
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : isError ? <AlertCircle size={18} /> : <Icon size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1A1523] truncate">{file.filename}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={file.status} />
                      <button
                        onClick={() => handleRemove(file.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#8B8599] hover:text-[#E53E3E] transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {processedCount > 0 && (
            <div className="card p-5 bg-[#F4F0FC] border-[#6C3CE1]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1A1523]">
                    {processedCount} document{processedCount > 1 ? 's' : ''} processed
                  </p>
                  <p className="text-xs text-[#8B8599] mt-0.5">Ready for calculation</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/calculations')}>
                  <Calculator size={16} />
                  Run Calculation
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
