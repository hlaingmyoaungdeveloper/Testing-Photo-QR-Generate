import { useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { Upload, X, Plus } from 'lucide-react'

const PhotoUpload = ({ onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const resetForm = () => {
    setName('')
    setFile(null)
    setPreview(null)
    setShowErrors(false)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB')
      return
    }

    setFile(selectedFile)

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file || name.trim() === '') {
      setShowErrors(true)
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('file', file)

    try {
      await axios.post('/api/photo/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      onUploadSuccess && onUploadSuccess()
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
      alert(error.response?.data || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl font-bold"
      >
        <Plus className="w-5 h-5" />
        Add Photo
      </button>

      {/* MODAL */}
      {isOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">

          {/* MODAL BOX (IMPORTANT FIX HERE) */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold text-black">Upload Photo</h2>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpload} className="p-5 space-y-5">

              {/* NAME FIELD (NOW ALWAYS VISIBLE) */}
              <div>
                <label className="text-sm font-bold text-black block">
                  Name *
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter photo name"
                  className={`w-full mt-2 p-3 border rounded-lg text-black bg-white ${
                    showErrors && name.trim() === ''
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="text-sm font-bold text-black">
                  Photo *
                </label>

                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="fileInput"
                  className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer ${
                    showErrors && !file
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="h-32 object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-500" />
                      <p className="text-sm text-gray-500 mt-2">
                        Click to upload image
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* ERROR MESSAGE */}
              {showErrors && (!file || name.trim() === '') && (
                <p className="text-red-500 text-sm">
                  Name and photo are required
                </p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  uploading
                    ? 'bg-gray-400'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

            </form>
          </div>
        </div>
      , document.body)}
    </>
  )
}

export default PhotoUpload
