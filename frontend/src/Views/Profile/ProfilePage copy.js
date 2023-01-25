import React from 'react';
import axios from 'axios';
import img2 from '../../assets/images/faces/face4.jpg';
import { useNavigate, createSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import Moment from 'moment';

export default function ProfilePage(props) {

  console.log('token profile ', props.token, " id ", props.id)

  const navigate = useNavigate();
  //permission employer
  const [listuser, setgetlistuser] = React.useState(false);//1
  const [listemployer, setgetlistemployer] = React.useState(false);//2

  const [detailsuser, setgetdetailsuser] = React.useState(false);//10
  const [detailsemployer, setgetdetailsemployer] = React.useState(false);//11

  const [adduser, setgetadduser] = React.useState(false);//7
  const [addemployer, setgetaddemployer] = React.useState(false);//8

  const [deleteuser, setgetdeleteuser] = React.useState(false);//3
  const [deleteemployer, setgetdeleteemployer] = React.useState(false);//4

  const [edituser, setgetedituser] = React.useState(false);//5
  const [editemployer, setgeteditemployer] = React.useState(false);//6

  const [addpermission, setgetaddpermission] = React.useState(false);//9

  const [userid, setid] = React.useState("");
  const [firstname, setfirstname] = React.useState("");
  const [lastname, setlastname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [birthdate, setbirthdate] = React.useState("");
  const [phone, setphone] = React.useState("");
  const [position, setposition] = React.useState("");
  const [gender, setgender] = React.useState("");
  const [idnumber, setidnumber] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [ibyemail, setibyemail] = React.useState(true);
  const [ibywhatsapp, setibywhatsapp] = React.useState(true);
  const [profilepic, setprofilepic] = React.useState("");
  const [deleted, setdeleted] = React.useState(true);
  const [verified, setverified] = React.useState(true);

  const [permissions, setpermissions] = useState([]);
  const [employee_permissions_array, setemployee_permissions_array] = useState([]);

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (!token) navigate('/');
  }, []);

  //get employer by id ==> done
  async function fetchuserdetails() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}/api/employee/id/${props.id}`, {

        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.data.error) {
        setid(res.data.data.id);
        setfirstname(res.data.data.firstName);
        setlastname(res.data.data.lastName);
        setemail(res.data.data.email);
        setbirthdate(res.data.data.birthDate);
        setphone(res.data.data.phone);
        setaddress(res.data.data.address);
        setprofilepic(res.data.data.profilePicture);
        setgender(res.data.data.gender);
        setidnumber(res.data.data.idNumber);
        setpassword(res.data.data.password);
        setposition(res.data.data.position);
        setibywhatsapp(res.data.data.whatsappInvitation);
        setibyemail(res.data.data.emailInvitation);
        setdeleted(res.data.data.deleted);
        setverified(res.data.data.verified);

        console.log("employer data ", res.data);
        for (let i = 0; i < res.data.data.permissions.length; i++)
          if (res.data.data.permissions[i].permissionId === 1) {
            setgetlistuser(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 2) {
            setgetlistemployer(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 3) {
            setgetdeleteuser(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 4) {
            setgetdeleteemployer(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 5) {
            setgetedituser(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 6) {
            setgeteditemployer(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 7) {
            setgetadduser(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 8) {
            setgetaddemployer(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 9) {
            setgetaddpermission(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 10) {
            setgetdetailsuser(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          } else if (res.data.data.permissions[i].permissionId === 11) {
            setgetdetailsemployer(true);
            editpermissions(res.data.data.permissions[i].permissionId);
          }
      }
    } catch (error) {
      console.log(error);
    }

  }
  React.useEffect(() => {
    fetchuserdetails();

  }, [])
  //get list permission ==> done
  async function fetchPermission() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}/api/auth/permissions/list`, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.data.error) {
        setpermissions(res.data);
        console.log("all permission ", res.data);
      }
      else
        console.log("nooo permission");
    } catch (error) {
      console.log(error);
    }
  }
  //edit permission ==> done
  function editpermissions(id) {

    // 👇️ check if array contains object
    const isFound = employee_permissions_array.some(element => {
      if (element.permissionId === id) {
        return true;
      }

      return false;
    });

    if (isFound) {
      console.log('✅ array contains object with id = 1');
      var index = employee_permissions_array.indexOf(id)
      if (index !== -1) {
        employee_permissions_array.splice(index, 1);
        this.setState(employee_permissions_array);
      }
    } else {
      setemployee_permissions_array(current => [...current, {
        "permissionId": id

      }]);
    }
    console.log('add permissionnnn ', employee_permissions_array);

  }
  //edit employer ==> not 
  async function updateChange() {
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/employee/id/${props.id}`;
      const body = {

        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "birthDate": birthdate,
        "phone": phone,
        "address": address,
        "gender": gender,
        "idNumber": idnumber,
        "position": position,
        "profilePicture": "url",
        "verified": verified,
        "deleted": deleted,
        "otpVerificationLink": "n/a",
        "whatsappInvitation": ibywhatsapp,
        "emailInvitation": ibyemail,
        "permissions": employee_permissions_array
      }
      const res = await axios.patch(api, body, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status == 200) {

        // console.log("update successful ", res.data);
        alert(res.data.message)
        closeNavEdit();
      }
      else
        alert(res.data.error);
    } catch (error) {
      console.log(error);
      alert('something went wrong');
    }
  }
  // open sidebar edit ==> done
  function openNavEdit(id) {

    if (!props.geteditemployer === true) {
      fetchPermission();
      document.getElementById("mySidenav_edit").style.width = "350px";

    } else {
      alert("you have nooo permission to edit employer")
    }


  }
  // close sidebar edit ==> done
  function closeNavEdit() {
    document.getElementById("mySidenav_edit").style.width = "0";
  }

  return (
    <div>
      <div id="mySidenav_edit" className="sidenav">
        <span style={{ cursor: "pointer" }} className="closebtn" onClick={() => closeNavEdit()} >&times;</span>
        <div className=" align-items-center ">
          <div className="flex-grow  mx-auto align-items-center ">

            <div className="p-4 contactFrom" id="contactForm">
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="f_name" id="f_name" placeholder="الاسم*" required value={firstname} onChange={(e) => setfirstname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="l_name" id="l_name" placeholder="اسم العائلة*" required value={lastname} onChange={(e) => setlastname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="position" id="position" placeholder=" مركز*" value={position} required onChange={(e) => setposition(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="email" name="email" id="email" placeholder="البريد الالكتروني" value={email} onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="phone" id="phone" placeholder="رقم الموبيل*" required value={phone} onChange={(e) => setphone(e.target.value)} />
              </div>

              <div className="form-group">
                <input className="form-control form-control-lg required" type="password" name="password" id="password" placeholder="كلمة المرور*" value={password} required onChange={(e) => setpassword(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="gender" id="gender" placeholder="الجنس" value={gender} onChange={(e) => setgender(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="idnumber" id="idnumber" placeholder="رقم الهوية" value={idnumber} onChange={(e) => setidnumber(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="date" name="date" id="date" placeholder="تاريخ الميلاد" value={birthdate} onChange={(date) => setbirthdate(Moment(date).format('yyyy-MM-DD'))} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="address" id="address" placeholder="مكان الاقامة الحالي" value={address} onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="whats" name="whats" value="whatsapp" onChange={(e) => setibywhatsapp(e.target.checked)} checked={ibywhatsapp} />
                <label > أرسل عبر الواتس اب</label>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="mail" name="mail" value="email" onChange={(e) => setibyemail(e.target.checked)} checked={ibyemail} />
                <label > ارسل بالبريد الإلكترونى</label>
              </div>
              <div className="form-group">
                <label > إذن الموظف</label>
              </div>
              {


                permissions.map((row) => (

                  (row.permissionId === 1) ?
                    <div className="form-group">
                      <input type="checkbox" id="listuser" className="m-l" checked={listuser} onChange={() => editpermissions(row.permissionId)} value="listuser" />
                      <label > الحصول على قائمة العملاء</label>
                    </div>
                    :
                    (row.permissionId === 2) ?
                      <div className="form-group">
                        <input type="checkbox" id="listemployer"
                          className="m-l" checked={listemployer} onChange={() => editpermissions(row.permissionId)} value="listemployer" />

                        <label > الحصول على قائمة الموظفين </label>
                      </div>
                      :
                      (row.permissionId === 3) ?
                        <div className="form-group">
                          <input type="checkbox" id="deleteuser"
                            className="m-l" checked={deleteuser} onChange={() => editpermissions(row.permissionId)} value="deleteuser" />

                          <label > حذف العميل</label>
                        </div>
                        :
                        (row.permissionId === 4) ?
                          <div className="form-group">
                            <input type="checkbox" id="deleteemployer"
                              className="m-l" checked={deleteemployer} onChange={() => editpermissions(row.permissionId)} value="deleteemployer" />

                            <label > حذف الموظفين</label>
                          </div>
                          :
                          (row.permissionId === 5) ?
                            <div className="form-group">
                              <input type="checkbox" id="edituser"
                                className="m-l" checked={edituser} onChange={() => editpermissions(row.permissionId)} value="edituser" />

                              <label >تحديث العملاء</label>
                            </div>
                            :
                            (row.permissionId === 6) ?
                              <div className="form-group">
                                <input type="checkbox" id="editemployer"
                                  className="m-l" checked={editemployer} onChange={() => editpermissions(row.permissionId)} value="editemployer" />

                                <label >تحديث الموظفين</label>
                              </div>
                              :
                              (row.permissionId === 7) ?
                                <div className="form-group">
                                  <input type="checkbox" id="adduser"
                                    className="m-l" checked={adduser} onChange={() => editpermissions(row.permissionId)} value="adduser" />

                                  <label >أضف العملاء</label>
                                </div>
                                :
                                (row.permissionId === 8) ?
                                  <div className="form-group">
                                    <input type="checkbox" id="addemployer"
                                      className="m-l" checked={addemployer} onChange={() => editpermissions(row.permissionId)} value="addemployer" />

                                    <label >أضف الموظفين</label>
                                  </div>
                                  :
                                  (row.permissionId === 9) ?
                                    <div className="form-group">
                                      <input type="checkbox" id="addpermission"
                                        className="m-l" checked={addpermission} onChange={() => editpermissions(row.permissionId)} value="addpermission" />

                                      <label >إضافة إذن</label>
                                    </div>
                                    :
                                    (row.permissionId === 10) ?
                                      <div className="form-group">
                                        <input type="checkbox" id="detailsuser"
                                          className="m-l" checked={detailsuser} onChange={() => editpermissions(row.permissionId)} value="detailsuser" />

                                        <label >تفاصيل العميل</label>
                                      </div>
                                      :
                                      (row.permissionId === 11) ?
                                        <div className="form-group">
                                          <input type="checkbox" id="detailsemployer"
                                            className="m-l" checked={detailsemployer} onChange={() => editpermissions(row.permissionId)} value="detailsemployer" />

                                          <label >تفاصيل الموظف</label>
                                        </div>
                                        :
                                        <p></p>
                ))


              }
              <div className="mx-auto">
                <button className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={() => updateChange(userid)} >تعديل </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-margin">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-top">
              <h4 className="card-title">الحساب </h4>
              <div className="justify-r">
                <span style={{ cursor: "pointer" }} onClick={() => openNavEdit()}> <i className="mdi mdi-pencil menu-icon"></i>تعديل</span>
              </div>
            </div>

            <div className='row mt-4'>
              <div className="col-lg-6">
                <div className=" d-flex  align-items-top">
                  <img src={localStorage.getItem("profilePicture")} className="img-sm rounded-circle me-3" alt="image" />
                  <div className="mb-0 flex-grow">
                    <h5 className="me-2 mb-2">{firstname + " " + lastname}</h5>
                    <p className="mb-0 font-weight-light text-small"> {email}
                    </p>
                  </div>
                </div>
                <h2 className="mt-3 me-3 font-weight-light text-small"> رقم الهوية : {idnumber}</h2>
                <h2 className="mt-3 me-3 font-weight-light text-small">رقم الهاتف المحمول: {phone}</h2>
                <h2 className="mt-3 me-3 font-weight-light text-small">الجنس  : {gender} </h2>
                <h2 className="mt-3 me-3 font-weight-light text-small">الموقع: {position} </h2>
                <h2 className="mt-3 me-3 font-weight-light text-small">مكان الإقامة الحالي:  {address}</h2>
                <h2 className="mt-3 me-3 font-weight-light text-small">تاريخ الميلاد:{birthdate} </h2>
              </div>
              <div className="col-lg-6">
                {
                  employee_permissions_array.map((row) => (
                    (row.permissionId === 1) ?
                      <p > الحصول على قائمة العملاء</p>
                      :
                      (row.permissionId === 2) ?
                        <p > الحصول على قائمة الموظفين </p>
                        :
                        (row.permissionId === 3) ?
                          <p > حذف العميل</p>
                          :
                          (row.permissionId === 4) ?
                            <p > حذف الموظفين</p>
                            :
                            (row.permissionId === 5) ?
                              <p >تحديث العملاء</p>
                              :
                              (row.permissionId === 6) ?
                                <p >تحديث الموظفين</p>
                                :
                                (row.permissionId === 7) ?
                                  <p >أضف العملاء</p>
                                  :
                                  (row.permissionId === 8) ?
                                    <p >أضف الموظفين</p>
                                    :
                                    (row.permissionId === 9) ?
                                      <p >إضافة إذن</p>
                                      :
                                      (row.permissionId === 10) ?
                                        <p >تفاصيل العميل</p>
                                        :
                                        (row.permissionId === 11) ?
                                          <p >تفاصيل الموظف</p>
                                          :
                                          <p></p>
                  ))}

              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
}