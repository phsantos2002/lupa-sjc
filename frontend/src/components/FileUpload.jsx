import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function FileUpload({ onUpload, label = 'Upload de arquivo', accept = 'image/*,video/*', currentUrl }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(file)
      })

      const res = await fetch(`${API_URL}/api/estabelecimentos/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileBase64: base64 }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onUpload(data.url)
    } catch (err) {
      alert('Erro no upload: ' + err.message)
    }
    setUploading(false)
    e.target.value = ''
  }

  const uid = label.replace(/\s/g, '-')

  return (
    <div>
      <label className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
      {currentUrl && (
        <img src={currentUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-gray-200" />
      )}
      <div className="relative">
        <input type="file" accept={accept} onChange={handleFile} className="hidden" id={`upload-${uid}`} />
        <label htmlFor={`upload-${uid}`} className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm cursor-pointer transition ${uploading ? 'opacity-50' : 'hover:border-tauste-orange hover:bg-tauste-orange/5'}`}>
          {uploading ? (
            <span className="text-gray-400">Enviando...</span>
          ) : (
            <>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <span className="text-gray-500">{currentUrl ? 'Trocar arquivo' : 'Escolher arquivo'}</span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}
