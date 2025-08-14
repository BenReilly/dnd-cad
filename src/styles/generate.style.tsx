import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/generate/style')({
  component: () => <div>Hello /generate/style!</div>,
})
