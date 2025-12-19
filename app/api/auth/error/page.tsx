'use client'
import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="text-center">
      <h1>Authentication Error</h1>
      <p>Error type: {error || 'Unknown'}</p>
      <a href="/signin">Back to Sign In</a>
    </div>
  )
}