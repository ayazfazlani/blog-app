// import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  // const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}