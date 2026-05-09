import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, FileSpreadsheet, Receipt, AlertCircle, Loader2, Calculator, Trash2, CheckCircle } from 'lucide-react'
import api from '../api/client'
import UploadZone from '../components/UploadZone'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

interface UploadedFile {
  id: number
  filename: string
  status: 'processing' | 'complete' | 'error'
  document_type?: string
  size?: number
}

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'w-2': FileText,
  '1099': FileSpreadsheet,
  receipt: Receipt,
  default: FileText,
}

function formatSize(bytes: number | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Upload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

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
          const fakeFile: UploadedFile = {
            id: Date.now() + i,
            filename: file.name,
            status: 'error',
            size: file.size,
          }
          setFiles((prev) => [...prev, fakeFile])
        }
        setUploadProgress(Math.round(((i + 1) / newFiles.length) * 100))
      }
      setIsUploading(false)
      setUploadProgress(0)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 8000)
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

  const handleClearAll = async () => {
    const ids = files.map((f) => f.id)
    for (const id of ids) {
      try { await api.delete(`/documents/${id}`) } catch { /* continue */ }
    }
    setFiles([])
  }

  const processedCount = files.filter((f) => f.status === 'complete').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-56 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in max-w-3xl pb-8">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Upload Documents</h1>
        <p className="text-sm text-ink-muted mt-1">Upload W-2s, 1099s, and receipts for AI processing</p>
      </div>

      {isUploading && (
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={18} className="text-primary animate-spin" />
            <span className="text-sm font-semibold text-ink-light">Uploading... {uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="card p-5 bg-[#E6FAF6] border-accent/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-accent-dark" />
            <div>
              <p className="text-sm font-semibold text-ink">Upload complete</p>
              <p className="text-xs text-ink-muted">Your documents are ready for AI processing</p>
            </div>
          </div>
          <button className="btn-primary text-sm" onClick={() => { setShowSuccess(false); navigate('/calculations') }}>
            <Calculator size={16} />
            Run Calculation
          </button>
        </div>
      )}

      <UploadZone onFilesSelected={handleFilesSelected} disabled={isUploading} />

      {files.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No documents uploaded yet"
          description="Drag and drop your tax documents above, or click to browse files."
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h3 className="text-sm font-semibold text-ink">
                Uploaded Files <span className="text-ink-muted font-normal ml-1">({files.length})</span>
              </h3>
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-ink-muted hover:text-error transition-colors flex items-center gap-1"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            </div>
            <div className="px-3 pb-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 px-3 text-ink-muted font-semibold text-xs uppercase tracking-wider">File</th>
                      <th className="text-left py-2.5 px-3 text-ink-muted font-semibold text-xs uppercase tracking-wider">Type</th>
                      <th className="text-right py-2.5 px-3 text-ink-muted font-semibold text-xs uppercase tracking-wider">Size</th>
                      <th className="text-right py-2.5 px-3 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => {
                      const docType = file.document_type || 'default'
                      const Icon = typeIcons[docType] || typeIcons.default
                      const isError = file.status === 'error'
                      const isProcessing = file.status === 'processing'
                      const typeLabel = file.document_type || 'Other'
                      return (
                        <tr
                          key={file.id}
                          className="border-b border-border-light last:border-0 hover:bg-surface transition-colors duration-150 group"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isError ? 'bg-error-bg text-error' : 'bg-primary-bg text-primary'}`}>
                                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : isError ? <AlertCircle size={18} /> : <Icon size={18} />}
                              </div>
                              <span className="text-ink font-medium truncate max-w-[180px] sm:max-w-[260px]">{file.filename}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-ink-muted capitalize">{typeLabel}</td>
                          <td className="py-3 px-3 text-right text-ink-muted tabular-nums">{formatSize(file.size)}</td>
                          <td className="py-3 px-3 text-right">
                            <StatusBadge status={file.status} />
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleRemove(file.id)}
                              className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-error transition-all p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {processedCount > 0 && (
            <div className="card p-6 bg-gradient-to-r from-[#F4F0FC] to-[#EEF1F5] border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-ink">
                    {processedCount} document{processedCount > 1 ? 's' : ''} ready
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">Ready for AI-powered tax calculation</p>
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
