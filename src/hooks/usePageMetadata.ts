import { useEffect } from 'react'

export function usePageMetadata(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    if (meta) meta.content = description

    return () => {
      if (meta && previousDescription) meta.content = previousDescription
    }
  }, [description, title])
}
