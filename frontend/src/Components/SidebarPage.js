import React from 'react';
import img2 from '../assets/images/faces/face4.jpg';
import { NavLink} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function SidebarPage(props) {

  console.log('token side',props.token)
  
  const navigate=useNavigate();

//get user
  const  [firstname,setfirstname]=React.useState("");
  const  [lastname,setlastname]=React.useState("");
  const  [role,setRole]=React.useState("");
  const  [email,setemail]=React.useState("");
  const [dp,setdp]=React.useState("");
  const [id,setid]=React.useState();

React.useEffect(()=>{
  async function fetchuserdetails(){
    try {
     
      const res=await axios.get(`${process.env.REACT_APP_API_KEY}/api/employee/id/${props.id}`,{
        headers: {
          'Authorization': `Bearer ${props.token}`,
           'Content-Type': 'application/json'
    }
    });
    if(!res.data.error)
   {
    console.log('user nav ',res.data.data)

    setfirstname(res.data.data.firstName);
    setid(res.data.data.id);
    setlastname(res.data.data.lastName);
    setemail(res.data.data.email);
    setdp(res.data.data.profilePicture);
    setRole(res.data.data['role.name']);
   }
    } catch (error) {
      console.log(error);
    }
  }
  fetchuserdetails();  
     },[])
     async function logout(){
      console.log('logggggouuuuut')
      try {
        const res=await axios.get(`${process.env.REACT_APP_API_KEY}/logout`,{
          headers: {
           'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json'
      }
      });
    if(!res.data.error)
    navigate("/login");
    else
    alert("please try again later");
      } catch (error) {
        console.log(error);
        alert('an error occured');
      }
    }
    return (
<nav className="sidebar sidebar-offcanvas" id="sidebar">
  <ul className="nav">
    <li className="nav-item nav-profile">
    <span style={{cursor:"pointer"}} className="nav-link">
        <div className="nav-profile-image">
          <img src={localStorage.getItem("profilePicture")} alt="profile"/>
          <span className="login-status online"></span>
        </div>
        <div className="nav-profile-text d-flex flex-column">
          <span className="font-weight-bold mb-2"> {firstname+" "+lastname}</span>
          <span className="text-secondary text-small"> {email}</span>
        </div>
      </span>
    </li>
    {(role=='root' || role=='employee') &&
    <li className="nav-item">
    <NavLink   to='/user' className="nav-link">
        <span className="menu-title">مقدمي الخدمة</span>
        <i className="mdi mdi-account-group menu-icon"></i>
      </NavLink>
    </li>}
    {role=='root' &&
    <li className="nav-item">
    <NavLink   to='/employer' className="nav-link">{/*{`${path}/employer`} */}
        <span className="menu-title">فريق مهنة</span>
        <i className="mdi mdi-account-supervisor menu-icon"></i>
      </NavLink>
    </li>}
    <li className="nav-item">
    <NavLink  to='/profile' className="nav-link" >
        <span className="menu-title">الحساب</span>
        <i className="mdi mdi-account menu-icon"></i>
      </NavLink>
    </li>
    <li className="nav-item">
    {/* <span style={{cursor:"pointer"}} className="nav-link" onClick={logout}>
        <span className="menu-title">تسجيل الخروج</span>
        <i className="mdi mdi-logout menu-icon"></i>
      </span> */}
      <NavLink  to='/login' className="nav-link" >
        <span className="menu-title">تسجيل الخروج</span>
        <i className="mdi mdi-account menu-icon"></i>
      </NavLink>
    </li>
   
  </ul>
</nav>
    );
}