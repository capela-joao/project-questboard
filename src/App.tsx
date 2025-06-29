import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Navigation from './components/Navigation/Navigation';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>

        <Route path="/" element={<Navigation/>}>
         <Route index element={<Dashboard/>}/>
         <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
