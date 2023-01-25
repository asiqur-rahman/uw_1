
import React from 'react';
import axios from 'axios';
import { useSearchParams} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import Moment from 'moment';
import { useState,useEffect } from 'react';

export default function EmployerDetailsPage(props) {
    const navigate = useNavigate();
    const  [searchparams]  = useSearchParams();

    console.log('token details ',props.token," id",searchparams.get("id"))

 //permission employer
 const [listuser,setgetlistuser]=React.useState(false);//1
 const [listemployer,setgetlistemployer]=React.useState(false);//2

 const [detailsuser,setgetdetailsuser]=React.useState(false);//10
 const [detailsemployer,setgetdetailsemployer]=React.useState(false);//11

 const [adduser,setgetadduser]=React.useState(false);//7
 const [addemployer,setgetaddemployer]=React.useState(false);//8

 const [deleteuser,setgetdeleteuser]=React.useState(false);//3
 const [deleteemployer,setgetdeleteemployer]=React.useState(false);//4

 const [edituser,setgetedituser]=React.useState(false);//5
 const [editemployer,setgeteditemployer]=React.useState(false);//6

 const [addpermission,setgetaddpermission]=React.useState(false);//9
    //add/edit 
    const [userid,setid]=React.useState("");
    const [firstname,setfirstname]=React.useState("");
    const [lastname,setlastname]=React.useState("");
    const [email,setemail]=React.useState("");
    const [birthdate,setbirthdate]=React.useState("");
    const [phone,setphone]=React.useState("");
    const [position,setposition]=React.useState("");
    const [gender,setgender]=React.useState("");
    const [idnumber,setidnumber]=React.useState("");
    const [address,setaddress]=React.useState("");
    const [password,setpassword]=React.useState("");
    const [ibyemail,setibyemail]=React.useState(true);
    const [ibywhatsapp,setibywhatsapp]=React.useState(true);
  const [profilepic,setprofilepic]=React.useState("");
  const [deleted,setdeleted]=React.useState(true);
  const [verified,setverified]=React.useState(true);

  const [employee_permissions_array, setemployee_permissions_array] = useState([]);

   //get employer by id ==> done
  async function fetchuserdetails(){
    try {
      const res=await axios.get(`${process.env.REACT_APP_API_KEY}/api/employee/id/${searchparams.get("id")}`,{
       
        headers: {
          'Authorization': `Bearer ${props.token}`,
          'Content-Type': 'application/json'
    }
    });
    if(!res.data.error)
   {
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

    console.log("employer permission ",res.data.data);
    for(let i=0;i<res.data.data.permissions.length;i++)
    if(res.data.data.permissions[i].permissionId===1){
    setgetlistuser(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===2){
    setgetlistemployer(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===3){
    setgetdeleteuser(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===4){
    setgetdeleteemployer(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===5){
    setgetedituser(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===6){
    setgeteditemployer(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else if(res.data.data.permissions[i].permissionId===7){
    setgetadduser(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else if(res.data.data.permissions[i].permissionId===8){
    setgetaddemployer(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else if(res.data.data.permissions[i].permissionId===9){
    setgetaddpermission(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===10){
    setgetdetailsuser(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }else  if(res.data.data.permissions[i].permissionId===11){
    setgetdetailsemployer(true);
    getpermissions(res.data.data.permissions[i].permissionId);
    }
   }
    } catch (error) {
      console.log(error);
    }
  
  }
React.useEffect(()=>{
    
    fetchuserdetails();
      },[])
          //edit permission ==> done
   function getpermissions(id){

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
  }else{
    setemployee_permissions_array(current => [...current, {
      "permissionId": id
   
  }]);
}
console.log('add permissionnnn ',employee_permissions_array);

   }
//back
  function back(){
    let nav = "/employer"
    navigate({
      pathname:nav,
     
})
}
  return (
    <div className="grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-top">
                    <h4 className="card-title">التفاصيل </h4>
                    <div className="justify-r">
                        <span onClick={() => back()} style={{cursor:"pointer"}}> <i className="mdi mdi-arrow-left menu-icon"></i></span>
                      </div>
                      </div>
                      <div className='row mt-4'>
                      <div className="col-lg-6">
                      <div className=" d-flex  align-items-top">
              <img src={`${process.env.REACT_APP_API_KEY}/?name=${profilepic}`} className="img-sm rounded-circle me-3" alt="image"/>
              <div className="mb-0 flex-grow">
                <h5 className="me-2 mb-2">{firstname+" "+lastname}</h5>
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
        (row.permissionId === 5)?  
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
                    

  );
}

