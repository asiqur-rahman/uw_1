import  '../assets/css/style.css';
import '../assets/vendors/mdi/css/materialdesignicons.min.css';
import '../assets/vendors/css/vendor.bundle.base.css';
import '../App.css';
import axios from 'axios';
import { useState,useEffect } from 'react';

import UserPage from '../Views/User/UserPage';
import EmployerPage from '../Views/Employer/EmployerPage';

import ProfilePage from '../Views/Profile/ProfilePage';

import { Route, Routes} from 'react-router-dom';
import React from 'react';
import UserDetailsPage from '../Views/User/UserDetailsPage';
import EmployerDetailsPage from '../Views/Employer/EmployerDetailsPage';

export default function  ContentPage(props) {

  console.log('token content',props.token," id",props.id)
  
  //permission 
  const [getlistuser,setgetlistuser]=React.useState(false);//1
  const [getlistemployer,setgetlistemployer]=React.useState(false);//2

  const [getdetailsuser,setgetdetailsuser]=React.useState(false);//10
  const [getdetailsemployer,setgetdetailsemployer]=React.useState(false);//11

  const [getadduser,setgetadduser]=React.useState(false);//7
  const [getaddemployer,setgetaddemployer]=React.useState(false);//8

  const [getdeleteuser,setgetdeleteuser]=React.useState(false);//3
  const [getdeleteemployer,setgetdeleteemployer]=React.useState(false);//4

  const [getedituser,setgetedituser]=React.useState(false);//5
  const [geteditemployer,setgeteditemployer]=React.useState(false);//6

  const [getaddpermission,setgetaddpermission]=React.useState(false);//9

  useEffect(() => {

    //get employer permission
    async function fetchEmployerPermission(){
      try {
        const res=await axios.get(`${process.env.REACT_APP_API_KEY}/api/employee/id/${props.id}`,{
          headers: {
            'Authorization': `Bearer ${props.token}`,
             'Content-Type': 'application/json'
      }
      });
          if(!res.data.error)
         {
         console.log("employer permission ",res.data.data.permissions.length);
          for(let i=0;i<res.data.data.permissions.length;i++)
          if(res.data.data.permissions[i].permissionId===1)
          setgetlistuser(true);
          else  if(res.data.data.permissions[i].permissionId===2)
          setgetlistemployer(true);
          else  if(res.data.data.permissions[i].permissionId===3)
          setgetdeleteuser(true);
          else  if(res.data.data.permissions[i].permissionId===4)
          setgetdeleteemployer(true);
          else  if(res.data.data.permissions[i].permissionId===5)
          setgetedituser(true);
          else  if(res.data.data.permissions[i].permissionId===6)
          setgeteditemployer(true);
          else if(res.data.data.permissions[i].permissionId===7)
          setgetadduser(true);
          else if(res.data.data.permissions[i].permissionId===8)
          setgetaddemployer(true);
          else if(res.data.data.permissions[i].permissionId===9)
          setgetaddpermission(true);
          else  if(res.data.data.permissions[i].permissionId===10)
          setgetdetailsuser(true);
          else  if(res.data.data.permissions[i].permissionId===11)
          setgetdetailsemployer(true);
         }
          else
       console.log("nooo permission");
      } catch (error) {
          console.log(error);
      }
      }
      fetchEmployerPermission()

  
  },[]);
  return (
          <div className="content-wrapper">
           
          <Routes>
        <Route path='/user' element={<UserPage token={props.token} id={props.id} getlistuser={getlistuser} getdetailsuser={getdetailsuser} getadduser={getadduser} getdeleteuser={getdeleteuser} getedituser={getedituser}/>} />
        <Route path='/employer'  element={<EmployerPage token={props.token} id={props.id} getlistemployer={getlistemployer} getdetailsemployer={getdetailsemployer} getaddemployer={getaddemployer} getdeleteemployer={getdeleteemployer} geteditemployer={geteditemployer} />} />
        <Route path='/profile'  element={<ProfilePage token={props.token} id={props.id} />}  />
        <Route path='/employer/details'  element={<EmployerDetailsPage token={props.token}/>} />
        <Route path='/user/details'  element={< UserDetailsPage token={props.token}/>} />

      </Routes>

          </div>
  );
}

