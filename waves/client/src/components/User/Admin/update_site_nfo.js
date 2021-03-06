import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import FormField from "../../utils/Form/formfield";
import {
  update,
  generateData,
  isFormValid,
  populateFields
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import { getSiteData, updateSiteData } from "../../../actions/site_actions";

class UpdateSiteNfo extends Component {
  state = {
    formError: false,
    formdata: {
      address: {
        element: "input",
        value: "",
        config: {
          label: "Adresss",
          name: "address_input",
          type: "text",
          placeholder: "Enter the site address"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      hours: {
        element: "input",
        value: "",
        config: {
          label: "Working hours",
          name: "hours_input",
          type: "text",
          placeholder: "Enter the site working hours"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      phone: {
        element: "input",
        value: "",
        config: {
          label: "Phone number",
          name: "phone_input",
          type: "text",
          placeholder: "Enter the phone number"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      email: {
        element: "input",
        value: "",
        config: {
          label: "Shop email",
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
        validationMessage: "",
        showlabel: true
      }
    }
  };
  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, "site_info");
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };
  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, "site_info");
    let formIsValid = isFormValid(this.state.formdata, "site_info");

    if (formIsValid) {
      this.props
        .updateSiteData(dataToSubmit)
        .then(response => {
          toast.success("Successfully updated Site Info.");
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
    this.props.getSiteData().then(() => {
      const newFormData = populateFields(
        this.state.formdata,
        this.props.site.siteData[0]
      );
      this.setState({
        formdata: newFormData
      });
    });
  }
  render() {
    return (
      <div>
        <ToastContainer />
        <form onSubmit={this.submitForm}>
          <h1>Site info</h1>
          <FormField
            id={"address"}
            formdata={this.state.formdata.address}
            change={element => this.updateForm(element)}
          />

          <FormField
            id={"hours"}
            formdata={this.state.formdata.hours}
            change={element => this.updateForm(element)}
          />

          <FormField
            id={"phone"}
            formdata={this.state.formdata.phone}
            change={element => this.updateForm(element)}
          />

          <FormField
            id={"email"}
            formdata={this.state.formdata.email}
            change={element => this.updateForm(element)}
          />

          <div>
            {this.state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}
            <button onClick={this.submitForm}>Update</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    site: state.site
  };
};

export default connect(
  mapStateToProps,
  { getSiteData, updateSiteData }
)(UpdateSiteNfo);
