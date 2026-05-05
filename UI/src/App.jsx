import { useState, useEffect } from 'react'
import axios from 'axios'
import PhotoUpload from './components/PhotoUpload'
import PhotoGallery from './components/PhotoGallery'
import { Sparkles, LayoutGrid } from 'lucide-react'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('/api/photo')
      setPhotos(response.data)
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  Photo<span className="text-blue-600">Studio</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                  Cloud Management
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{photos.length} Photos</span>
              </div>
              <PhotoUpload onUploadSuccess={fetchPhotos} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Collection</h2>
          <p className="text-slate-500 font-medium">Manage and share your visual memories with ease.</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">Loading Gallery</p>
          </div>
        ) : (
          <PhotoGallery photos={photos} onDeleteSuccess={fetchPhotos} />
        )}
      </main>

      <footer className="py-12 border-t border-slate-200/60 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 PhotoStudio Cloud. Built for modern experiences.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
