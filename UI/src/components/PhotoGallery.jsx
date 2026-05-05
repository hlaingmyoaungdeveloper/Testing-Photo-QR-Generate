import axios from 'axios'
import { Trash2, QrCode, Download, ExternalLink, Pencil, X, Upload, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const PhotoGallery = ({ photos, onDeleteSuccess }) => {
  const [selectedQR, setSelectedQR] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [copied, setCopied] = useState(false)
  
  // Edit State
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editName, setEditName] = useState('')
  const [editFile, setEditFile] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [updating, setUpdating] = useState(false)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return
    setDeletingId(id)
    try {
      await axios.delete(`/api/photo/${id}`)
      onDeleteSuccess()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete photo.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditClick = (photo) => {
    setEditingPhoto(photo)
    setEditName(photo.name)
    setEditPreview(photo.imageUrl)
    setEditFile(null)
  }

  const handleEditFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingPhoto || !editName || (!editFile && !editPreview)) return

    setUpdating(true)
    const formData = new FormData()
    formData.append('name', editName)
    if (editFile) {
      formData.append('file', editFile)
    }

    try {
      await axios.put(`/api/photo/${editingPhoto.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onDeleteSuccess() // Refresh list
      setEditingPhoto(null)
    } catch (error) {
      console.error('Update failed:', error)
      alert(`Update failed: ${error.response?.data || error.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const showQR = (photo) => {
    setSelectedQR({
      qrUrl: `/api/photo/generate/${photo.id}`,
      directUrl: photo.imageUrl,
      name: photo.name,
      id: photo.id
    })
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQR = async () => {
    try {
      const response = await fetch(selectedQR.qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `QR-${selectedQR.name.replace(/\s+/g, '-').toLowerCase()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-slate-50 to-white rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-slate-100">
          <Download className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Gallery is empty</h3>
        <p className="text-slate-400 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
          Your creative journey starts here. Upload your first masterpiece and share it with the world.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {photos.map((photo, index) => (
        <div 
          key={photo.id} 
          className="group relative bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="aspect-[4/5] overflow-hidden relative">
            <img
              src={photo.imageUrl}
              alt={photo.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
            
            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <div className="flex items-center justify-center gap-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75">
                <button
                  onClick={() => showQR(photo)}
                  className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all duration-300 border border-white/20 flex items-center justify-center shadow-lg"
                  title="Generate QR"
                >
                  <QrCode className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleEditClick(photo)}
                  className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all duration-300 border border-white/20 flex items-center justify-center shadow-lg"
                  title="Edit Photo"
                >
                  <Pencil className="w-6 h-6" />
                </button>
                <a
                  href={photo.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all duration-300 border border-white/20 flex items-center justify-center shadow-lg"
                  title="View Full"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
               <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                  Shared Cloud
               </div>
            </div>
          </div>
          
          <div className="p-8 flex flex-col flex-grow bg-white">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="font-black text-slate-900 text-xl leading-[1.2] line-clamp-2 group-hover:text-blue-600 transition-colors">
                {photo.name}
              </h3>
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className={`p-3 rounded-2xl transition-all flex-shrink-0 ${
                  deletingId === photo.id 
                    ? 'bg-slate-50 text-slate-300' 
                    : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                }`}
                title="Delete"
              >
                {deletingId === photo.id ? (
                  <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">Asset Reference</p>
                <p className="text-[11px] text-slate-500 font-mono truncate max-w-[140px] font-bold">{photo.id}</p>
              </div>
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                 <Download className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Edit Details</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Refine your photo information.</p>
              </div>
              <button onClick={() => setEditingPhoto(null)} className="text-slate-300 hover:text-slate-600 transition-colors p-2 rounded-2xl hover:bg-slate-50">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Photo Title</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Change Image</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleEditFileChange}
                    className="hidden"
                    id="edit-file-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="edit-file-upload"
                    className="flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed border-slate-100 rounded-[2rem] cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                  >
                    {editPreview ? (
                      <div className="relative w-full h-full p-4 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <img src={editPreview} alt="Preview" className="max-h-36 rounded-2xl object-contain shadow-lg mb-3" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider truncate max-w-[200px]">
                           {editFile ? editFile.name : 'Preserve Current'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <Upload className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-sm font-bold text-slate-600">Swap Image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updating || !editName}
                  className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-[0.98] ${
                    updating || !editName
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200'
                  }`}
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Apply Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedQR && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-500" onClick={() => setSelectedQR(null)}>
          <div 
            className="bg-white p-10 sm:p-14 rounded-[3.5rem] shadow-2xl flex flex-col items-center max-w-sm w-full animate-in zoom-in slide-in-from-bottom-12 duration-500" 
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-10" />
            <h3 className="text-3xl font-black mb-3 text-slate-900 text-center tracking-tight">Scan & Share</h3>
            <p className="text-slate-400 text-sm mb-10 text-center font-medium px-4">
              Instantly share this moment with anyone using this unique code.
            </p>
            
            <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-inner relative group mb-8">
              <img src={selectedQR.qrUrl} alt="QR Code" className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl shadow-sm" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/20 backdrop-blur-[2px] rounded-[3rem]">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-slate-50">
                    <QrCode className="w-8 h-8 text-blue-600" />
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
               <button
                 onClick={() => copyToClipboard(selectedQR.directUrl)}
                 className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold transition-all active:scale-[0.98]"
               >
                 {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-500" />}
                 <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
               </button>
               
               <button
                 onClick={downloadQR}
                 className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
               >
                 <Download className="w-5 h-5" />
                 <span>Download QR Code</span>
               </button>
            </div>
            
            <button
              onClick={() => setSelectedQR(null)}
              className="mt-8 text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-widest transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


export default PhotoGallery
