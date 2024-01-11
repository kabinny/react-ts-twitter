import { Layout } from 'components/Layout'
import Router from 'components/Router'
import { app } from 'firebaseApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'components/loader/Loader'

function App() {
  const auth = getAuth(app)
  const [init, setInit] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  )

  // firebase auth 상태 실시간 감지
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      setInit(true)
    })
  }, [auth])

  return (
    <Layout>
      <ToastContainer
        theme="dark"
        autoClose={1000}
        hideProgressBar
        newestOnTop
      />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </Layout>
  )
}

export default App
