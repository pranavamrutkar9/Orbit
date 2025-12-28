import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import PrivateRoutes from './routes/PrivateRoutes'
import Dashboard from './pages/Admin/Dashboard';
import ManageActions from './pages/Admin/ManageActions'
import CreateAction from './pages/Admin/CreateAction'
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyActions from './pages/User/MyActions';
import ActionDetails from './pages/User/ActionDetails'

const App = () => {
  return (
    <div className=''>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/actions' element={<ManageActions />} />
            <Route path='/admin/create-action' element={<CreateAction />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>
          
          {/* User Routes */}
          <Route element={<PrivateRoutes allowedRoles={['member']} />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/actions' element={<MyActions />} />
            <Route path='/user/action-details/:id' element={<ActionDetails />} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App