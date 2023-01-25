import  '../assets/css/style.css';
import '../assets/vendors/mdi/css/materialdesignicons.min.css';
import '../assets/vendors/css/vendor.bundle.base.css';
import '../App.css';
import NavbarPage from '../Components/NavbarPage';
import SidebarPage from '../Components/SidebarPage';
import FooterPage from '../Components/FooterPage';
import ContentPage from '../Components/ContentPage';
import { useSearchParams} from 'react-router-dom';
import React from 'react'; 

export default function  IndexPage() {

  const  [searchparams]  = useSearchParams();
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');

  console.log("stoooore token ",token," id ",id)

/*console.log("token ",searchparams.get("token")," id",searchparams.get("id"))*/
  return (
   
    <div className="container-scroller rtl" >
    <NavbarPage token={token} id={id}/>
    <div className="container-fluid page-body-wrapper">
    <SidebarPage token={token} id={id}/>
    <div className="main-panel">
      <ContentPage token={token} id={id}/>
     <FooterPage/>
     </div>
     </div>
    </div>
   
  );
}

