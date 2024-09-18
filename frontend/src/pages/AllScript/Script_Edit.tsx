import React, { useEffect, useRef, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";

import { useNavigate } from "react-router-dom";

import CodeEdit from "../../Comopnent/CodeEditer/CodeEditer";
import { useSelector } from "react-redux";
import axios from "axios";
 

const ScriptEdit = () => {
  const Navigate = useNavigate();
  const store: any = useSelector((i) => i);

  const ScriptData = store?.script?.Script;


  const [code, setCode] = useState('');
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const codeRef = useRef()
  const objectRef:any = useRef(null);

  const handleGetFile = () => {

    const url = ScriptData?.file; // Replace with your file URL
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setCode(xhr.responseText); // File content
      }
    };
    xhr.send();
  }
    // // Access the object element via the ref
    // if (objectRef.current) {
    //   const file = objectRef.current.data;
    //   //console.log(objectRef.current,'objectRef.current'); // or use the file value as needed

    //   if (file) {
    //     fetch(file)
    //       .then((response) => response.text())
    //       .then((data) => {
    //         //console.log("File content:", data); // Here is where you get the content of the file
    //       })
    //       .catch((error) => console.error("Error fetching file:", error));
    //   }
    // }
    // }
 
  useEffect(() => {
    // Fetch the code from the provided URL
    handleGetFile()
  }, [ScriptData]);

  return (
    <>
      <div className="m-4 ">
        <div className="d-flex  flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
          <button className="btn mb-3" onClick={() => Navigate(-1)}>
            <Icon icon="ArrowBack" size="45px" color="dark" />
          </button>{" "}
          <h1 className="h1 fw-bold ">
            Editing ({ScriptData?.name})
          </h1>
        </div>
     
        <div className="d-flex justify-content-center">
          <form className="w-75" method="post" encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">
                Description
              </label>
              <textarea
                rows={3}
                id="Description"
                name="Description"
                className="form-control"
                value={ScriptData?.description}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="Code" className="form-label">
                Code
              </label>
              {/* <textarea
              rows={15}
              id="Code"
              name="Code"
              className="form-control"
            /> */}
   {/* <object data={ScriptData?.file} ref={objectRef} type="text/plain" style={{ width: '100%', height:  '600px',background:'white' }}>
        <p>Your browser does not support displaying .py files.</p>
      </object> */}
              <CodeEdit code={code} setCode={setCode}/>
            </div>

            <div className="mx-auto text-center">
              <button type="submit" className="btn btn-dark px-5">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ScriptEdit;
