import logo from '../../assets/images/mehna-logo.png';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import img2 from '../../assets/images/faces/face4.jpg';
import { useState } from 'react';
import axios from 'axios';
import React, { useEffect } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const [user_confirmed, setUser_confirmed] = useState(true);
  const [error, seterror] = useState(false);
  const [text, settext] = useState("");
  const [token, setToken] = useState("");
  // {phone,password}
  const [password, setpassword] = useState();
  const [newPassword, setNewPassword] = useState(false);
  const [phone, setphone] = useState();
  const [loading, setloading] = useState(false);

  // useEffect(() => {
  //   const result = searchparams.get('result');
  //   if (result && result == '200')
  //     alert("OTP Verified Successfully. Please login with your password.");
  //   else if (result && result == '100')
  //     alert("OTP Not Verified. Please click your verification link again.");
  // }, [searchparams]);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("permissions")
  }, []);

  async function handleClick() {
    setloading(true);
    seterror(false);
    console.log("passss ", password, " api ",)

    try {
      const res = await axios.post(`http://38.242.208.116:3002/api/auth/login`, {
        "username": phone,
        "password": password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.status == 200 && res.data.user_confirmed==true) {
        console.log("ress ", res.data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.user_id);
        const image = res.data.picture && res.data.picture.length>0 && res.data.picture[0].length>0 ? res.data.picture[0][0].link.replace('http:/','http://'): img2
        localStorage.setItem("profilePicture", image);
        localStorage.setItem("permissions", JSON.stringify({ data: res.data.permission, user_id: res.data.user_id }));

        if (res.data.user_role == 'root') navigate({ pathname: '/user' });
        if (res.data.user_role == 'employee') navigate({ pathname: '/user' });
        if (res.data.user_role == 'user') navigate({ pathname: '/profile' });

      } 
      else if (res.data.status == 200 && res.data.user_confirmed==false) {
        if(res.data.user_role == 'employee'){
          setToken(res.data);
          setUser_confirmed(res.data.user_confirmed);
        }else{

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("id", res.data.user_id);
          const image = res.data.picture && res.data.picture.length>0 && res.data.picture[0].length>0 ? res.data.picture[0][0].link.replace('http:/','http://'): img2
          localStorage.setItem("profilePicture", image);
          localStorage.setItem("permissions", JSON.stringify({ data: res.data.permission, user_id: res.data.user_id }));


          if (res.data.user_role == 'root') navigate({ pathname: '/user' });
          if (res.data.user_role == 'employee') navigate({ pathname: '/user' });
          if (res.data.user_role == 'user') navigate({ pathname: '/profile' });

        }
      }
      else {
        if (res.data?.message) alert(res.data.message)
        seterror(true);
        settext(res.data.error);
      }

    } catch (error) {
      console.log("errrrrr ", error);
      seterror(true);
      settext("هناك خطأ ما ");
    }
    setloading(false);
  }

  async function handleUpdate() {
    setloading(true);
    seterror(false);
    console.log("passss ", password, " api ",)

    try {
      await axios.post(`http://38.242.208.116:3002/api/auth/updatePass`, {
        "newPassword": newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        }
      }).then(result=>{
        if(result.data.status==200){
          alert("Password updated successfully")
          localStorage.setItem("token", token.token);
          localStorage.setItem("id", token.user_id);
          const image = token.picture && token.picture.length>0 && token.picture[0].length>0 ? token.picture[0][0].link.replace('http:/','http://'): img2
          localStorage.setItem("profilePicture", image);
          localStorage.setItem("permissions", JSON.stringify({ data: token.permission, user_id: token.user_id }));

          if (token.user_role == 'root') navigate({ pathname: '/user' });
          if (token.user_role == 'employee') navigate({ pathname: '/user' });
          if (token.user_role == 'user') navigate({ pathname: '/profile' });

        }else{
          alert(result.data.message??"Failed");
        }
      })

    } catch (error) {
      console.log("errrrrr ", error);
      seterror(true);
      settext("هناك خطأ ما ");
    }
    setloading(false);
  }

  return (
    <div className="container-scroller rtl">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo">
                  <img src={logo} />
                </div>
                <h4>مرحبًا! هيا بنا نبدأ</h4>
                <h6 className="font-weight-light">تسجيل الدخول للمتابعة.</h6>
                <form className="pt-3">
                  <div className="form-group">
                    <input type="phone" className="form-control form-control-lg" id="phone" placeholder="رقم الهاتف" onChange={(e) => setphone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="password" readOnly={!user_confirmed} className="form-control form-control-lg" id="password" placeholder="كلمة المرور" onChange={(e) => setpassword(e.target.value)} />
                  </div>
                  
                  {!user_confirmed &&
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" id="newpassword" placeholder="كلمة سر جديدة" onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  }
                  <div className="mt-3">
                    {user_confirmed ? <button className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={handleClick} disabled={loading}  >تسجيل الدخول</button>:
                    <button className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={handleUpdate} disabled={loading}  >تسجيل الدخول</button>}
                  </div>
                  <div className="mt-3">
                    {error && <p>{text}</p>}

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