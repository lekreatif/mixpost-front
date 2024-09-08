import { useState, useEffect } from 'react'
import { getMyPages } from '../services/api'

export interface Page {
  id: number
  name: string
  pageId: string
}

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getMyPages()
        setPages(response.data)
      } catch (err: unknown) {
        setError('Erreur lors de la récupération des pages')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [])

  return { pages, isLoading, error }
}
