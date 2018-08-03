import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import FormField from "../../utils/Form/formfield";
import {
  update,
  generateData,
  isFormValid,
  resetFields
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import { getBrands, addBrand } from "../../../actions/products_actions";

class ManageBrands extends Component {
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
          placeholder: "Enter the brand"
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

  showCategoryItems = () =>
    this.props.products.brands
      ? this.props.products.brands.map((item, i) => (
          <div className="category_item" key={item._id}>
            {item.name}
          </div>
        ))
      : null;

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, "brands");
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  resetFieldsHandler = () => {
    const newFormData = resetFields(this.state.formdata, "brands");

    this.setState({
      formdata: newFormData,
      formSuccess: true
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, "brands");
    let formIsValid = isFormValid(this.state.formdata, "brands");
    let existingBrands = this.props.products.brands;

    if (formIsValid) {
      addBrand(dataToSubmit, existingBrands)
        .then(brand => {
          toast.success(`Successfully added brand of ${brand}.`);
          this.resetFieldsHandler();
          this.props.getBrands();
        })
        .catch(err => toast.error(err[0].detail));
    } else {
      this.setState({
        formError: true
      });
    }
  };

  componentDidMount() {
    this.props.getBrands();
  }

  render() {
    return (
      <div className="admin_category_wrapper">
        <h1>Brands</h1>
        <ToastContainer />
        <div className="admin_two_column">
          <div className="left">
            <div className="brands_container">{this.showCategoryItems()}</div>
          </div>
          <div className="right">
            <form onSubmit={this.submitForm}>
              <FormField
                id={"name"}
                formdata={this.state.formdata.name}
                change={element => this.updateForm(element)}
              />

              {this.state.formError ? (
                <div className="error_label">Please check your data</div>
              ) : null}
              <button onClick={this.submitForm}>Add brand</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

export default connect(
  mapStateToProps,
  { getBrands }
)(ManageBrands);
