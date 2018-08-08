import React, { Component } from "react";
import FormField from "../utils/Form/formfield";
import { ToastContainer, toast } from "react-toastify";
import { update, generateData, isFormValid } from "../utils/Form/formActions";
import { withRouter, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { loginUser, auth } from "../../actions/user_actions";

class Login extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formdata: {
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
      },
      password: {
        element: "input",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter your password"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      }
    }
  };
  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, "login");
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };
  submitForm = e => {
    e.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, "login");
    let formIsValid = isFormValid(this.state.formdata, "login");

    if (formIsValid) {
      loginUser(dataToSubmit)
        .then(() => {
          this.props.auth();
        })
        .catch(err => toast.error(err[0].detail));
    } else {
      this.setState({
        formError: true
      });
    }
  };
  render() {
    const redirectOnLogin = this.props.user.userData.isAuth ? (
      <Redirect to="/user/dashboard" />
    ) : null;

    return (
      <div className="signin_wrapper">
        <ToastContainer />
        {redirectOnLogin}
        <form onSubmit={this.submitForm}>
          <FormField
            id={"email"}
            formdata={this.state.formdata.email}
            change={element => this.updateForm(element)}
          />
          <FormField
            id={"password"}
            formdata={this.state.formdata.password}
            change={element => this.updateForm(element)}
          />
          {this.state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}
          <button onClick={this.submitForm}>Log in</button>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => this.props.history.push("/reset_user")}
          >
            Forgot my password
          </button>
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

export default withRouter(
  connect(
    mapStateToProps,
    { auth }
  )(Login)
);
