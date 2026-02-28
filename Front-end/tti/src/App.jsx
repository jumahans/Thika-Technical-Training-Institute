// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Landing
import Landing from './pages/Landing'

// Auth Pages
import Login          from './pages/auth/Login'
import Register       from './pages/auth/Register'
import ChangePassword from './pages/auth/ChangePassword'

// Main Pages
import Dashboard        from './pages/Dashboard'
import Profile          from './pages/Profile'
import Events           from './pages/Events'
import Units            from './pages/Units'
import UnitRegistration from './pages/UnitRegistration'
import Results          from './pages/Results'
import ExamCard         from './pages/ExamCard'
import FeeStructure     from './pages/FeeStructure'
import FeePayments      from './pages/FeePayments'
import Clearance        from './pages/Clearance'
import HostelBooking    from './pages/HostelBooking'
import Disciplinary     from './pages/Disciplinary'
import OnlineReporting        from './pages/OnlineReporting'
import Attachments      from './pages/Attachments'
import StudentForms     from './pages/StudentForms'
import LostCard         from './pages/LostCard'

// Guard
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path='/'         element={<Landing />} />

        {/* Auth */}
        <Route path='/login'    element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard'         element={<Dashboard />} />
          <Route path='/profile'           element={<Profile />} />
          <Route path='/change-password'   element={<ChangePassword />} />
          <Route path='/events'            element={<Events />} />
          <Route path='/units'             element={<Units />} />
          <Route path='/unit-registration' element={<UnitRegistration />} />
          <Route path='/results'           element={<Results />} />
          <Route path='/exam-card'         element={<ExamCard />} />
          <Route path='/fees/structure'    element={<FeeStructure />} />
          <Route path='/fees/payments'     element={<FeePayments />} />
          <Route path='/clearance'         element={<Clearance />} />
          <Route path='/hostel'            element={<HostelBooking />} />
          <Route path='/disciplinary'      element={<Disciplinary />} />
          <Route path='/reporting'         element={<OnlineReporting />} />
          <Route path='/attachments'       element={<Attachments />} />
          <Route path='/forms'             element={<StudentForms />} />
          <Route path='/lost-card'         element={<LostCard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App