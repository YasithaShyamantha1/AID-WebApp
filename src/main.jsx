import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import App from './App.jsx'
import HomePage from './pages/HomePage';
import HotelPage from './pages/HotelPage';
import RootLayout from './layouts/rootLayout';
import MainLayout from "./layouts/mainlayout";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
    <Route  element ={<RootLayout/>}/>
    <Route element={<MainLayout />}>
    <Route path="/" element ={<HomePage/>}/>
    <Route path="/hotels/:id" element ={<HotelPage/>}/>
    </Route>
    </Routes>
   
    
    </BrowserRouter>
  </StrictMode>
)
