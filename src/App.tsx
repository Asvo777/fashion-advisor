import { useEffect, useState } from 'react'
import type { components } from './api-types'

type ClothingItem = components['schemas']['ClothingItem']

function App() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/clothing-items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load clothing items')
        }

        return response.json()
      })
      .then(setItems)
      .catch((error: Error) => setError(error.message))
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>My wardrobe</h1>

      {items.length === 0 ? (
        <p>No clothing items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.category}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
