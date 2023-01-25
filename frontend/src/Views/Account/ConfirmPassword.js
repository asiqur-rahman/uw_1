import logo from '../../assets/images/mehna-logo.png';
import {useNavigate} from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function  ConfirmPassword() {
    const navigate = useNavigate();

    const [error,seterror]=useState(false);
    const [text,settext]=useState("");
    // {phone,password}
    const [password,setpassword]=useState();
    const [confirmpassword,setconfirmpassword]=useState();

    async function handleClick(){
        seterror(false);
        console.log("passss ",password," api ",)
       
        try {
            const res=await axios.post(`http://38.242.208.116:3002/api/auth/login`,{
              "password":password,
              "confirmpassword":confirmpassword,
          },{
              headers: {
                  'Content-Type': 'application/json'
            }
            });
          
            if(!res.data.error){
              console.log("ress ",res.data);
             
              localStorage.setItem("token",res.data.token);
              localStorage.setItem("id",res.data.user_id);

            navigate({
              pathname:'/user',

             /* search:createSearchParams({
                token:res.data.token,
                id:res.data.user_id
              }).toString()*/
        });
      }else{
                seterror(true);
                settext(res.data.error);
            }

        } catch (error) {
            console.log("errrrrr ",error);
            seterror(true);
            settext("هناك خطأ ما ");
        }
    }
    return (
<div className="container-scroller rtl">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo">
                  <img src={logo}/>
                </div>
                <h4>مرحبًا!</h4>
                <h6 className="font-weight-light"> تعديل كلمة المرور للمتابعة.</h6>
                <form className="pt-3">
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="password" placeholder="كلمة المرور" onChange={(e)=>setpassword(e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="confirmpassword" placeholder=" تأكيد كلمة المرور " onChange={(e)=>setconfirmpassword(e.target.value)} />
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={handleClick}  >تسجيل الدخول</button>
                  </div>
                  <div className="mt-3">
                  {error &&   <p>{text}</p>}

                  </div>
                  
                </form>

               

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}