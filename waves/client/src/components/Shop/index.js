import React, { Component } from "react";
import PageTop from "../utils/page_top";

import { frets, price } from "../utils/Form/fixed_categories";

import { connect } from "react-redux";
import {
  getProductsToShop,
  getBrands,
  getWoods
} from "../../actions/products_actions";

import CollapseCheckbox from "../utils/collapseCheckbox";
import CollapseRadio from "../utils/collapseRadio";

import LoadmoreCards from "./loadmoreCards";

class Shop extends Component {
  state = {
    grid: "",
    limit: 6,
    skip: 0,
    filters: {
      brand: [],
      frets: [],
      wood: [],
      price: []
    }
  };
  componentDidMount() {
    this.props.getBrands();
    this.props.getWoods();
    this.props.getProductsToShop(
      this.state.skip,
      this.state.limit,
      this.state.filters
    );
  }
  handlePrice = value => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };
  handleFilters = (filters, category) => {
    const newFilters = { ...this.state.filters };
    newFilters[category] = filters;

    if (category === "price") {
      let priceValues = this.handlePrice(filters);
      newFilters[category] = priceValues;
    }

    this.showFilteredResults(newFilters);
    this.setState({
      filters: newFilters
    });
  };
  showFilteredResults = filters => {
    //Skip 0
    this.props.getProductsToShop(0, this.state.limit, filters);
    this.setState({
      skip: 0
    });
  };
  loadMoreCards = () => {
    let skip = this.state.skip + this.state.limit;

    this.props
      .getProductsToShop(
        skip,
        this.state.limit,
        this.state.filters,
        this.props.products.toShop
      )
      .then(() => {
        this.setState({
          skip
        });
      });
  };
  render() {
    const products = this.props.products;
    return (
      <div>
        <PageTop title="Browse Products" />
        <div className="container">
          <div className="shop_wrapper">
            <div className="left">
              <CollapseCheckbox
                initState={true}
                title="Brands"
                list={products.brands}
                handleFilters={filters => this.handleFilters(filters, "brand")}
              />
              <CollapseCheckbox
                initState={false}
                title="Frets"
                list={frets}
                handleFilters={filters => this.handleFilters(filters, "frets")}
              />
              <CollapseCheckbox
                initState={false}
                title="Wood"
                list={products.woods}
                handleFilters={filters => this.handleFilters(filters, "wood")}
              />
              <CollapseRadio
                initState={true}
                title="Price"
                list={price}
                handleFilters={filters => this.handleFilters(filters, "price")}
              />
            </div>
            <div className="right">
              <div className="shop_options">
                <div className="shop_grid clear">grids</div>
              </div>
              <LoadmoreCards // Shows Card BLock AND Load More Button
                grid={this.state.grid}
                limit={this.state.limit}
                size={products.toShopSize}
                products={products.toShop}
                loadMore={this.loadMoreCards}
              />
            </div>
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
  { getBrands, getWoods, getProductsToShop }
)(Shop);