import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { SignIn } from './components/SignIn';
import { Menu } from './components/Layouts/MenuNavegation/Menu';
import { ProductFav } from './components/Layouts/MenuNavegation/ProductFav';
import { Help } from './components/Layouts/MenuNavegation/Help';
import { CraftforAdmins } from './components/Layouts/ForAdminView/CraftforAdmins';
import { Cart } from './components/Layouts/ForBuyerView/Cart';
import { History } from './components/Layouts/Histories/History';
import { LoginCompanies } from './components/Layouts/Companies/LoginCompanies';
import { CreateProduct } from './components/Layouts/Products/CreateProduct';
import { Statistics } from './components/Layouts/HomePage/Statistics';
import { EmpresaProvider } from './Context/contextEmpresa';
import { EventsForm } from './components/Layouts/Events/EventsForm';
import { UpdateCompany } from './components/Layouts/Companies/UpdateCompany';
import { UpdateProducto } from './components/Layouts/Products/UpdateProducto';
import { TermsAndConditions } from './components/Layouts/ForView/TermsAndConditions';
import { SalesOverview } from './components/Layouts/HomePage/SalesOverview';
import { CreateStory } from './components/Layouts/Histories/CreateHistory';
import { Address } from './components/Layouts/ForView/Address';
import { CraftComprador } from './components/Layouts/ForBuyerView/CraftComprador';
import { CompaniesComprador } from './components/Layouts/ForBuyerView/CompaniesComprador';
import { CompaniesForAdmin } from './components/Layouts/ForAdminView/CompaniesForAdmin';
import { EventsComprador } from './components/Layouts/ForBuyerView/EventsComprador';
import { EventsForAdmin } from './components/Layouts/ForAdminView/EventsForAdmin';
import { ProfileAnon } from './components/Layouts/Profiles/ProfileAnon';
import { ProfileComprador } from './components/Layouts/Profiles/ProfileComprador';
import { ProfileForAdmin } from './components/Layouts/Profiles/ProfileForAdmin';
import { ProfileForEmpleado } from './components/Layouts/Profiles/ProfileForEmpleado';
import ProtectedRoute from './components/Layouts/Protection for Routes/ProtectedRoute';
import { EventsProvider } from './Context/EventsContext'; 
import { CompaniesProducts } from './components/Layouts/ForBuyerView/CompaniesProducts';
import CartIcon from './components/Layouts/ForBuyerView/CartIcon';
import {EventsUpdateForm} from './components/Layouts/Events/EventsUpdateForm'
import  {MaterialsForAdmin}  from './components/Layouts/ForAdminView/MaterialsForAdmin';
import  {MaterialsForm}  from './components/Layouts/Materials/MaterialsForm';
import { MaterialsUpdateForm } from './components/Layouts/Materials/MaterialsUpdateForm';




function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (!userType) {
      localStorage.setItem('userType', 'anonimo');
    }
  }, []);

  return (
    <Router>
      <EmpresaProvider>
        <EventsProvider>
          <Routes>
            {/* Rutas para comunes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/Menu" element={<Menu />} />
            <Route path="/Help" element={<Help />} />
            <Route path="/History" element={<History />} />
            <Route path="/Address" element={<Address />} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route path="/Statistics" element={<Statistics />} />
            {/* Rutas exclusivas para anonimo */}
            <Route path="/ProfileAnon" element={<ProfileAnon />} />
            {/* Rutas exclusivas para Comprador */}
            <Route path="/ProfileComprador" element={<ProtectedRoute element={ProfileComprador} allowedRoles={['comprador']} />} />
            {/* Rutas para comprador y anonimo */}
            <Route path="/Cart" element={<ProtectedRoute element={() => <Cart cart={cart} setCart={setCart} />} allowedRoles={['comprador', 'anonimo']} />} />
            <Route path="/CraftComprador" element={<ProtectedRoute element={CraftComprador} allowedRoles={['comprador', 'anonimo']} />} />
            <Route path="/CompaniesComprador" element={<ProtectedRoute element={CompaniesComprador} allowedRoles={['comprador', 'anonimo']} />} />
            <Route path="/EventsComprador" element={<ProtectedRoute element={EventsComprador} allowedRoles={['comprador', 'anonimo']} />} />
            <Route path="/ProductFav" element={<ProductFav />} />
            <Route path="/CompaniesProducts/:codigoempresa" element={<CompaniesProducts />} />
            {/* Rutas para Administradores y empleados */}
            <Route path="/ProfileForAdmin" element={<ProtectedRoute element={ProfileForAdmin} allowedRoles={['administrador']} />} />
            <Route path="/ProfileForEmpleado" element={<ProtectedRoute element={ProfileForEmpleado} allowedRoles={['empleado']} />} />
            <Route path="/CompaniesForAdmin" element={<ProtectedRoute element={CompaniesForAdmin} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/CraftforAdmins" element={<ProtectedRoute element={CraftforAdmins} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/CreateStory" element={<ProtectedRoute element={CreateStory} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/CreateProduct" element={<ProtectedRoute element={CreateProduct} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/EventsForAdmin" element={<ProtectedRoute element={EventsForAdmin} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/EventsUpdateForm/:id" element={<EventsUpdateForm />}  allowedRoles={['administrador', 'empleado']} />         
            <Route path="/EventsForm" element={<ProtectedRoute element={EventsForm} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/LoginCompanies" element={<ProtectedRoute element={LoginCompanies} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/SalesOverview" element={<ProtectedRoute element={SalesOverview} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/UpdateCompany/:id" element={<ProtectedRoute element={UpdateCompany} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/UpdateProduct/:idProducto" element={<ProtectedRoute element={UpdateProducto} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/MaterialsForAdmin" element={<ProtectedRoute element={MaterialsForAdmin} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/MaterialsForm" element={<ProtectedRoute element={MaterialsForm} allowedRoles={['administrador', 'empleado']} />} />
            <Route path="/MaterialsUpdateForm/:id" element={<MaterialsUpdateForm />} />          </Routes>
        </EventsProvider>
      </EmpresaProvider>
    </Router>
  );
}

export default App;
