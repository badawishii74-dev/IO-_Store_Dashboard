import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import RequireBack from './hooks/RequireBack';
import RequireAuth from './hooks/RequireAuth';
import Dashboard from './Pages/Dashbard';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Overview from './Components/Overview';
// import Order from './Pages/Order';
import Products from './Pages/products/Products';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route element={<RequireBack />}>
          <Route path='login' element={<Login />} />
        </Route>


        <Route element={<RequireAuth />}>
          <Route element={<Dashboard />}>
            <Route path="/" element={<Overview />} />
            {/* <Route path="orders" element={<Order />} /> */}
            <Route path="products" element={<Products/>} />

          </Route>
        </Route>

      </Routes>
    </div>
  );
}

export default App;

