import React, { Component } from 'react';
import { Catalogue, Favorite, Footer, Header, Order, OrderEnd, MainPage, ProductCard } from './components';
import './App.css';
import { Router, Route } from 'react-router-dom';
import dataLoader from "./components/Fetch";
import history from "./history/history";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productCartItems: null,
      filters: null,
      categories: null,
      orderItems: null,
      cartId: null,
      orderDetails: null,
      catalogueFilterParam: null,
      catalogueParam: null
    };
    this.CarryedProductCard = this.bindProps(ProductCard, {	    // this.CarryedProductCard = this.bindProps(ProductCard, {
      cartUploader: this.cartItemUploader,	    //   cartUploader: this.cartItemUploader,
      filterParam: this.state.catalogueFilterParam,	    //   filterParam: this.state.catalogueFilterParam,
      catalogueParam: this.state.catalogueParam,	    //   catalogueParam: this.state.catalogueParam,
      filterLoader: this.mainMenuFilterLoader	    //   filterLoader: this.mainMenuFilterLoader
    });
  };

  

  componentDidMount() {
    const filters = dataLoader('filters');
    const categories = dataLoader('categories');
    Promise.all([filters, categories]).then(([filters, categories]) => {
      this.setState({
        categories: categories,
        filters: filters
      });
    },
      reason => {
        console.log(reason)
      });
  };

  orderLoader = (data) => {
    if (data === null) {
      this.setState({
        orderItems: null
      });
    }
    this.setState({
      orderItems: data
    });
  };

  orderDoneLoader = (param) => {
    this.setState({
      orderDetails: param
    });
  };

  cartItemUploader = (data) => {
    if (data === null) {
      this.setState({
        productCartItems: null,
        cartId: null
      });
    } else {
      this.setState({
        productCartItems: data,
        cartId: data.id
      });
    }
  };

  mainMenuFilterLoader = ({ activeCategory, type, name }) => (event) => {
    const selectedCategoryId = `categoryId=${activeCategory.id}`;
    const selectedType = type ? `&${type}` : '';
    const selectedName = name ? `=${name}` : '';
    const selectedCategories = selectedCategoryId + selectedType + selectedName;
    const selectedCategoriesProps = { [type]: name };
    this.setState({
      catalogueFilterParam: selectedCategories,
      catalogueParam: { activeCategory, selectedCategoriesProps }
    });
  };

  searchParamLoader = (searchValue) => {
    const searchParam = `search=${searchValue}`;
    this.setState({
      catalogueFilterParam: searchParam
    });
  };

  bindProps = (Component, bindingProps) => (selfProps) => <Component {...bindingProps}{...selfProps} />;


  render() {

    const {categories, filters, catalogueParam, orderDetails, cartId, catalogueFilterParam, orderItems} = this.state;
    const {mainMenuFilterLoader, cartItemUploader, orderDoneLoader, CarryedProductCard} = this;

    return (
      <Router history={history}>
        {(this.state.categories && this.state.filters) && <div className='container'>
          <Header history={history} cart={this.state.productCartItems}
            categories={this.state.categories} filters={this.state.filters} orderLoader={this.orderLoader}
            filterLoader={this.mainMenuFilterLoader} search={this.searchParamLoader} />
          <Route path='/' exact component={() => <MainPage categories={categories}/>} />
          <Route path='/catalogue/' exact component={() => <Catalogue categories={categories} filters={filters} filterParam={catalogueFilterParam} catalogueParam={catalogueParam} filterLoader={mainMenuFilterLoader}/>} />     
          <Route path='/favorite' exact component={Favorite} />
          <Route path='/order' exact component={(props) => <Order {...props} cartItems={orderItems} cartId={cartId} cartUploader={cartItemUploader} orderDone={orderDoneLoader}/>} />
          <Route path='/orderEnd' exact component={(props) => <OrderEnd {...props} orderDetails={orderDetails}/>} /> 
          <Route path='/productCard/:id' exact component={CarryedProductCard} />
          <Footer />
        </div>}
      </Router>
    );
  };
};

export default App;