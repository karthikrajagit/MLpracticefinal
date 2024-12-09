import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute() {
const {user} = useSelector((state) => state.user)
  return user ? <Outlet /> : <Navigate to='/signin' />
}
