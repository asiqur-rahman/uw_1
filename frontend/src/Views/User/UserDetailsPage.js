
import React from 'react';
import axios from 'axios';
import { useSearchParams} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import Moment from 'moment';

export default function UserDetailsPage(props) {
    const navigate = useNavigate();
    const  [searchparams]  = useSearchParams();
    console.log('token details ',props.token," id",searchparams.get("id"))

   //add/edit 
   const [userid, setid] = React.useState("");
   const [firstname, setfirstname] = React.useState("");
   const [lastname, setlastname] = React.useState("");
   const [email, setemail] = React.useState("");
   const [birthdate, setbirthdate] = React.useState("");
   const [phone, setphone] = React.useState("");
   const [gender, setgender] = React.useState("");
   const [idnumber, setidnumber] = React.useState("");
   const [address, setaddress] = React.useState("");
   const [seniority, setseniority] = React.useState("");
   const [experience, setexperience] = React.useState("");
   const [category, setcategory] = React.useState("");
   const [subcategory, setsubcategory] = React.useState("");
   const [password, setpassword] = React.useState("");
   const [ibyemail, setibyemail] = React.useState(true);
   const [ibywhatsapp, setibywhatsapp] = React.useState(true);
   const [comment, setcomment] = React.useState("");
   const [profilepic, setprofilepic] = React.useState("");
   const [file, setfile] = React.useState();
   const [deleted, setdeleted] = React.useState(true);
   const [verified, setverified] = React.useState(true);

const [itemData,setitemData] =React.useState( [])

  //get user by id ==> done
  async function fetchuserdetails() {

    try {
      let api = `${process.env.REACT_APP_API_KEY}/api/user/id/${searchparams.get("id")}`;

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
        setbirthdate(res.data.data.birthDate);
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
        setpassword(res.data.data.password);
        setfile(res.data.data.fileName);
        setibywhatsapp(res.data.data.whatsappInvitation ?? false);
        setibyemail(res.data.data.emailInvitation ?? false);
        setdeleted(res.data.data.deleted);
        setverified(res.data.data.verified);

      }
    } catch (error) {
      console.log(error);
    }

  }
  //get project images ==> not
  async function fetchPicture(){
    try {
      const res=await axios.get(`${process.env.REACT_APP_API_KEY}/getworkpic?userid=${searchparams.get("id")}`,{
       
        headers: {
          'Authorization': `Bearer ${props.token}`,
         
           'Content-Type': 'application/json'
    }
    });
    if(!res.data.error)
    setitemData(res.data.arr);
    console.log(res.data.arr);
    } catch (error) {
      console.log(error);
    }
  }
React.useEffect(()=>{

    fetchuserdetails();
    fetchPicture();
      },[])
      //delete image ==> not
      async function handleDelete(url){
        
        try {
          const res=await axios.post(`${process.env.REACT_APP_API_KEY}/deletepic`,{userid,url},{
           
            headers: {
                'Authorization': `Bearer ${props.token}`,
                
                'Content-Type': 'application/json'
        }
        });
        if(!res.data.error){
          let arr=[];
          for(let i=0;i<itemData.length;i++)
          if(itemData[i].url!=url)
          arr.push(itemData[i]);
          setitemData(arr);
        }
        } catch (error) {
          console.log(error);
        }
        
          }
  //back ==> done
  function back(){
    let nav = "/user"
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
              <h2 className="mt-3 me-3 font-weight-light text-small">الخدمه:خدمات فنية </h2>
              <h2 className="mt-3 me-3 font-weight-light text-small">التخصص: فني ديكور منزلي </h2>
              <h2 className="mt-3 me-3 font-weight-light text-small">مكان الإقامة الحالي:  {address}</h2>
   <h2 className="mt-3 me-3 font-weight-light text-small">تاريخ الميلاد:{birthdate} </h2>
   <h2 className="mt-3 me-3 font-weight-light text-small">    عدد سنوات الخبرة:  {seniority} سنوات </h2>
   <h2 className="mt-3 me-3 font-weight-light text-small">  موجز عن خبرتك </h2>
<p>{experience}</p>
<h2 className="mt-3 me-3 font-weight-light text-small">  تعليق  </h2>
<p>{comment}</p>
            </div>
            <div className="col-lg-6 img-wrapper">
            {itemData.map((item) => (
              <div className="content-img">
                <img src={`${process.env.REACT_APP_API_KEY}/?name=${item.url}`} className="rounded" alt="image"/>
                <div className="content-txt ">
                <span style={{cursor:"pointer"}} href='' onClick={() => handleDelete(item.url)}> <i className='mdi mdi-close'></i></span>
                    <span>تفاصيل المشروع هنا</span>
                    </div>
                </div>
            ))}

              </div>
              </div>
            </div>
                      </div>
                      </div>
                    

  );
}

