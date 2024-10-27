import React from 'react'
import Home from './components/Home'
import SuccessfulUC from './components/SuccessfulUC'
import FailedUC from './components/FailUC'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup.jsx'
import ProtectedRoute from './components/protectedRoute/ProtectedRoutes.jsx'

function App() {
  return (
    <div>

      <BrowserRouter>

        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            } />
          <Route path='/successfuluc' element={
            <ProtectedRoute>
              <SuccessfulUC />
            </ProtectedRoute>
          } />
          <Route path='/faileduc' element={
            <ProtectedRoute>
              <FailedUC />
            </ProtectedRoute>
          } />

        </Routes>

      </BrowserRouter>

    </div>
  )
}

export default App
