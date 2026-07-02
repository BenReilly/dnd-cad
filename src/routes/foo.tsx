import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { addDoc, collection, CollectionReference } from 'firebase/firestore'
import { db } from '../utils/firebase.utils'

type Skill = {
  key: string
  display: string
  attribute: string
}

const skills: Skill[] = [
  { key: 'acrobatics', display: 'Acrobatics', attribute: 'dex' },
  { key: 'animalHandling', display: 'Animal Handling', attribute: 'wis' },
  { key: 'arcana', display: 'Arcana', attribute: 'int' },
  { key: 'athletics', display: 'Athletics', attribute: 'str' },
  { key: 'deception', display: 'Deception', attribute: 'cha' },
  { key: 'history', display: 'History', attribute: 'int' },
  { key: 'insight', display: 'Insight', attribute: 'wis' },
  { key: 'intimidation', display: 'Intimidation', attribute: 'cha' },
  { key: 'investigation', display: 'Investigation', attribute: 'int' },
  { key: 'medicine', display: 'Medicine', attribute: 'wis' },
  { key: 'nature', display: 'Nature', attribute: 'wis' },
  { key: 'perception', display: 'Perception', attribute: 'wis' },
  { key: 'performance', display: 'Performance', attribute: 'cha' },
  { key: 'persuasion', display: 'Persuasion', attribute: 'cha' },
  { key: 'religion', display: 'Religion', attribute: 'wis' },
  { key: 'sleightOfHand', display: 'Sleight of Hand', attribute: 'dex' },
  { key: 'stealth', display: 'Stealth', attribute: 'dex' },
  { key: 'survival', display: 'Survival', attribute: 'wis' },
]

export const Route = createFileRoute('/foo')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState('Uploading skills to Firestore...')
  const [uploadedCount, setUploadedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const uploadSkills = async () => {
      try {
        const skillsCollection = collection(db, 'skills') as CollectionReference<Skill>

        await Promise.all(
          skills.map((skill) => addDoc(skillsCollection, skill)),
        )

        setUploadedCount(skills.length)
        setStatus('Skills uploaded successfully.')
      } catch (err) {
        setError((err as Error).message || 'Unknown error during skills upload.')
        setStatus('Skills upload failed.')
      }
    }

    uploadSkills()
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <h1>Upload Skill Set</h1>
      <p>{status}</p>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <p>Uploaded skills: {uploadedCount}</p>
          <h2>Skill List</h2>
          <ul>
            {skills.map((skill) => (
              <li key={skill.key}>
                {skill.display} ({skill.attribute})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
