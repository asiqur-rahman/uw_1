import React from 'react';
import axios from 'axios';
import img2 from '../../assets/images/faces/face4.jpg';
import { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from "react-router-dom";
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default function UserPage(props) {
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

  //add/edit 
  const [userid, setid] = React.useState("");
  const [firstname, setfirstname] = React.useState("");
  const [lastname, setlastname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [birthdate, setbirthdate] = React.useState(new Date());
  const [phone, setphone] = React.useState("");
  const [gender, setgender] = React.useState(false);
  const [idnumber, setidnumber] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [seniority, setseniority] = React.useState("");
  const [experience, setexperience] = React.useState("");
  const [category, setcategory] = React.useState(false);
  const [subcategory, setsubcategory] = React.useState(false);
  const [ibyemail, setibyemail] = React.useState(true);
  const [ibywhatsapp, setibywhatsapp] = React.useState(true);
  const [comment, setcomment] = React.useState("");
  const [profilepic, setprofilepic] = React.useState("");
  const [file, setfile] = React.useState();
  const [deleted, setdeleted] = React.useState(true);
  const [verified, setverified] = React.useState(true);
  const [userPermission, setUserPermission] = React.useState([]);

  const [pictureFiles, setPictureFiles] = React.useState(true);
  const [fileFiles, setFileFiles] = React.useState(true);
  //get
  const [rows, setrows] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subcategories, setsubcategories] = useState([]);

 //get user ==> done
  async function fetchUserList() {
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/user/list`;

      const res = await axios.get(api, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.data.error && res.data.data)
        setrows(res.data.data);

      console.log('users list ', res.data.data)


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
    if (permission.filter(x=>x.permissionName==='getusers').length>0)
      fetchUserList();
    else
      console.log("you have no permission to get list user")
  }, [props.getlistuser]);

  //send mail ==> done
  async function sendemail(id) {

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_KEY}/api/user/sendmail/id/${id}`, { link: "http://localhost:3000" }, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status===200)
        alert("Invite sent successfully");
      else
        alert(res.data?.message??'Falied');
    } catch (error) {
      console.log(error);
      alert('failed');
    }

  }
  //send whatsapp data  ==> not
  async function sendwhatsapp(id) {

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_KEY}/api/user/sendwhatsapp/id/${id}`, { userid: id, isuser: true }, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status===200)
        alert("Invite sent successfully");
      else
        alert(res.data?.message??'Falied');
    } catch (error) {
      console.log(error);
      alert('failed');
    }
  }
  //delete user ==> we should add popup for asking delete or no before
  async function handledelete(id) {

    // if (props.getdeleteuser === true) {
    if (userPermission.filter(x=>x.permissionName==='deleteuser').length>0){
      try {
        let api = `${process.env.REACT_APP_API_KEY}/api/user/id/${id}`;
        const res = await axios.delete(api, {
          headers: {
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.data.error)
          console.log("success");
        else
          console.log('falied');
      } catch (error) {
        console.log(error);
        console.log('failed');
      }
    } else {
      alert("you have nooo perminssion to delete user")
    }

  }
  // open sidebar add ==> done
  function openNavAdd() {
    if (userPermission.filter(x=>x.permissionName==='adduser').length>0){
    // if (props.getadduser === true) {
      document.getElementById("mySidenav_add").style.width = "350px";
      //get categories
      getcategorieslist();

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

      //input file
      let fileInput = document.getElementById("file-upload-input");
      let fileSelect = document.getElementsByClassName("file-upload-select")[0];
      fileSelect.onclick = function () {
        fileInput.click();
      }
      fileInput.onchange = function () {
        let filename = fileInput.files[0].name;
        let selectName = document.getElementsByClassName("file-select-name")[0];
        selectName.innerText = filename;
      }
      //input images
      let imagesInput = document.getElementById("images-upload-input");
      let imagesSelect = document.getElementsByClassName("images-upload-select")[0];
      imagesSelect.onclick = function () {
        imagesInput.click();
      }
      imagesInput.onchange = function () {
        let filename = imagesInput.files[0].name;
        let filenumber = imagesInput.files.length;
        let selectName = document.getElementsByClassName("images-select-name")[0];
        selectName.innerText = "إجمالي الصور: " + filenumber;
      }
    } else {
      alert("you have nooo permission to add user")
    }

  }
    // close sidebar add ==> done
  function closeNavAdd() {
    document.getElementById("mySidenav_add").style.width = "0";
  }
    // open  sidebar edit ==> done
  function openNavEdit(id) {
    if (props.getedituser === true) {
      document.getElementById("mySidenav_edit").style.width = "350px";
      fetchuserdetails(id);
    } else {
      alert("you have nooo permission to edit user")
    }


  }
    // close sidebar edit ==> done
  function closeNavEdit() {
    document.getElementById("mySidenav_edit").style.width = "0";
  }
  //get user by id ==> done
  async function fetchuserdetails(id) {

    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/user/id/${id}`;

      const res = await axios.get(api, {
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
        if (res.data.data.birthDate)
          setbirthdate(Moment(new Date(res.data.data.birthDate)).format('yyyy-MM-DD'));
        setphone(res.data.data.phone);
        setaddress(res.data.data.address);
        setseniority(res.data.data.seniority.toString());
        setexperience(res.data.data.experience);
        setcomment(res.data.data.comments);
        setprofilepic(res.data.data.profilePicture);
        setgender(res.data.data.gender);
        setidnumber(res.data.data.idNumber);
        setcategory(res.data.data.categoryId);
        setsubcategory(res.data.data.subCategoryId);
        setibywhatsapp(res.data.data.whatsappInvitation ?? false);
        setibyemail(res.data.data.emailInvitation ?? false);
        setdeleted(res.data.data.deleted);
        setverified(res.data.data.verified);

        getcategorieslist(res.data.data.categoryId)
      }
    } catch (error) {
      console.log(error);
    }

  }
  //add user  ==> done
  async function handleSubmit() {
    if (!email || !phone) {
      alert('please fill the fields');
      return;
    }
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/user`;
      const body = {

        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "birthDate": birthdate,
        "phone": phone,
        "address": address,
        "gender": gender?gender:"Male",
        "idNumber": idnumber,
        "seniority": seniority.toString(),
        "experience": experience,
        "comments": comment,
        "categoryId": Number(category?category:categories[0].id),
        "subCategoryId": Number(subcategory?subcategory:subcategories[0].id),
        "whatsappInvitation": ibywhatsapp ?? false,
        "emailInvitation": ibyemail ?? false,
        "permissions": []
      };
      await axios.post(api, body
        , {
          headers: {
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json'
          }
        }).then(result => {
          if (result.data.status === 201) {
            fileUpload(false, pictureFiles, result.data.message.split(":")[1], "profilePicture");
            fileUpload(false, fileFiles, result.data.message.split(":")[1], "file");
            setrows([...rows,body]);
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
   //upload profile picture, file, images user ==> done
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
  //edit user ==> update picture, file.. too
  async function updateChange(id) {
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/user/id/${id}`;
      const body = {

        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "birthDate": birthdate,
        "phone": phone,
        "address": address,
        "gender": gender??"Male",
        "idNumber": idnumber,
        "seniority": seniority,
        "experience": experience,
        "comments": comment,
        "profilePicture": "url",
        "activityPicture": "url",
        "categoryId": category,
        "subCategoryId": subcategory,
        "whatsappInvitation": ibywhatsapp,
        "emailInvitation": ibyemail
      };
      const res = await axios.patch(api,
        body, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status == 200) {
        fetchUserList();
        // console.log("update successful ", res.data);
        alert(res.data.message)
        closeNavEdit();
      }
      else
        alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert('something went wrong');
    }
  }
  //details user ==> done
  function openDetails(id) {
    if (props.getdetailsuser === true) {
      let nav = "/user/details"

      navigate({
        pathname: nav,
        search: createSearchParams({
          id: id,
        }).toString()
      })
    } else {
      alert("you have nooo permission to get details user")
    }
  }
  //get list category ==> not
  async function getcategorieslist(id){
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/category/list`;

      const res = await axios.get(api, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status==200){
        setcategories(res.data.data);
        getsubcategorieslist(id??res.data.data[0].id)
      }
      

      console.log('categories list ', res.data.data)


    } catch (error) {
      console.log(error);
    }
  } 
  //get sub categories list when selecting category ==> not
  const onChangeHandler = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index]
    const option =  el.getAttribute('id');  
    console.log("selected cat ",option)
    setcategory(index)
    getsubcategorieslist(option)
  }
  async function getsubcategorieslist(id){
    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/subcategory/bycategory/id/${id}`;

      await axios.get(api, {
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        if (res.data.status==200){
          setsubcategories(res.data.data);
        }
      })

    } catch (error) {
      console.log(error);
    }
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
                <input className="form-control form-control-lg required" type="email" name="email" id="email" placeholder="البريد الالكتروني" onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="phone" name="phone" id="phone" placeholder="رقم الموبيل*" required onChange={(e) => setphone(e.target.value)} />
              </div>
              <div className="form-group">
                {/* <input className="form-control form-control-lg required" type="text" name="gender" id="gender" placeholder="الجنس" required onChange={(e) => setgender(e.target.value)} /> */}
                <select className="form-control form-control-lg" onChange={(e) => setgender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="idnumber" id="idnumber" placeholder="رقم الهوية" required onChange={(e) => setidnumber(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="date" name="date" id="date" placeholder="تاريخ الميلاد" onChange={(date) => setbirthdate(Moment(date).format('yyyy-MM-DD'))} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="address1" id="address1" placeholder="مكان الاقامة الحالي" onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="form-group">

                <select className="form-control form-control-lg" onChange={onChangeHandler}> 
                {categories.map((row) => (
                  <option id={row.id} value={row.id}>{row.name}</option>
                ))}
                </select>

              </div>
              <div className="form-group">

                <select className="form-control form-control-lg" onChange={e => setsubcategory(e.target.value)}>
                {subcategories.map((row) => (
                  <option id={row.id} value={row.id}>{row.name}</option>
                ))}
                </select>

              </div>

              <div className="form-group">
                <div className="file-upload">
                  <div className="file-upload-select">
                    <div className="file-select-button" > سيرتك الذاتية </div>
                    <div className="file-select-name">لم يتم اختيار أي ملف...</div>
                    <input type="file" name="file-upload-input" id="file-upload-input" onChange={(e) => setFileFiles(e.target.files[0])} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="number" name="number" id="number" placeholder="عدد سنوات الخبرة" onChange={(e) => setseniority(e.target.value)} />
              </div>
              <div className="form-group">
                <textarea className="form-control form-control-lg required" name="experience" id="experience" placeholder="موجز عن خبرتك...." onChange={(e) => setexperience(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <textarea className="form-control form-control-lg required" name="con_message2" id="con_message2" placeholder="استفسار او تعليق...." onChange={(e) => setcomment(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <div className="images-upload">
                  <div className="images-upload-select">
                    <div className="images-select-button" > صور النشاط  </div>
                    <div className="images-select-name">لم يتم اختيار أي صور...</div>
                    <input type="file" name="images-upload-input[]" id="images-upload-input" multiple />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="whats" name="whats" value="whatsapp" onChange={(e) => setibywhatsapp(e.target.checked)} />
                <label > أرسل عبر الواتس اب</label>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="mail" name="mail" value="email" onChange={(e) => setibyemail(e.target.checked)} />
                <label > ارسل بالبريد الإلكترونى</label>
              </div>






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
                <div className="picture-upload">
                  <div className="picture-upload-select">
                    <div className="picture-select-button" >الصوره الشخصيه </div>
                    <div className="picture-select-name">لم يتم اختيار أي صورة...</div>
                    <input type="file" name="picture-upload-input" id="picture-upload-input" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="f_name" id="f_name" placeholder="الاسم*" required value={firstname} onChange={(e) => setfirstname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="l_name" id="l_name" placeholder="اسم العائلة*" required value={lastname} onChange={(e) => setlastname(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="email" name="email" id="email" placeholder="البريد الالكتروني" value={email} onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="phone" id="phone" placeholder="رقم الموبيل*" required value={phone} onChange={(e) => setphone(e.target.value)} />
              </div>

              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="gender" id="gender" placeholder="الجنس" value={gender} required onChange={(e) => setgender(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="idnumber" id="idnumber" placeholder="رقم الهوية" value={idnumber} required onChange={(e) => setidnumber(e.target.value)} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="date" name="date" id="date" placeholder="تاريخ الميلاد" value={birthdate} onChange={(date) => setbirthdate(Moment(date).format('yyyy-MM-DD'))} />
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="text" name="address" id="address" placeholder="مكان الاقامة الحالي" value={address} onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="form-group">

                <select className="form-control form-control-lg" onChange={onChangeHandler}> 
                  {categories.map((row) => (
                    <option id={row.id} value={row.id}>{row.name}</option>
                  ))}
                </select>

              </div>
              <div className="form-group">

                <select className="form-control form-control-lg" onChange={e => setsubcategory(e.target.value)}>
                {subcategories.map((row) => (
                  <option id={row.id} value={row.id} selected={subcategory==row.id}>{row.name}</option>
                ))}
                </select>

              </div>
              <div className="form-group">
                <div className="file-upload">
                  <div className="file-upload-select">
                    <div className="file-select-button" > سيرتك الذاتية </div>
                    <div className="file-select-name">لم يتم اختيار أي ملف...</div>
                    <input type="file" name="file-upload-input" id="file-upload-input" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className="form-control form-control-lg required" type="number" name="number" id="number" placeholder="عدد سنوات الخبرة" value={seniority} onChange={(e) => setseniority(e.target.value)} />
              </div>
              <div className="form-group">
                <textarea className="form-control form-control-lg required" name="con_message1" id="con_message1" placeholder="موجز عن خبرتك...." value={experience} onChange={(e) => setexperience(e.target.value)} ></textarea>
              </div>
              <div className="form-group">
                <textarea className="form-control form-control-lg required" name="con_message2" id="con_message2" placeholder="استفسار او تعليق...." value={comment} onChange={(e) => setcomment(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <div className="images-upload">
                  <div className="images-upload-select">
                    <div className="images-select-button" > صور النشاط  </div>
                    <div className="images-select-name">لم يتم اختيار أي صور...</div>
                    <input type="file" name="images-upload-input[]" id="images-upload-input" multiple />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="whats" name="whats" value="whatsapp" onChange={(e) => setibywhatsapp(e.target.checked)} checked={ibywhatsapp} />
                <label > أرسل عبر الواتس اب</label>
              </div>
              <div className="form-group">
                <input className='m-l' type="checkbox" id="mail" name="mail" value="email" onChange={(e) => setibyemail(e.target.checked)} checked={ibyemail} />
                <label > ارسل بالبريد الإلكترونى</label>
              </div>

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
              <h4 className="card-title">الحرفاء</h4>
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
                  {rows.map(row => 
                    <tr>
                      <td>
                        <img src={row.image && row.image.length>0 && row.image[0].length>0 ? row.image[0][0].link.replace('http:/','http://'): img2} className="me-2" alt="image" /> {row.firstName + " " + row.lastName}
                      </td>
                      <td> {row.email}</td>
                      <td> {row.phone}</td>
                      <td>  <span style={{ cursor: "pointer" }} onClick={() => sendwhatsapp(row.id)}><i className="mdi mdi-whatsapp menu-icon"></i></span></td>
                      <td> <span style={{ cursor: "pointer" }} onClick={() => sendemail(row.id)} > <i className="mdi mdi-email-outline menu-icon"></i></span></td>
                      <td> <span style={{ cursor: "pointer" }} > {row.verified?"Yes":"No"}</span></td>
                      <td>   <span style={{ cursor: "pointer" }} onClick={() => openDetails(row.id)} > <i className="mdi mdi-account-card-details-outline menu-icon"></i></span></td>
                      <td>   <span style={{ cursor: "pointer" }} onClick={() => openNavEdit(row.id)}> <i className="mdi mdi-pencil-outline menu-icon"></i></span></td>
                      <td>  <span style={{ cursor: "pointer" }} onClick={() => deleteConfirm(row.id)}><i className="mdi mdi-delete-outline menu-icon"></i></span></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}