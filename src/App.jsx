import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import RequireBack from './hooks/RequireBack';
import RequireAuth from './hooks/RequireAuth';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route element={<RequireBack />}>
          <Route path='login' element={<Login />} />
        </Route>


        <Route element={<RequireAuth />}>
          <Route path="/" element={<h1>Welcome to the Admin Dashboard</h1>} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;

