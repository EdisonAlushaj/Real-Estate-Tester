import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../Pages/App.jsx";
import Home from '../Pages/Home/home.jsx';
import About from '../Pages/AboutUs/About.jsx'
import Contact from '../Pages/Contact/contact.jsx'
import Property from '../Pages/Service/Properties.jsx'
import Login from   '../Pages/Login/login.jsx'
import LoginLayout from '../Pages/Login/LoginLayout.jsx'
import Register from '../Pages/Login/register.jsx'
import Dashboard from '../Pages/Dashboard/dashboard.jsx'
import PropertyDetails from "../Pages/Service/PropertyDetails.jsx";
import PropertyRentDetails from "../Pages/Service/PropertyRentDetails.jsx";
import PrivateRoute from '../../Application/Services/PrivateRoute';
import UserSummary from '../Pages/UserSummary/UserSummary.jsx'

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/app/home" />} />
        <Route path="/app" element={<MainLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="usersummary" element={<UserSummary />} />
            <Route path="contact" element={<Contact />} />
            <Route path="property" element={<Property />} />
            <Route path="property1/:id" element={<PropertyDetails />} />
            <Route path="property2/:id" element={<PropertyRentDetails />} />
        </Route>
        <Route path="/login" element={<LoginLayout />}>
            <Route index element={<Login />} />
        </Route>
        <Route path="/register" element={<LoginLayout />}>
            <Route index element={<Register/>} />
        </Route>
        <Route element={<PrivateRoute/>}>
            <Route index path='/dashboard' element={<Dashboard/>} />
        </Route>
    </Routes>
);

export default AppRoutes;