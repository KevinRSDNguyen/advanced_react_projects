import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserLayout from "../../../hoc/user";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Link } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlusCircle from "@fortawesome/fontawesome-free-solid/faPlusCircle";
import CircularProgress from "@material-ui/core/CircularProgress";

class AddFile extends Component {
  state = {
    formError: false,
    uploading: false,
    files: [] // Will be list of files stored on server
  };
  onDrop(files) {
    this.setState({ uploading: true });
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" }
    };
    formData.append("file", files[0]);
    axios
      .post("/api/users/uploadfile", formData, config)
      .then(response => {
        this.setState({
          formError: false,
          uploading: false
        });
        toast.success("Successfully Uploaded File.");
      })
      .catch(e => {
        this.setState({
          formError: false,
          uploading: false
        });
        toast.error(e.response.data.errors[0].detail);
      });
  }
  showFileList = () =>
    this.state.files
      ? this.state.files.map((item, i) => (
          <li key={i}>
            <Link to={`/api/users/download/${item}`} target="_blank">
              {item}
            </Link>
          </li>
        ))
      : null;
  componentDidMount() {
    axios
      .get("/api/users/admin_files")
      .then(({ data }) => {
        this.setState({ files: data });
      })
      .catch(err => {});
  }
  render() {
    return (
      <UserLayout>
        <ToastContainer />
        <h1>Upload File</h1>
        <div>
          <Dropzone
            onDrop={e => this.onDrop(e)}
            multiple={false}
            className="dropzone_box"
          >
            <div className="wrap">
              <FontAwesomeIcon icon={faPlusCircle} />
            </div>
          </Dropzone>
          {this.state.uploading ? (
            <div
              className="dropzone_box"
              style={{
                textAlign: "center",
                paddingTop: "60px"
              }}
            >
              <CircularProgress style={{ color: "#00bcd4" }} thickness={7} />
            </div>
          ) : null}
          <div style={{ clear: "both" }}>
            {this.state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : (
              ""
            )}
          </div>
          <hr />
          <div>
            <ul>{this.showFileList()}</ul>
          </div>
        </div>
      </UserLayout>
    );
  }
}

export default AddFile;
