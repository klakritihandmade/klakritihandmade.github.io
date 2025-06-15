import { useState } from 'react'
import supabase from '../lib/supabase'

export default function Admin() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data: userData } = await supabase.auth.getUser()
    const email = userData?.user?.email

    const { data: inserted, error } = await supabase.from('paintings').insert([
      { title, description, user_email: email }
    ]).select().single()

    const paintingId = inserted.id

    for (let file of files) {
      const filePath = `painting-${paintingId}/${file.name}`
      const { data: uploaded } = await supabase.storage
        .from('painting-images')
        .upload(filePath, file)

      const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/painting-images/${filePath}`

      await supabase.from('painting_images').insert([
        { painting_id: paintingId, image_url: publicUrl, user_email: email }
      ])
    }

    alert('Painting added successfully!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add New Painting</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} required />
      <button type="submit">Upload</button>
    </form>
  )
}
