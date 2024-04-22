import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import App from "./App"

import Register from './Register';
import Login from './Login';
import ClientDashboard from "./ClientDashboard";
import FPDashboard from './FPDashboard';
import NewPost from './NewPost';
import Posts from './Posts';
import PostDetails from './PostDetails';
import PostReviews from './PostReviews';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';
import VerifyOTP from './VerifyOTP';
import ResetPassword from './ResetPassword';
import FpList from './FpList';
import Chat_list from './Chat_list';
import Chat from './Chat';
import ProfessionalChat from './ProfessionalChat';
import ProfessionalUserChat from './ProfessionalUserChat';
import UserChat from './UserChat';
import AdminDashboard from './AdminDashboard';
import Contact from "./Contact";


function Routing() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
         
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />}/>
          <Route path="/ClientDashboard" element={<ClientDashboard />} />
          <Route path="/FPDashboard" element={<FPDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/NewPost" element={<NewPost />} />
          <Route path="/Posts" element={<Posts />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/PostReviews" element={<PostReviews />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/VerifyOTP" element={<VerifyOTP />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/FpList" element={<FpList />} />  
          <Route path="/Chat_list" element={<Chat_list />} />  
          <Route path="/Chat" element={<Chat />} /> 
          <Route path="/ProfessionalChat" element={<ProfessionalChat />} /> 
          <Route path="/ProfessionalUserChat" element={<ProfessionalUserChat />} />
          <Route path="/UserChat" element={<UserChat />} />
          <Route path="/Contact" element={<Contact />} />


        </Routes>
      </BrowserRouter>
    
  );
}

export default Routing;

