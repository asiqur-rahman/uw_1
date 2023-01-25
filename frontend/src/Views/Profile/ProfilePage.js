import React from 'react';
import axios from 'axios';
import img2 from '../../assets/images/faces/face4.jpg';
import { useNavigate, createSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import Moment from 'moment';

import './style.css'

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
  const [profilepic, setprofilepic] = React.useState(false);
  const [deleted, setdeleted] = React.useState(true);
  const [verified, setverified] = React.useState(true);

  const [permissions, setpermissions] = useState([]);
  const [employee_permissions_array, setemployee_permissions_array] = useState([]);

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (!token) navigate('/');
  }, []);

  const getFileDetails =(arr,name) =>{
    const list = [];
    arr.forEach(element => {
      element.forEach(element => {
        if(element.folder==name){
          list.push({name:element.name,link:element.link.replace(':/','://')});
        }
      });
    });
    return list;
  }

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
        const files=getFileDetails(res.data.data.files,'profilePicture');
        setprofilepic(files[0]);
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
    <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
              <img class="rounded-circle mt-5" width="150px" src={profilepic?profilepic.link:img2}/><span class="font-weight-bold">Edogaru</span><span class="text-black-50">edogaru@mail.com.my</span><span> </span>
              <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button">Change Picture</button></div>
              </div>
        </div>
        <div class="col-md-5 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Profile Settings</h4>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels">Name</label><input type="text" class="form-control" value={firstname} placeholder="first name"  /></div>
                    <div class="col-md-6"><label class="labels">Lastname</label><input type="text" class="form-control" value={lastname} placeholder="surname"/></div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12"><label class="labels">Phone</label><input type="text" class="form-control" placeholder="enter phone number" value={phone} /></div>
                    <div class="col-md-12"><label class="labels">Email</label><input type="text" class="form-control" placeholder="Email" value={email} /></div>
                    <div class="col-md-12"><label class="labels">Gender</label><input type="text" class="form-control" placeholder="Gender" value={gender??"Other"} readOnly={true}/></div>
                    <div class="col-md-12"><label class="labels">Date of birth</label><input type="date" class="form-control" placeholder="enter address line 2" value={birthdate} /></div>
                    {/* <div class="col-md-12"><label class="labels">Category</label><input type="text" class="form-control" placeholder="enter address line 2" value={""} /></div> */}
                    {/* <div class="col-md-12"><label class="labels">Area</label><input type="text" class="form-control" placeholder="enter address line 2" value="" /></div> */}
                    {/* <div class="col-md-12"><label class="labels">Email ID</label><input type="text" class="form-control" placeholder="enter email id" value="" /></div> */}
                    {/* <div class="col-md-12"><label class="labels">Education</label><input type="text" class="form-control" placeholder="education" value="" /></div> */}
                </div>
                <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button">Save Profile</button></div>
            </div>
        </div>
        {/* <div class="col-md-4">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center experience"><span>Edit Experience</span><span class="border px-3 p-1 add-experience"><i class="fa fa-plus"></i>&nbsp;Experience</span></div><br/>
                <div class="col-md-12"><label class="labels">Experience in Designing</label><input type="text" class="form-control" placeholder="experience" value=""/></div> <br/>
                <div class="col-md-12"><label class="labels">Additional Details</label><input type="text" class="form-control" placeholder="additional details" value=""/></div>
            </div>
        </div> */}
    </div>
</div>
  );
}