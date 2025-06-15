import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Gallery() {
  const [paintings, setPaintings] = useState([])

  useEffect(() => {
    const fetchPaintings = async () => {
      const { data: paintingsData } = await supabase.from('paintings').select('*')
      const fullData = await Promise.all(paintingsData.map(async (painting) => {
        const { data: images } = await supabase
          .from('painting_images')
          .select('image_url')
          .eq('painting_id', painting.id)
        return { ...painting, images }
      }))
      setPaintings(fullData)
    }
    fetchPaintings()
  }, [])

  return (
    <div>
      <h1>Paintings Gallery</h1>
      {paintings.map((painting) => (
        <div key={painting.id}>
          <h2>{painting.title}</h2>
          <p>{painting.description}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {painting.images.map((img, idx) => (
              <img key={idx} src={img.image_url} alt="" width="150" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
