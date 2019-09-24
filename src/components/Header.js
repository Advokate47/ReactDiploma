import React, { Component } from 'react';

import {
  headerHiddenPanelProfileVisibility,
  headerHiddenPanelBasketVisibility,
  headerMainSearchVisibility,
  mainSubmenuVisibility,
} from "./script";
import header_logo from '../img/header-logo.png';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

class ListItem extends Component {
  handleClick = () => this.props.func(this.props.id, this.props.size);
  render() {
    const { id, images, title, brand, size, amount, price } = this.props
    return (
      <div className="product-list__item">
        <Link to={`productCard/${id}`} className="product-list__pic_wrap">
          <img className="product-list__pic" src={images[0]} alt={title} />
          <p className="product-list__product">{title}, {brand}, размер: {size}, кол-во:{amount}.ед</p>
        </Link>
        <div className="product-list__fill"></div>
        <div className="product-list__price">
          {price}
          <i className="fa fa-rub" aria-hidden="true"></i>
        </div>
        <div className="product-list__deconste" onClick={this.handleClick}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
    );
  };
};


class ProductList extends Component {
  render() {
    const { loadedCartItems } = this.props;
    return (
      <div className="basket-dropped__product-list product-list">
        {loadedCartItems.length > 0 && loadedCartItems.map(item =>
          <ListItem
            key={`${item.products.id}-${item.size}`}
            id={item.products.id}
            size={item.size}
            title={item.products.title}
            images={item.products.images}
            brand={item.products.brand}
            price={item.products.price * item.amount}
            amount={item.amount}
            func={this.props.removeFunc}
          />
        )}
      </div>
    );
  };
};

class HeaderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartIDJson: localStorage.postCartIDKey ? JSON.parse(localStorage.postCartIDKey).id : '',
      loadedCartItems: [],
      searchValue: ''
    };
    localStorage.postCartIDKey && this.loadCartData();
  };

  static get propTypes() {
    return {
      cart: PropTypes.object,
      search: PropTypes.func.isRequired,
      orderLoader: PropTypes.func.isRequired
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.cart !== prevProps.cart) {
      localStorage.postCartIDKey ? this.loadCartData(this.props.cart) : this.setState({ loadedCartItems: [] });
    };
  };

  loadCartData = () => {
     const cartData = this.props.cart ? this.props.cart.id : this.state.cartIDJson;

    if (cartData) {
      fetch(`https://api-neto.herokuapp.com/bosa-noga/cart/${cartData}`, {
        headers: {
          "Content-type": "application/json"
        },
      })
        .then(response => {
          if (200 <= response.status && response.status < 300) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(data => {
          const promises = data.data.products.map(element =>
            fetch(`https://api-neto.herokuapp.com/bosa-noga/products/${element.id}`, {
              method: "GET"
            })
          );
          Promise.all(promises)
            .then(responseArray => {
              const resJsonPromises = responseArray.map(res => res.json());
              return Promise.all(resJsonPromises);
            })
            .then(dataArr => {
              const cartItemArr = [];
              data.data.products.map((item, index) =>
                cartItemArr.push({
                  products: dataArr[index].data,
                  amount: item.amount,
                  size: item.size
                })
              );
              this.setState({
                loadedCartItems: cartItemArr
              });
              this.props.orderLoader(cartItemArr);
            })
            .catch(error => console.log(`Ошибка: ${error.message}`));
        });
    } else {
      this.setState({
        loadedCartItems: []
      });
      this.props.orderLoader(null);
    }
  };

  removeItem = (itemID, itemSize) => {
    const cartData = this.props.cart ? this.props.cart.id : this.state.cartIDJson;
    const cartItemProps = {
      id: itemID,
      size: itemSize,
      amount: 0
    };
    const serialCartItemProps = JSON.stringify(cartItemProps);
    fetch(`https://api-neto.herokuapp.com/bosa-noga/cart/${cartData}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: serialCartItemProps
    })
      .then(response => {
        if (200 <= response.status && response.status < 300) {
          return response;
        }
        throw new Error(response.statusText);
      })
      .then(response => response.json())
      .then(data => {
        const serialTempData = JSON.stringify(data.data);
        localStorage.setItem("postCartIDKey", serialTempData);
        if (this.props.cart !== cartData) {
          this.loadCartData();
        };
      })
      .catch(error => {
        localStorage.removeItem("postCartIDKey")
        this.setState({
          loadedCartItems: []
        });
      });
  };

  
  sendCartItemsToOrder = () => {
    this.props.orderLoader(this.state.loadedCartItems);
  };

  changeSearchValue = (event) => {
    this.setState({ searchValue: event.currentTarget.value });
  };

  searchSubmit = (event) => {
    event.preventDefault();
    this.props.search(this.state.searchValue);
    this.props.history.push('/catalogue/');
    this.setState({ searchValue: '' });
  };

  scrollTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  gototop = () => {
    if (window.scrollY>0) {
        window.scrollTo(0,window.scrollY-20)
        setTimeout("gototop()",10)
    }
}

  render() {
    const { loadedCartItems } = this.state;
    return (
      <div className="header-main">
        <div className="header-main__wrapper wrapper">
          <div className="header-main__phone">
            <a href="tel:+7-495-790-35-03">+7 495 79 03 503</a>
            <p>Ежедневно: с 09-00 до 21-00</p>
          </div>
          <div className="header-main__logo">
            <Link to="/">
              <h1>
                <img src={header_logo} alt="logotype" />
              </h1>
            </Link>
            <p>Обувь и аксессуары для всей семьи</p>
          </div>
          <div className="header-main__profile">
            <div className="header-main__pics">
              <div className="header-main__pic header-main__pic_search" onClick={headerMainSearchVisibility}>
              </div>
              <div className="header-main__pic_border"></div>
              <div className="header-main__pic header-main__pic_profile" onClick={headerHiddenPanelProfileVisibility}>
                <div className="header-main__pic_profile_menu"></div>
              </div>
              <div className="header-main__pic_border"></div>
              <div className="header-main__pic header-main__pic_basket" onClick={headerHiddenPanelBasketVisibility}>
              <div className="header-main__pic_basket_full"></div>
              <div className="header-main__pic_basket_full"></div>
                  <div className="header-main__pic_basket_menu"></div>
                {loadedCartItems.length > 0 ?
                  
                  <div className="header-main__pic_basket_full_plus_one">{this.scrollTop()}</div> : <div></div>}
                  <div className="header-main__pic_basket_full"></div>
                  <div className="header-main__pic_basket_menu"></div>
                
              </div>
            </div>
            <form onSubmit={this.searchSubmit} className="header-main__search" action="#">
              <input onChange={this.changeSearchValue} value={this.state.searchValue} placeholder="Поиск" />
              <i className="fa fa-search" aria-hidden="true"></i>
            </form>
          </div>
        </div>
        <div className="header-main__hidden-panel hidden-panel">
          <div className="hidden-panel__profile">
            <Link to="/">Личный кабинет</Link>
            <Link to="/favorite">
              <i className="fa fa-heart-o" aria-hidden="true"></i>Избранное</Link>
            <Link to="/">Выйти</Link>
          </div>
          {loadedCartItems.length > 0 ?
            <div className="hidden-panel__basket basket-dropped">
              <div className="basket-dropped__title">
                В вашей корзине:
                  </div>
              <ProductList loadedCartItems={loadedCartItems} removeFunc={this.removeItem} />
              <Link className="basket-dropped__order-button" to="/order" onClick={this.sendCartItemsToOrder}>Оформить заказ</Link>
            </div> : <div className="hidden-panel__basket basket-dropped">
              <div className="basket-dropped__title">В корзине пока ничего нет. Не знаете, с чего начать? Посмотрите наши новинки!</div>
            </div>}
        </div>
      </div>
    );
  };
};

const topMenuData = [
  {
    id: 1,
    title: "Возврат"
  },
  {
    id: 2,
    title: "Доставка и оплата"
  },
  {
    id: 3,
    title: "О Магазине"
  },
  {
    id: 4,
    title: "Контакты"
  },
  {
    id: 5,
    title: "Новости"
  },
]

class TopMenu extends Component {
  render() {
    return (
      <div className="top-menu">
        <div className="wrapper">
          <ul className="top-menu__items">
            {topMenuData.map(item =>
              <li key={item.id} className="top-menu__item">
                <Link to="/">{item.title}</Link>
              </li>)}
          </ul>
        </div>
      </div>
    );
  };
};

class CategoriesList extends Component {
  handleClick = () => this.props.func(this.props.id, this.props.title);
  render() {
    return (
      <li className="main-menu__item" onClick={mainSubmenuVisibility}>
        {<button className="main-menu__item_button" onClick={this.handleClick}>{this.props.title}</button>}
      </li>
    );
  };
};

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.categories ? this.props.categories : [],
    };
  };

  static get propTypes() {
    return {
      categories: PropTypes.array,
      getActiveCategory: PropTypes.func.isRequired
    };
  };

  componentDidUpdate(prevProps) {
    if (this.props.categories !== prevProps.categories) {
      this.setState({
        data: this.props.categories,
      });
    };
  };

  setActiveCategory = (id, title) => {
    this.props.getActiveCategory(id, title);
  };

  render() {
    return (
      <nav className="main-menu">
        <div className="wrapper">
          <ul className="main-menu__items">
            {this.state.data.map(item =>
              <CategoriesList key={item.id} id={item.id} title={item.title} func={this.setActiveCategory} />
            )}
          </ul>
        </div>
      </nav>
    );
  };
};

class DroppedMenu extends Component {

  static get propTypes() {
    return {
      filters: PropTypes.object.isRequired,
      filterLoader: PropTypes.func,
      activeCategory: PropTypes.object,
    };
  };

  getMenuItems = (type) => {
    const { filters, activeCategory, filterLoader } = this.props;
    if (!filters || !filters[type]) {
      return null;
    } else {
      return filters[type].map(name => (
        <li key={name} className="dropped-menu__item">
          <Link to={`/catalogue/`} onClick={filterLoader({ activeCategory, type, name })}>{name}</Link>
        </li>
      ));
    }
  };

  render() {
    return (
      <div className="dropped-menu">
        <div className="wrapper">
          <div className="dropped-menu__lists dropped-menu__lists_women">
            <h3 className="dropped-menu__list-title">Повод:</h3>
            <ul className="dropped-menu__list">
              {this.getMenuItems('reason')}
            </ul>
          </div>
          <div className="dropped-menu__lists">
            <h3 className="dropped-menu__list-title">Категории:</h3>
            <ul className="dropped-menu__list">
              {this.getMenuItems('type')}
            </ul>
          </div>
          <div className="dropped-menu__lists">
            <h3 className="dropped-menu__list-title">Сезон:</h3>
            <ul className="dropped-menu__list">
              {this.getMenuItems('season')}
            </ul>
          </div>
          <div className="dropped-menu__lists dropped-menu__lists_three-coloumns">
            <h3 className="dropped-menu__list-title">Бренды:</h3>
            <ul className="dropped-menu__list">
              {this.getMenuItems('brand')}
            </ul>
          </div>
        </div>
      </div>
    );
  };
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: null
    };
  };

  static get propTypes() {
    return {
      cart: PropTypes.object,
      categories: PropTypes.array,
      filterLoader: PropTypes.func,
      filters: PropTypes.object.isRequired,
      orderLoader: PropTypes.func,
      history: PropTypes.object,
    };
  };

  // Функция передатчик - передаёт активную категорию для переходов в каталог в Dropped Menu
  getActiveCategory = (id, title) => {
    this.setState({
      activeCategory: {
        id: id,
        title: title
      }
    });
  };

  render() {
    const { cart, orderLoader, search, categories, filters, filterLoader, history } = this.props;
    return (
      <header className="header">
        <TopMenu />
        <HeaderMain cart={cart} orderLoader={orderLoader} search={search} history={history} />
        <MainMenu categories={categories} getActiveCategory={this.getActiveCategory} />
        <DroppedMenu filters={filters} filterLoader={filterLoader} activeCategory={this.state.activeCategory} />
      </header>
    );
  };
};

export default Header;