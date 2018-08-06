import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import FormField from "../utils/Form/formfield";

import { connect } from "react-redux";
import { updateUserData, auth } from "../../actions/user_actions";

import {
  update,
  generateData,
  isFormValid,
  populateFields
} from "../utils/Form/formActions";

class UpdatePersonalNfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: "input",
        value: "",
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter your name"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      },
      lastname: {
        element: "input",
        value: "",
        config: {
          name: "lastname_input",
          type: "text",
          placeholder: "Enter your lastname"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      },
      email: {
        element: "input",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email"
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      }
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, "update_user");
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, "update_user");
    let formIsValid = isFormValid(this.state.formdata, "update_user");

    if (formIsValid) {
      updateUserData(dataToSubmit)
        .then(response => {
          toast.success("Successfully Updated User Info.");
          this.props.auth();
        })
        .catch(e => {
          toast.error(e[0].detail);
        });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  componentDidMount() {
    const newFormData = populateFields(
      this.state.formdata,
      this.props.user.userData
    );
    this.setState({
      formdata: newFormData
    });
  }

  render() {
    return (
      <div>
        <ToastContainer />
        <form onSubmit={event => this.submitForm(event)}>
          <h2>Personal information</h2>
          <div className="form_block_two">
            <div className="block">
              <FormField
                id={"name"}
                formdata={this.state.formdata.name}
                change={element => this.updateForm(element)}
              />
            </div>
            <div className="block">
              <FormField
                id={"lastname"}
                formdata={this.state.formdata.lastname}
                change={element => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            <FormField
              id={"email"}
              formdata={this.state.formdata.email}
              change={element => this.updateForm(element)}
            />
          </div>
          <div>
            {this.state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}
            <button onClick={event => this.submitForm(event)}>
              Update personal info
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { auth }
)(UpdatePersonalNfo);