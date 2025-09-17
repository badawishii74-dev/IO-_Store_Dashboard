import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import RequireBack from './hooks/RequireBack';
import RequireAuth from './hooks/RequireAuth';
import Dashboard from './Pages/Dashbard';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route element={<RequireBack />}>
          <Route path='login' element={<Login />} />
        </Route>


        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;

