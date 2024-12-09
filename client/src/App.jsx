import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProblemDescription from './pages/ProblemDescription'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'


export default function App() {
 return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/admin' element = {<Admin/>}/>
          <Route path='/' element = {<Home/>}/>
          <Route path="/problem/:id" element={<ProblemDescription />} />
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route element = {<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
  )
}
