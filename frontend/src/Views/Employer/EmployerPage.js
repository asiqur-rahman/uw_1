import React from 'react';
import axios from 'axios';
import img2 from '../../assets/images/faces/face4.jpg';
import { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from "react-router-dom";
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function EmployerPage(props) {

  const navigate = useNavigate();

  const deleteConfirm = (id) => {
    confirmAlert({
      title: 'Confirmation',
      message: 'Are you sure you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handledelete(id)
        },
        {
          label: 'No'
        }
      ]
    });
  };

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

  //add/edit 
  const [userid, setid] = React.useState("");
  const [firstname, setfirstname] = React.useState("");
  const [lastname, setlastname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [birthdate, setbirthdate] = React.useState(new Date());
  const [phone, setphone] = React.useState("");
  const [position, setposition] = React.useState("");
  const [gender, setgender] = React.useState("Male");
  const [idnumber, setidnumber] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [ibyemail, setibyemail] = React.useState(true);
  const [ibywhatsapp, setibywhatsapp] = React.useState(true);
  const [profilepic, setprofilepic] = React.useState("");
  const [deleted, setdeleted] = React.useState(true);
  const [verified, setverified] = React.useState(true);
  const [userPermission, setUserPermission] = React.useState([]);

  const [permissions_array, setpermissions_array] = useState([]);
  const [employee_permissions_array, setemployee_permissions_array] = useState([]);
  const [pictureFiles, setPictureFiles] = React.useState(true);

  //get
  const [rows, setrows] = useState([]);
  const [permissions, setpermissions] = useState([]);

  //get employee ==> done
  async function fetchUserList() {
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/employee/list`;
      const res = await axios.get(api, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.data.error && res.data.data)
        setrows(res.data.data);

      console.log('employer list ', res.data)

    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    var token=localStorage.getItem("token");
    if(!token)navigate('/');
  }, []);

  useEffect(() => {
    var permission=localStorage.getItem("permissions");
    if(permission)permission=JSON.parse(permission);
    permission=permission.data;
    setUserPermission(permission);
    if (permission.filter(x=>x.permissionName==='getemployes').length>0)
      fetchUserList();
    else
      console.log("you have no permission to ge list employer")

  }, []);

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
  //send mail ==> done
  async function sendemail(id) {

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_KEY}/api/user/sendmail/id/${id}`, { link: "n/a" }, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status === 200)
        alert("Invite sent successfully");
      else
        alert(res.data?.message ?? 'Falied');
    } catch (error) {
      console.log(error);
      alert('failed');
    }

  }
  //send whatsapp data ==> not
  async function sendwhatsapp(id) {

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_KEY}/whatsapp`, { userid: id, isuser: false }, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.data.error)
        alert("Invite sent successfully");
      else
        alert('falied');
    } catch (error) {
      console.log(error);
      alert('failed');
    }
  }
  //delete employee ==>  we should add popup for asking delete or no before
  async function handledelete(id) {

    if (userPermission.filter(x=>x.permissionName==='deleteemploye').length>0) {
      try {
        let api = `${process.env.REACT_APP_API_KEY}/api/employee/id/${id}`;
        const res = await axios.delete(api, {
          headers: {
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.data.status == 200) {
          alert(res.data?.message ?? 'Deleted Success');
          fetchUserList()
        }
        else
          alert(res.data?.message ?? 'falied');
      } catch (error) {
        console.log(error);
        alert('failed');
      }
    } else {
      alert("you have nooo perminssion to delete employer")
    }

  }
  // open sidebar add ==> done
  function openNavAdd() { 
    if (userPermission.filter(x=>x.permissionName==='addemploye').length>0) {
      fetchPermission();
      document.getElementById("mySidenav_add").style.width = "350px";
      //input picture
      let pictureInput = document.getElementById("picture-upload-input");
      let pictureSelect = document.getElementsByClassName("picture-upload-select")[0];
      pictureSelect.onclick = function () {
        pictureInput.click();
      }
      pictureInput.onchange = function () {
        let filename = pictureInput.files[0].name;
        let selectName = document.getElementsByClassName("picture-select-name")[0];
        selectName.innerText = filename;
      }

    } else {
      alert("you have nooo permission to add employer")
    }

  }
  // close sidebar add ==> done
  function closeNavAdd() {
    document.getElementById("mySidenav_add").style.width = "0";
  }
  // open sidebar edit ==> done
  function openNavEdit(id) {

    if (props.geteditemployer === true) {
      fetchPermission();
      fetchuserdetails(id);
      document.getElementById("mySidenav_edit").style.width = "350px";

    } else {
      alert("you have nooo permission to edit employer")
    }


  }
  // close sidebar edit ==> done
  function closeNavEdit() {
    document.getElementById("mySidenav_edit").style.width = "0";
  }
  //get employer by id ==> done
  async function fetchuserdetails(id) {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}/api/employee/id/${id}`, {

        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status == 200) {
        setid(res.data.data.id);
        setfirstname(res.data.data.firstName);
        setlastname(res.data.data.lastName);
        setemail(res.data.data.email);
        if (res.data.data.birthDate)
          setbirthdate(Moment(new Date(res.data.data.birthDate)).format('yyyy-MM-DD'));
        setphone(res.data.data.phone);
        setaddress(res.data.data.address);
        setprofilepic(res.data.data.profilePicture);
        setgender(res.data.data.gender);
        setidnumber(res.data.data.idNumber);
        setposition(res.data.data.position);
        setibywhatsapp(res.data.data.whatsappInvitation);
        setibyemail(res.data.data.emailInvitation);
        setdeleted(res.data.data.deleted);
        setverified(res.data.data.verified);

        console.log("employer permission ", res.data.data.permissions.length);
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
          else {
            alert(res.data.message)
          }
      }
    } catch (error) {
      console.log(error);
    }

  }
  //add  employer ==> not 
  async function handleSubmit() {
    if (!email || !phone) {
      alert('please fill the fields');
      return;
    }
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/employee`;
      const body = {
        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "birthDate": birthdate,
        "phone": phone,
        "address": address,
        "gender": gender ?? "Male",
        "idNumber": idnumber,
        "position": position,
        "whatsappInvitation": ibywhatsapp,
        "emailInvitation": ibyemail,
        "permissions": permissions_array
      }
      await axios.post(api, body, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      }).then(result => {
        if (result.data.status === 201) {
          fileUpload(false, pictureFiles, result.data.message.split(":")[1], "profilePicture");
          setrows([...rows, body]);
          closeNavAdd();
          alert(result.data.message);
        }
        else {
          alert(result.data.message);
        }
      })
        .catch(e => {
          if (e.response?.data?.message) alert(e.response?.data?.message);
        })

    } catch (error) {
      console.log(error);
      alert('failed');
    }

  }
  //edit employer ==> not 
  async function updateChange(id) {
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/employee/id/${id}`;
      const body = {

        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "birthDate": birthdate,
        "phone": phone,
        "address": address,
        "gender": gender ?? "Male",
        "idNumber": idnumber,
        "position": position,
        "whatsappInvitation": ibywhatsapp ?? false,
        "emailInvitation": ibyemail ?? false,
        "permissions": employee_permissions_array
      }
      const res = await axios.patch(api, body, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status == 200) {
        fetchUserList()
        // console.log("update successful ", res.data);
        alert("Employee updated successfully")
        closeNavEdit();
      }
      else
        alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert('something went wrong');
    }
  }
  //upload profile picture employer ==> done
  const fileUpload = async (filesArr, file, id, name) => {
    if (!filesArr && !file) return false;
    const data = new FormData();
    if (filesArr)
      filesArr.forEach(element => {
        data.append(`file`, element);
      });
    if (file) data.append(`file`, file);
    let api = `${process.env.REACT_APP_API_KEY}/api/file/${id}&${name}`;
    await axios.post(api, data, {
      headers: {
        'Authorization': `Bearer ${props.token}`,
        "Content-Type": "multipart/form-data",
      }
    })
      .then(res => {
        console.log(res.data?.message)
      })
      .catch(function (e) {
        if (e.response?.data?.message) alert(e.response?.data?.message);
      });
  }

  //details user ==> done
  function openDetails(id) {
    if (props.getdetailsemployer === true) {
      let nav = "/employer/details"

      navigate({
        pathname: nav,
        search: createSearchParams({
          id: id,
        }).toString()
      })
    } else {
      alert("you have nooo permission to get details employer")
    }
  }
  //add permission ==> done
  function addpermissions(id) {

    // 👇️ check if array contains object
    const isFound = permissions_array.some(element => {
      if (element.permissionId === id) {
        return true;
      }

      return false;
    });

    if (isFound) {
      console.log('✅ array contains object with id = 1');
      var index = permissions_array.indexOf(id)
      if (index !== -1) {
        permissions_array.splice(index, 1);
        this.setState(permissions_array);
      }
    } else {
      setpermissions_array(current => [...current, {
        "permissionId": id

      }]);
    }
    console.log('add permissionnnn ', permissions_array);

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

  return (

    <div>
      <div id="mySidenav_add" className="sidenav">
        <span style={{ cursor: "pointer" }} className="closebtn" onClick={() => closeNavAdd()} >&times;</span>
        <div className=" align-items-center ">
          <div className="flex-grow  mx-auto align-items-center ">

            <div className="p-4 contactFrom" id="contactForm">
              <div className="form-group">
                <div className="picture-upload">
                  <div className="picture-upload-select">
                    <div className="picture-select-button" >الصوره الشخصيه </div>
                    <div className="picture-select-name">لم يتم اختيار أي صورة...</div>
                    <input type="file" name="picture-upload-input" id="picture-upload-input" onChange={(e) => setPictureFiles(e.target.files[0])} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="f_name" id="f_name" placeholder="الاسم*" required onChange={(e) => setfirstname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="l_name" id="l_name" placeholder="اسم العائلة*" required onChange={(e) => setlastname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="position" id="position" placeholder=" مركز*" required onChange={(e) => setposition(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="email" name="email" id="email" placeholder="البريد الالكتروني" onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="phone" name="phone" id="phone" placeholder="رقم الموبيل*" required onChange={(e) => setphone(e.target.value)} />
              </div>

              <div className="form-group">
                {/* <input  className="form-control form-control-lg required" type="text" name="gender" id="gender" placeholder="الجنس"  onChange={(e)=>setgender(e.target.value)}/> */}
                <select className="form-control form-control-lg" onChange={(e) => setgender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="idnumber" id="idnumber" placeholder="رقم الهوية" onChange={(e) => setidnumber(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="date" name="date" id="date" placeholder="تاريخ الميلاد" onChange={(date) => setbirthdate(Moment(date).format('yyyy-MM-DD'))} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="address1" id="address1" placeholder="مكان الاقامة الحالي" onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="whats" name="whats" value="whatsapp" onChange={(e) => setibywhatsapp(e.target.checked)} />
                <label > أرسل عبر الواتس اب</label>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="mail" name="mail" value="email" onChange={(e) => setibyemail(e.target.checked)} />
                <label > ارسل بالبريد الإلكترونى</label>
              </div>

              <div className="form-group">
                <label > إذن الموظف</label>
              </div>
              {permissions.map((row) => (

                  (row.id === 1) ?
                    <div className="form-group" key={row.id}>
                      <input type="checkbox" id="userlist"
                        className="m-l" value="userlist" onChange={() => addpermissions(row.id)} />

                      <label > الحصول على قائمة العملاء</label>
                    </div>
                    :
                    (row.id === 2) ?
                      <div className="form-group" key={row.id}>
                        <input type="checkbox" id="employerlist"
                          className="m-l" value="employerlist" onChange={() => addpermissions(row.id)} />

                        <label > الحصول على قائمة الموظفين </label>
                      </div>
                      :
                      (row.id === 3) ?
                        <div className="form-group" key={row.id}>
                          <input type="checkbox" id="deleteuser"
                            className="m-l" value="deleteuser" onChange={() => addpermissions(row.id)} />

                          <label > حذف العميل</label>
                        </div>
                        :
                        (row.id === 4) ?
                          <div className="form-group" key={row.id}>
                            <input type="checkbox" id="deleteemployer"
                              className="m-l" value="deleteemployer" onChange={() => addpermissions(row.id)} />

                            <label > حذف الموظفين</label>
                          </div>
                          :
                          (row.id === 5) ?
                            <div className="form-group" key={row.id}>
                              <input type="checkbox" id="edituser"
                                className="m-l" value="edituser" onChange={() => addpermissions(row.id)} />

                              <label >تحديث العملاء</label>
                            </div>
                            :
                            (row.id === 6) ?
                              <div className="form-group" key={row.id}>
                                <input type="checkbox" id="editemployer"
                                  className="m-l" value="editemployer" onChange={() => addpermissions(row.id)} />

                                <label >تحديث الموظفين</label>
                              </div>
                              :
                              (row.id === 7) ?
                                <div className="form-group" key={row.id}>
                                  <input type="checkbox" id="adduser"
                                    className="m-l" value="adduser" onChange={() => addpermissions(row.id)} />

                                  <label >أضف العملاء</label>
                                </div>
                                :
                                (row.id === 8) ?
                                  <div className="form-group" key={row.id}>
                                    <input type="checkbox" id="addemployer"
                                      className="m-l" value="addemployer" onChange={() => addpermissions(row.id)} />

                                    <label >أضف الموظفين</label>
                                  </div>
                                  :
                                  (row.id === 9) ?
                                    <div className="form-group" key={row.id}>
                                      <input type="checkbox" id="addpermission"
                                        className="m-l" value="addpermission" onChange={() => addpermissions(row.id)} />

                                      <label >إضافة إذن</label>
                                    </div>
                                    :
                                    (row.id === 10) ?
                                      <div className="form-group" key={row.id}>
                                        <input type="checkbox" id="detailsuser"
                                          className="m-l" value="detailsuser" onChange={() => addpermissions(row.id)} />

                                        <label >تفاصيل العميل</label>
                                      </div>
                                      :
                                      (row.id === 11) ?
                                        <div className="form-group" key={row.id}>
                                          <input type="checkbox" id="detailsemployer"
                                            className="m-l" value="detailsemployer" onChange={() => addpermissions(row.id)} />

                                          <label >تفاصيل الموظف</label>
                                        </div>
                                        :
                                        <p></p>
                ))

              }





              <div className="mx-auto">
                <button className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" onClick={handleSubmit} >اضف </button>
              </div>
            </div>


          </div>
        </div>
      </div>
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

                  (row.id === 1) ?
                    <div className="form-group">
                      <input type="checkbox" id="listuser" className="m-l" checked={listuser} onChange={() => editpermissions(row.id)} value="listuser" />
                      <label > الحصول على قائمة العملاء</label>
                    </div>
                    :
                    (row.id === 2) ?
                      <div className="form-group">
                        <input type="checkbox" id="listemployer"
                          className="m-l" checked={listemployer} onChange={() => editpermissions(row.id)} value="listemployer" />

                        <label > الحصول على قائمة الموظفين </label>
                      </div>
                      :
                      (row.id === 3) ?
                        <div className="form-group">
                          <input type="checkbox" id="deleteuser"
                            className="m-l" checked={deleteuser} onChange={() => editpermissions(row.id)} value="deleteuser" />

                          <label > حذف العميل</label>
                        </div>
                        :
                        (row.id === 4) ?
                          <div className="form-group">
                            <input type="checkbox" id="deleteemployer"
                              className="m-l" checked={deleteemployer} onChange={() => editpermissions(row.id)} value="deleteemployer" />

                            <label > حذف الموظفين</label>
                          </div>
                          :
                          (row.id === 5) ?
                            <div className="form-group">
                              <input type="checkbox" id="edituser"
                                className="m-l" checked={edituser} onChange={() => editpermissions(row.id)} value="edituser" />

                              <label >تحديث العملاء</label>
                            </div>
                            :
                            (row.id === 6) ?
                              <div className="form-group">
                                <input type="checkbox" id="editemployer"
                                  className="m-l" checked={editemployer} onChange={() => editpermissions(row.id)} value="editemployer" />

                                <label >تحديث الموظفين</label>
                              </div>
                              :
                              (row.id === 7) ?
                                <div className="form-group">
                                  <input type="checkbox" id="adduser"
                                    className="m-l" checked={adduser} onChange={() => editpermissions(row.id)} value="adduser" />

                                  <label >أضف العملاء</label>
                                </div>
                                :
                                (row.id === 8) ?
                                  <div className="form-group">
                                    <input type="checkbox" id="addemployer"
                                      className="m-l" checked={addemployer} onChange={() => editpermissions(row.id)} value="addemployer" />

                                    <label >أضف الموظفين</label>
                                  </div>
                                  :
                                  (row.id === 9) ?
                                    <div className="form-group">
                                      <input type="checkbox" id="addpermission"
                                        className="m-l" checked={addpermission} onChange={() => editpermissions(row.id)} value="addpermission" />

                                      <label >إضافة إذن</label>
                                    </div>
                                    :
                                    (row.id === 10) ?
                                      <div className="form-group">
                                        <input type="checkbox" id="detailsuser"
                                          className="m-l" checked={detailsuser} onChange={() => editpermissions(row.id)} value="detailsuser" />

                                        <label >تفاصيل العميل</label>
                                      </div>
                                      :
                                      (row.id === 11) ?
                                        <div className="form-group">
                                          <input type="checkbox" id="detailsemployer"
                                            className="m-l" checked={detailsemployer} onChange={() => editpermissions(row.id)} value="detailsemployer" />

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
              <h4 className="card-title">العملاء </h4>
              <div className="justify-r">
                <span onClick={() => openNavAdd()} style={{ cursor: "pointer" }}> <i className="mdi mdi-plus menu-icon"></i>اضف</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th> الاسم </th>
                    <th> البريد الالكتروني </th>
                    <th> رقم الموبيل </th>
                    <th>  واتساب </th>
                    <th>بريد الكتروني</th>
                    <th>تم التحقق</th>
                    <th> تفاصيل </th>
                    <th> تعديل </th>
                    <th> حذف </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <img src={row.image && row.image.length>0 && row.image[0].length>0 ? row.image[0][0].link.replace('http:/','http://'): img2} className="me-2" alt="image" /> {row.firstName + " " + row.lastName}
                      </td>
                      <td> {row.email}</td>
                      <td> {row.phone}</td>
                      <td>  <span style={{ cursor: "pointer" }} onClick={() => sendwhatsapp(row.id)}><i className="mdi mdi-whatsapp menu-icon"></i></span></td>
                      <td> <span style={{ cursor: "pointer" }} onClick={() => sendemail(row.id)}> <i className="mdi mdi-email-outline menu-icon"></i></span></td>
                      <td> <span style={{ cursor: "pointer" }} > {row.verified?"Yes":"No"}</span></td>
                      <td>   <span style={{ cursor: "pointer" }} onClick={() => openDetails(row.id)}> <i className="mdi mdi-account-card-details-outline menu-icon"></i></span></td>
                      <td>   <span style={{ cursor: "pointer" }} onClick={() => openNavEdit(row.id)}> <i className="mdi mdi-pencil-outline menu-icon"></i></span></td>
                      <td>  <span style={{ cursor: "pointer" }} onClick={() => deleteConfirm(row.id)}><i className="mdi mdi-delete-outline menu-icon"></i></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}