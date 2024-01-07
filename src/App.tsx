import { Layout } from 'components/Layout'
import Router from 'components/Router'
import { app } from 'firebaseApp'
import { getAuth } from 'firebase/auth'
import { useState } from 'react'

function App() {
  const auth = getAuth(app)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  )

  return (
    <Layout>
      <Router />
    </Layout>
  )
}

export default App
