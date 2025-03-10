import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import App from './App.jsx'
import HomePage from './pages/HomePage';
import HotelPage from './pages/HotelPage';
import CreateHotelPage from './pages/CreateHotel'
import RootLayout from './layouts/rootLayout';
import MainLayout from "./layouts/mainlayout";
import HotelHomePage from './pages/HotelHomePage';
import SignInPage from './pages/signInPage';
import SignUpPage from './pages/signUpPage';
import { store } from "./lib/store";
import { Provider } from "react-redux";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
    <Route  element ={<RootLayout/>}/>
    <Route element={<MainLayout />}>
    <Route path="/" element ={<HomePage/>}/>
    <Route path="/hotels" element ={<HotelPage/>}/>
    <Route path="/hotels/:id" element ={<HotelHomePage/>}/>
    <Route path="/hotels/create" element={<CreateHotelPage />} />
    </Route>
    
    <Route path="/sign-in" element={<SignInPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
   
    
    </BrowserRouter>
    </Provider>
  </StrictMode>
)
