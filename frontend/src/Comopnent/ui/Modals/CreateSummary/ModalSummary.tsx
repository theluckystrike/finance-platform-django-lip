import { FC, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { v4 as uuidv4 } from 'uuid';
import useToast from "../../../../customHook/toast";
import Icon from "../../icon/Icon";
import { Createsummerys } from "../../../../Redux/TapeSummary/Slice";

// Define type for the script option
interface ScriptOption {
  value: string;
  label: string;
}

interface CreateReportsProps {
  show: boolean;
  handleClose: () => void;
}

const CreateSummary: FC<CreateReportsProps> = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const handleToast = useToast();

  const allscripts = store?.script?.Scripts?.results || [];

  // State to manage form values
  const [name, setName] = useState("");
  const [scripts, setScripts] = useState<{ [key: string]: string }>({});
  const [selectedScriptId, setSelectedScriptId] = useState<string>("");
  const [columnName, setColumnName] = useState("");

  // Generate script options excluding already selected scripts
  const availableScriptOptions: ScriptOption[] = allscripts
    .filter((script: any) => !scripts[script.id]) // Exclude selected scripts
    .map((script: any) => ({
      value: script.id,
      label: script.name,
    }));

  // Function to add a new script/column pair
  const addScript = () => {
    if (selectedScriptId && columnName) {
      setScripts((prevScripts) => ({
        ...prevScripts,
        [selectedScriptId]: columnName,
      }));
      setSelectedScriptId("");
      setColumnName("");
    } else {
      // handleToast("Please select a script and enter a column name", "error");
    }
  };

  // Handle form submission
  const handleSubmit =async () => {
    const values = {
      name,
      scripts,
    };
    
    
    // Dispatch the create report action
  await  dispatch(Createsummerys({values}));
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
        <h5>Create Tap Summary</h5>

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
                      Script ID: {id}, Column: {column}
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
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSummary;
