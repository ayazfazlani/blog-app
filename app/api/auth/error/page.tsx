'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
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

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <h1>Authentication Error</h1>
        <p>Loading...</p>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}