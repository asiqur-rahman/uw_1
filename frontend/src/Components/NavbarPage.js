import img2 from '../assets/images/faces/face4.jpg';
/*import logo from '../assets/images/mehna-logo.png';
import minilogo from '../assets/images/mini-mehna-logo.png';*/
import axios from 'axios';

import React from 'react';
import $ from 'jquery';
import {useNavigate} from "react-router-dom";

export default function NavbarPage(props) {
  const navigate=useNavigate();
  console.log('token nav',props.token)

//get user
  const  [firstname,setfirstname]=React.useState("");
  const  [lastname,setlastname]=React.useState("");
  const  [role,setRole]=React.useState(""); 
  const [dp,setdp]=React.useState("");
  const [id,setid]=React.useState();

//get user data ==> done
  async function fetchuserdetails(){
    try {
     
      const res=await axios.get(`${process.env.REACT_APP_API_KEY}/api/auth/whoami`,{
        headers: {
          'Authorization': `Bearer ${props.token}`,
           'Content-Type': 'application/json'
    }
    });
    if(!res.data.error)
   {
    setfirstname(res.data.data.firstName);
    setid(res.data.data.id);
    setlastname(res.data.data.lastName);
    setdp(res.data.data.profilePicture);
    setRole(res.data.data['role.name']);
   }
    } catch (error) {
      console.log(error);
    }
  }

React.useEffect(()=>{
    fetchuserdetails();

     },[])
    //logout ==> not
     async function logout(){
       try {
         const res=await axios.get(`${process.env.REACT_APP_API_KEY}/logout`,{
           headers: {
            'Authorization': `Bearer ${props.token}`,
             'Content-Type': 'application/json'
       }
       });
     if(!res.data.error)
     navigate("/");
     else
     alert("please try again later");
       } catch (error) {
         console.log(error);
         alert('an error occured');
       }
     }
    //fullscreen ==> done

    function openFullscreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
    // open sidebar ==> done
  var body = $('body');
  function opensider() {
    if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
      body.toggleClass('sidebar-hidden');
    } else {
      body.toggleClass('sidebar-icon-only');
    }
  }

  function openside() {
    $('.sidebar-offcanvas').toggleClass('active');

}
    // open dropdown ==> done

function openProfile() {
  document.getElementById("profileDropdown").classList.toggle("show");

}
  function openMessage() {
    document.getElementById("messageDropdown").classList.toggle("show");

  }
  function openNotif() {
    document.getElementById("notificationDropdown").classList.toggle("show");

  }
  document.body.addEventListener('click', hide, true); 

 function hide() {
  var element1 = document.getElementById("profileDropdown")
 if (element1.classList.contains("show")){
  element1.classList.toggle("show");
 }
 var element2 = document.getElementById("messageDropdown")
 if (element2.classList.contains("show")){
  element2.classList.toggle("show");
 }
 var element3 = document.getElementById("notificationDropdown")
 if (element3.classList.contains("show")){
  element3.classList.toggle("show");
 }
 }
function profile(){
  navigate("/profile")
}
     return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
  <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
   {/*  <span style={{cursor:"pointer"}} className="navbar-brand brand-logo" ><img src={logo} alt="logo" className='logo' /></span>
     <span style={{cursor:"pointer"}} className="navbar-brand brand-logo-mini"><img src={minilogo} alt="logo" className='logo'/></span>
    */}</div>
  <div className="navbar-menu-wrapper d-flex align-items-stretch">
    <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" onClick={() => opensider()}>
      <span className="mdi mdi-menu"></span>
    </button>
    <div className="search-field d-none d-md-block">
      <form className="d-flex align-items-center h-100" action="#">
        <div className="input-group">
          <div className="input-group-prepend bg-transparent">
            <i className="input-group-text border-0 mdi mdi-magnify"></i>
          </div>
          <input type="text" className="form-control bg-transparent border-0" placeholder="إبحث من هنا"/>
        </div>
      </form>
    </div>
    <ul className="navbar-nav navbar-nav-right">
      <li className="nav-item nav-profile dropdown">
      <span style={{cursor:"pointer"}} className="nav-link dropdown-toggle" onClick={() => openProfile()} href="#" data-bs-toggle="dropdown" aria-expanded="false">
          <div className="nav-profile-img">
            <img src={localStorage.getItem("profilePicture")} alt="image"/>
            <span className="availability-status online"></span>
          </div>
          <div className="nav-profile-text">
            <p className="mb-1 text-black">{firstname+" "+lastname}</p>
          </div>
        </span>
        <div className="dropdown-menu navbar-dropdown" id="profileDropdown" aria-labelledby="profileDropdown">
        <span style={{cursor:"pointer"}} className="dropdown-item" onClick={profile}>
            <i className="mdi mdi-cached me-2 text-success"></i> الحساب </span>
          <div className="dropdown-divider"></div>
          <span style={{cursor:"pointer"}} className="dropdown-item" onClick={logout}>
            <i className="mdi mdi-logout me-2 text-primary"></i> تسجيل الخروج </span>
        </div>
      </li>
      <li className="nav-item d-none d-lg-block full-screen-link">
      <span style={{cursor:"pointer"}} className="nav-link" onClick={() => openFullscreen()}>
          <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
        </span>
      </li>
      <li className="nav-item dropdown">
      <span style={{cursor:"pointer"}} className="nav-link count-indicator dropdown-toggle" onClick={() => openMessage()} href="#" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="mdi mdi-email-outline"></i>
          <span className="count-symbol bg-warning"></span>
        </span>
        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"id="messageDropdown"  aria-labelledby="messageDropdown">
          <h6 className="p-3 mb-0">رسائل</h6>
          <div className="dropdown-divider"></div>
          <span style={{cursor:"pointer"}} className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <img src={img2} alt="image" className="profile-pic"/>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject ellipsis mb-1 font-weight-normal">المستخدم يرسل لك رسالة</h6>
              <p className="text-gray mb-0"> قبل دقيقة </p>
            </div>
          </span>
          
          <div className="dropdown-divider"></div>
          <h6 className="p-3 mb-0 text-center">4 رسائل جديدة</h6>
        </div>
      </li>
      <li className="nav-item dropdown">
      <span style={{cursor:"pointer"}} className="nav-link count-indicator dropdown-toggle" onClick={() => openNotif()}  href="#" data-bs-toggle="dropdown">
          <i className="mdi mdi-bell-outline"></i>
          <span className="count-symbol bg-danger"></span>
        </span>
        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" id="notificationDropdown" aria-labelledby="notificationDropdown">
          <h6 className="p-3 mb-0">إشعارات</h6>
          <div className="dropdown-divider"></div>
          <span style={{cursor:"pointer"}} className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <div className="preview-icon bg-success">
                <i className="mdi mdi-calendar"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">حدث اليوم</h6>
              <p className="text-gray ellipsis mb-0"> مجرد تذكير بأن لديك حدثًا اليوم</p>
            </div>
          </span>
          <div className="dropdown-divider"></div>
          <span style={{cursor:"pointer"}} className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <div className="preview-icon bg-warning">
                <i className="mdi mdi-settings"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">إعدادات</h6>
              <p className="text-gray ellipsis mb-0">تحديث لوحة القيادة</p>
            </div>
          </span>
         
          <div className="dropdown-divider"></div>
          <h6 className="p-3 mb-0 text-center">اطلع على جميع الإشعارات</h6>
        </div>
      </li>
     
      <li className="nav-item nav-settings d-none d-lg-block">
      <span style={{cursor:"pointer"}} className="nav-link" href="#">
          <i className="mdi mdi-format-line-spacing"></i>
        </span>
      </li>
    </ul>
    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas" onClick={() => openside()}>
      <span className="mdi mdi-menu"></span>
    </button>
  </div>
</nav>
    );
}