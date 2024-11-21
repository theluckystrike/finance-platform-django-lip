import React, { useEffect, useRef, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import { useNavigate } from "react-router-dom";
import CodeEdit from "../../Comopnent/CodeEditer/CodeEditer";
import { useSelector } from "react-redux";
import axios from "axios";
import { loginUSer } from "../../customHook/getrole";
import useToast from "../../customHook/toast";

const ScriptEdit = () => {
  const Navigate = useNavigate();
  const store: any = useSelector((i) => i);
  const ScriptData = store?.script?.Script;
  const handleToast = useToast();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState(ScriptData?.description || "");
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  const handleGetFile = () => {
    const url = ScriptData?.file; // Replace with your file URL
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setCode(xhr.responseText); // File content
      }
    };
    xhr.send();
  };

  useEffect(() => {
    // Fetch the code from the provided URL
    handleGetFile();
  }, [ScriptData]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const blob = new Blob([code], { type: "text/plain" });
    formData.append("file", blob, `${ScriptData?.name}.py`);
    formData.append("description", description);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}api/scripts/${ScriptData?.id}`, // Use the correct ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${loginUSer?.access}`,
          },
        }
      );

      if (response.status === 200) {
        Navigate(`/account/ScriptDetails/${ScriptData?.id}`);
        handleToast.SuccessToast(`New Category added successfully`);
        // Navigate after successful update
      }
    } catch (error) {
      console.error("Error updating script:", error);
    }
  };

  return (
    <>
      <div className="m-4">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
          <button className="btn mb-3" onClick={() => Navigate(-1)}>
            <Icon icon="ArrowBack" size="45px" color="dark" />
          </button>{" "}
          <h1 className="h1 fw-bold ">Editing ({ScriptData?.name})</h1>
        </div>

        <div className="d-flex justify-content-center">
          <form
            className="w-75"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">
                Description
              </label>
              <textarea
                rows={3}
                id="Description"
                name="Description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="Code" className="form-label">
                Code
              </label>
              <CodeEdit code={code} setCode={setCode} />
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
