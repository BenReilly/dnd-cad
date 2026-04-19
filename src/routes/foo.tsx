import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  collection,
  deleteDoc,
  getDocs,
  CollectionReference,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore'
import { db } from '../utils/firebase.utils'

export const Route = createFileRoute('/foo')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState('Running duplicate cleanup...')
  const [removedCount, setRemovedCount] = useState(0)
  const [remainingBackgrounds, setRemainingBackgrounds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cleanupBackgroundDuplicates = async () => {
      try {
        type BackgroundDoc = { bg_name?: string }
        const backgroundsCollection = collection(
          db,
          'backgrounds',
        ) as CollectionReference<BackgroundDoc>
        const querySnapshot = await getDocs(backgroundsCollection)

        const seen = new Map<string, { name: string; ref: DocumentReference<BackgroundDoc> }>()
        const duplicates: Array<{ ref: DocumentReference<BackgroundDoc>; name: string }> = []

        querySnapshot.docs.forEach((doc) => {
          const data = doc.data() as BackgroundDoc
          const rawName = String(data.bg_name ?? '').trim()
          const normalizedName = rawName.toLowerCase()

          if (!normalizedName) {
            return
          }

          if (seen.has(normalizedName)) {
            duplicates.push({ ref: doc.ref, name: rawName })
          } else {
            seen.set(normalizedName, { name: rawName, ref: doc.ref })
          }
        })

        await Promise.all(duplicates.map((dup) => deleteDoc(dup.ref)))

        const remaining = Array.from(seen.values())
          .map((item) => item.name)
          .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

        setRemovedCount(duplicates.length)
        setRemainingBackgrounds(remaining)
        setStatus('Duplicate cleanup completed successfully.')
      } catch (err) {
        setError((err as Error).message || 'Unknown error during cleanup.')
        setStatus('Duplicate cleanup failed.')
      }
    }

    cleanupBackgroundDuplicates()
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <h1>Background Deduplication</h1>
      <p>{status}</p>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <p>Records removed: {removedCount}</p>
          <h2>Remaining Backgrounds</h2>
          {remainingBackgrounds.length === 0 ? (
            <p>No remaining backgrounds found.</p>
          ) : (
            <ul>
              {remainingBackgrounds.map((bgName) => (
                <li key={bgName}>{bgName}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
