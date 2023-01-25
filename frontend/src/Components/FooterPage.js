import React from 'react';

export default function FooterPage() {
    return (
        <footer className="footer">
        <div className="container-fluid d-flex justify-content-between">
          <span className="text-muted d-block text-center text-sm-start d-sm-inline-block">حقوق النشر © Ntic Med 2023</span>
          <span className="float-none float-sm-end mt-1 mt-sm-0 text-end"> منصة  <span style={{cursor:"pointer"}} >مهنة</span> الالكترونية</span>
        </div>
      </footer> 
    );
}