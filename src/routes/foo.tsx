import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase.utils'

const APP_COLLECTIONS = [
  'users',
  'races',
  'classes',
  'backgrounds',
  'skills',
  'characters',
] as const

type AppExport = {
  exportedAt: string
  collections: Record<string, Array<Record<string, unknown>>>
}

export const Route = createFileRoute('/foo')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState('Loading database export...')
  const [jsonOutput, setJsonOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const exportDatabase = async () => {
      try {
        const collectionResults = await Promise.all(
          APP_COLLECTIONS.map(async (collectionName) => {
            const snapshot = await getDocs(collection(db, collectionName))
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            return [collectionName, docs] as const
          }),
        )

        const exportPayload: AppExport = {
          exportedAt: new Date().toISOString(),
          collections: Object.fromEntries(collectionResults),
        }

        setJsonOutput(JSON.stringify(exportPayload, null, 2))
        setStatus('Database export ready.')
      } catch (err) {
        setError((err as Error).message || 'Unknown error during database export.')
        setStatus('Database export failed.')
      }
    }

    exportDatabase()
  }, [])

  const handleCopy = async () => {
    if (!jsonOutput) return

    try {
      await navigator.clipboard.writeText(jsonOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('Could not copy to clipboard. Select and copy manually from the JSON box.')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Database JSON Export</h1>
      <p>{status}</p>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <p>This output includes all app-used collections and document ids.</p>
          <div style={{ marginBottom: '12px' }}>
            <button type='button' onClick={handleCopy} disabled={!jsonOutput}>
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <textarea
            readOnly
            value={jsonOutput}
            style={{
              width: '100%',
              minHeight: '420px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          />
        </>
      )}
    </div>
  )
}
