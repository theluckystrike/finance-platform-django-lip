import { FC, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { v4 as uuidv4 } from 'uuid';
import useToast from "../../../../customHook/toast";
import Icon from "../../icon/Icon";
import { Createsummerys, GetsummeryByIDs, Updatesummeryss } from "../../../../Redux/TapeSummary/Slice";
import { FaEdit } from "react-icons/fa";
import { GetAllScripts } from "../../../../Redux/Script/ScriptSlice";
import Loader from "../../Loader";

// Define type for the script option
interface ScriptOption {
  value: string;
  label: string;
}

interface CreateReportsProps {
  show: boolean;
  handleClose: () => void;
  data: any;
}

const EditSummary: FC<CreateReportsProps> = ({ show, data, handleClose }) => {
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const handleToast = useToast();

  // Local state for form values
  const [name, setName] = useState(data?.name || "");
  const [scripts, setScripts] = useState<{ [key: string]: string }>({});
  const [selectedScriptId, setSelectedScriptId] = useState<string>("");
  const [columnName, setColumnName] = useState("");

  // Populate initial values when `data` changes
  useEffect(() => {
    if (data) {
      setName(data?.name || "");
      setScripts(
        data?.meta?.scripts
          ? Object.fromEntries(
              Object.entries(data?.meta?.scripts).map(([key, value]: any) => [key, value.table_col_name])
            )
          : {}
      );
    }
  }, [data]);

  const allscripts = store?.script?.Scripts?.results || [];
useEffect(()=>{

 
     dispatch(GetAllScripts({}));
  
},[])
  // Generate script options excluding already selected scripts
  const availableScriptOptions: ScriptOption[] = allscripts?allscripts
    .filter((script: any) => !scripts[script.id]) // Exclude selected scripts
    .map((script: any) => ({
      value: script.id,
      label: script.name,
    })):[];

  // Function to add a new script/column pair
  const addScript = () => {
    if (selectedScriptId && columnName) {
      setScripts((prevScripts) => ({
        ...prevScripts,
        [selectedScriptId]: columnName,
      }));
      setSelectedScriptId("");
      setColumnName("");
    }
  };
  const [load,setLoad]=useState(false)

  // Handle form submission
  const handleSubmit = async () => {
    const values = {
      name,
      scripts,
    };
    setLoad(true)
    // Dispatch the create report action
    await dispatch(Updatesummeryss({ values ,id:data?.id}));
  await  dispatch(GetsummeryByIDs({ id:data?.id }));
  setLoad(false)

    handleClose();
  };

  return (
    <Modal
      size="lg"
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Body className="bg-light-green" style={{ borderRadius: "25px" }}>
        <h5>Edit Tap Summary {data?.id}</h5>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-3">
            <div className="row mx-0 px-3">
              <div className="col-12 m-0">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form-control m-0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-5 mb-2">
                <label htmlFor="scripts" className="form-label">
                  Select Script
                </label>
                <Select
                  id="scripts"
                  options={availableScriptOptions}
                  value={availableScriptOptions.find(option => option.value === selectedScriptId) || null}
                  onChange={(selectedOption) => setSelectedScriptId(selectedOption ? selectedOption.value : "")}
                  placeholder="Select a Script"
                />
              </div>

              <div className="col-5 mb-2">
                <label htmlFor="column" className="form-label">
                  Column Name
                </label>
                <input
                  type="text"
                  id="column"
                  className="form-control"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  placeholder="Enter Column Name"
                />
              </div>

              <div className="col-2 mb-3 text-center">
                <label htmlFor="column" className="form-label invisible">
                  Name
                </label>
                <button type="button" className="btn btn-dark" onClick={addScript}>
                  <Icon size="20px" icon="Add" />
                </button>
              </div>

              {/* Display added scripts */}
              <div className="col-12" style={{ maxHeight: '200px', overflow: 'auto' }}>
                <h6>Scripts to Include:</h6>
                <ul>
                  {Object.entries(scripts).map(([id, column]) => (
                    <li key={uuidv4()}>
                      Script ID: {id}, Column: {column}{" "}
                      <FaEdit
                        onClick={() => {
                          setSelectedScriptId(id);
                          setColumnName(column);
                        }}
                        style={{ marginLeft: "8px", cursor: "pointer" }}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-12 row justify-content-evenly m-0">
                <button
                  onClick={handleClose}
                  className="btn btn-dark col-5 px-3 fw-bold"
                  type="button"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-dark col-5 px-3 fw-bold"
                >
                 {load ?'Loading....':' Update'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSummary;
