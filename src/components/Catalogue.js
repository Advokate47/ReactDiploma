import React, { Component } from 'react';
import '../css/style-catalogue.css';
import SitePath from './SitePath';
import Pagination from './Pagination';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OverlookedSlider from './OverlookedSlider';
import querystring from 'querystring';
// const querystring = require('querystring');
// var qs = require('querystring');


class SideBarCatalogueListItem extends Component {
  render() {
    const { hiddenFilters, shoesTypeSettings, isActive, data, idx } = this.props;
    return (
      <li className={hiddenFilters.includes('CatalogueList') ? 'hidden' : 'sidebar-ul-li sidebar__catalogue-list-ul-li'} >
        <button className={isActive ? 'sidebar-button-active' : 'sidebar-button'} onClick={shoesTypeSettings({ name: 'shoesType', value: `${data}` }, idx)}>{data}</button>
      </li>
    );
  };
};

class SideBarCatalogueList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: ''
    };
  };

  static get propTypes() {
    return {
      shoesTypeSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.shoesTypeSettings('CatalogueList');

  sideBarShoesTypeSettings = ({ name, value }, idx) => (event) => {
    event.preventDefault();
    this.props.setFilterParam({ name, value });
    this.setState({
      isActive: idx
    });
  };

  render() {
    return (
      <div className='sidebar__catalogue-list'>
        <div className='sidebar__division-title'>
          <h3>Каталог</h3>
          <div className={this.props.hiddenFilters.includes('CatalogueList') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
        </div>
        <ul className={this.props.hiddenFilters.includes('CatalogueList') ? 'hidden' : 'sidebar-ul sidebar__catalogue-list-ul'}>
          {this.props.data.map((shoesType, index) =>
            <SideBarCatalogueListItem
              key={shoesType}
              data={shoesType}
              idx={index}
              isActive={this.state.isActive === index}
              shoesTypeSettings={this.sideBarShoesTypeSettings}
              hiddenFilters={this.props.hiddenFilters}
            />
          )}
        </ul>
      </div>
    );
  };
};

class SideBarPrice extends Component {
  constructor(props) {
    super(props);
    this.circle1 = null;
    this.circle2 = null;
    this.circleContainer = null;
    this.getRefs = {
      circle1: ref => this.circle1 = ref,
      circle2: ref => this.circle2 = ref,
      circleContainer: ref => this.circleContainer = ref
    };

    this.offset = 0;
    this.currentCircleClassName = '';
    this.blankElement = document.createElement('div');

    this.state = {
      circle1Left: 0,
      circle2Left: 215,
      hiddenFilters: this.props.hiddenFilters
    };
  };

  static get propTypes() {
    return {
      priceSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      maxPrice: PropTypes.number.isRequired,
      minPrice: PropTypes.number.isRequired
    };
  };

  handleClick = () => this.props.priceSettings('Price');

  componentWillMount() {
    this.updateCirclesPositions(this.props);
  };

  componentWillReceiveProps(nextProps) {
    const { minPrice, maxPrice } = nextProps;
    if (this.props.minPrice !== minPrice || this.props.maxPrice !== maxPrice) {
      this.updateCirclesPositions(nextProps);
    };
  };

  updateCirclesPositions = (nextProps) => {
    const fixedMaxPriceValue = 100000;
    const { minPrice, maxPrice } = nextProps;
    const circle1Left = Math.round(215 * minPrice / fixedMaxPriceValue);
    const circle2Left = Math.round(215 * maxPrice / fixedMaxPriceValue);
    this.setState({ circle1Left, circle2Left });
  };

  onDragStart = (event) => {
    this.currentCircleClassName = event.currentTarget.className;
    this.offset = this.circleContainer.getBoundingClientRect().left + (event.clientX - event.currentTarget.getBoundingClientRect().left);
    event.dataTransfer.setDragImage(this.blankElement, 0, 0);
  }

  onDragOver = (event) => {
    event.preventDefault();
    if (this.currentCircleClassName === 'circle-1') {
      let circle1Left = event.clientX - this.offset;
      if (circle1Left < 0) circle1Left = 0;
      if (circle1Left > this.state.circle2Left) circle1Left = this.state.circle2Left;
      this.setState({ circle1Left });
    }

    if (this.currentCircleClassName === 'circle-2') {
      let circle2Left = event.clientX - this.offset;
      if (circle2Left > 215) circle2Left = 215;
      if (circle2Left < this.state.circle1Left) circle2Left = this.state.circle1Left;
      this.setState({ circle2Left });
    }
  }

  onDragEnd = (event) => {
    if (this.currentCircleClassName === 'circle-1') {
      this.setPriceLimit(this.state.circle1Left, 'minPrice');
    }

    if (this.currentCircleClassName === 'circle-2') {
      this.setPriceLimit(this.state.circle2Left, 'maxPrice');
    }
  }

  setPriceLimit = (circleLeft, priceType) => {
    const fixedMaxPriceValue = 100000;
    const value = Math.round(fixedMaxPriceValue * circleLeft / 215);
    this.props.setFilterParam({ name: priceType, value: +value });
  }

  onChangePriceLimit = (event) => {
    const { name, value } = event.currentTarget;
    if (+value > 100000 || +value < 0) return;
    this.props.setFilterParam({ name: name, value: +value });
  }

  render() {
    const { circle1Left, circle2Left, hiddenFilters } = this.state;
    return (
      <section className='sidebar__division'>
        <div className='sidebar__price'>
          <div className='sidebar__division-title'>
            <h3>Цена</h3>
            <div className={hiddenFilters.includes('Price') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
          </div>
          <div className={hiddenFilters.includes('Price') ? 'hidden' : 'price-slider'}>
            <div
              ref={this.getRefs.circleContainer}
              onDragOver={this.onDragOver}
              className='circle-container'>
              <div
                className='circle-1'
                draggable
                ref={this.getRefs.circle1}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                style={{ left: `${circle1Left}px` }}>
              </div>
              <div className='line-white'></div>
              <div className='line-colored' style={{ left: `${circle1Left + 12}px`, right: `${215 - circle2Left + 12}px` }} ></div>
              <div
                className='circle-2'
                ref={this.getRefs.circle2}
                draggable
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                style={{ left: `${circle2Left}px` }}>
              </div>
            </div>
            <div className='counter'>
              <input onChange={this.onChangePriceLimit} type='number' name='minPrice' className='input-1' value={this.props.minPrice} />
              <div className='input-separator'></div>
              <input onChange={this.onChangePriceLimit} type='number' name='maxPrice' className='input-2' value={this.props.maxPrice} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const sidebarColorData = [
  {
    color: "beige",
    colorName: "Бежевый",
    colorId: 1
  },
  {
    color: "whitesnake",
    colorName: "Белый",
    colorId: 2
  },
  {
    color: "transparent",
    colorName: "Прозрачный",
    colorId: 3
  },
  {
    color: "pink",
    colorName: "Розовый",
    colorId: 4
  },
  {
    color: "red",
    colorName: "Красный",
    colorId: 5
  },
  {
    color: "deep-purple",
    colorName: "Фиолетовый",
    colorId: 6
  },
  {
    color: "black-sabbath",
    colorName: "Черный",
    colorId: 7
  },
  {
    color: "dark-green",
    colorName: "Темно-салатовый",
    colorId: 8
  },
  {
    color: "orange",
    colorName: "Оранжевый",
    colorId: 9
  },
  {
    color: "bezh",
    colorName: "Беж",
    colorId: 10
  },
  {
    color: "gray",
    colorName: "Серый",
    colorId: 11
  },
  {
    color: "blue",
    colorName: "Синий",
    colorId: 12
  },
  {
    color: "metal",
    colorName: "Металлик",
    colorId: 13
  },
  {
    color: "colorful",
    colorName: "Разноцветные",
    colorId: 14
  },
  {
    color: "silver",
    colorName: "Серебрянный",
    colorId: 15
  },
  {
    color: "white-black",
    colorName: "Черно-белый",
    colorId: 16
  },
  {
    color: "bardo",
    colorName: "Бардо",
    colorId: 17
  },
  {
    color: "brown",
    colorName: "Коричневый",
    colorId: 18
  }
]

class SideBarColorListItem extends Component {
  render() {
    const { hiddenFilters, colorSettings, isActive, data, idx } = this.props;
    return (
      <li className={hiddenFilters.includes('Color') ? 'hidden' : 'sidebar-ul-li sidebar__color-list-ul-li'} >
        <button className={isActive ? 'sidebar-button-active' : 'sidebar-button'} onClick={colorSettings({ name: 'color', value: data.colorName }, idx)}>
          <div className={`color ${data.color}`}></div>
          <span className='color-name'>{data.colorName}</span>
        </button>
      </li>
    );
  };
};

class SideBarColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: ''
    };
  };

  static get propTypes() {
    return {
      colorSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
    };
  };

  handleClick = () => this.props.colorSettings('Color');

  sideBarColorSettings = ({ name, value }, idx) => (event) => {
    event.preventDefault();
    this.props.setFilterParam({ name, value });
    this.setState({
      isActive: idx
    });
  };

  render() {
    return (
      <div className='sidebar__color'>
        <div className='sidebar__division-title'>
          <h3>Цвет</h3>
          <div className={this.props.hiddenFilters.includes('Color') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
        </div>
        <ul className={this.props.hiddenFilters.includes('Color') ? 'hidden' : 'sidebar-ul sidebar__color-list-ul'}>
          {sidebarColorData.map((item, index) =>
            <SideBarColorListItem
              key={item.color}
              data={item}
              idx={index}
              isActive={this.state.isActive === index}
              colorSettings={this.sideBarColorSettings}
              hiddenFilters={this.props.hiddenFilters}
            />
          )}
        </ul>
      </div>
    );
  };
};


class SideBarSizeListItem extends Component {
  render() {
    const { data, hiddenFilters, setFilterArrayParam } = this.props;
    return (
      <li className={hiddenFilters.includes('Size') ? 'hidden' : 'sidebar-ul-li sidebar__size-list-ul-li'}>
        <label>
          <input type='checkbox'
            onChange={setFilterArrayParam}
            value={+data}
            name='sizes'
            className='checkbox'
          />
          <span className='checkbox-custom'></span>
          <span className='label'>{data}</span>
        </label>
      </li>
    );
  };
};

class SideBarSize extends Component {

  static get propTypes() {
    return {
      sizeSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterArrayParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.sizeSettings('Size');

  render() {
    return (
      <div className='sidebar__size'>
        <div className='sidebar__division-title'>
          <h3>Размер</h3>
          <div className={this.props.hiddenFilters.includes('Size') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
        </div>
        <ul className={this.props.hiddenFilters.includes('Size') ? 'hidden' : 'sidebar-ul sidebar__size-list-ul'}>
          {this.props.data.map((size, index) =>
            <SideBarSizeListItem
              key={size}
              data={size}
              idx={index}
              hiddenFilters={this.props.hiddenFilters}
              setFilterArrayParam={this.props.setFilterArrayParam}
            />
          )}
        </ul>
      </div>
    );
  };
};


class SideBarHeelSizeListItem extends Component {
  render() {
    const { data, hiddenFilters, setFilterArrayParam } = this.props;
    return (
      <li className={hiddenFilters.includes('HeelSize') ? 'hidden' : 'sidebar-ul-li sidebar__heelSize-list-ul-li'}>
        <label>
          <input type='checkbox'
            onChange={setFilterArrayParam}
            value={+data}
            name='heelSizes'
            className='checkbox'
          />
          <span className='checkbox-custom'></span>
          <span className='label'>{data}</span>
        </label>
      </li>
    );
  };
};


class SideBarHeelSize extends Component {

  static get propTypes() {
    return {
      heelSizeSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterArrayParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.heelSizeSettings('HeelSize');

  render() {
    return (
      <div className='sidebar__heel-height'>
        <div className='sidebar__division-title'>
          <h3>Размер каблука</h3>
          <div className={this.props.hiddenFilters.includes('HeelSize') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
          <ul className={this.props.hiddenFilters.includes('HeelSize') ? 'hidden' : 'sidebar-ul sidebar__heelSize-list-ul'}>
            {this.props.data.map((size, index) =>
              <SideBarHeelSizeListItem
                key={size}
                data={size}
                idx={index}
                hiddenFilters={this.props.hiddenFilters}
                setFilterArrayParam={this.props.setFilterArrayParam}
              />
            )}
          </ul>
        </div>
      </div>
    );
  };
};

class SideBarReasonListItem extends Component {
  render() {
    const { hiddenFilters, reasonSettings, isActive, data, idx } = this.props;
    return (
      <li className={hiddenFilters.includes('Reason') ? 'hidden' : 'sidebar-ul-li sidebar__ocassion-list-ul-li'} >
        <button className={isActive ? 'sidebar-button-active' : 'sidebar-button'} onClick={reasonSettings({ name: 'reason', value: data }, idx)}>{data}</button>
      </li>
    );
  };
};

class SideBarReason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: ''
    };
  };

  static get propTypes() {
    return {
      reasonSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.reasonSettings('Reason');

  sideBarReasonSettings = (param, idx) => (event) => {
    event.preventDefault();
    this.props.setFilterParam(param);
    this.setState({
      isActive: idx
    });
  };

  render() {
    return (
      <div className='sidebar__occasion'>
        <div className='sidebar__division-title'>
          <h3>Повод</h3>
          <div className={this.props.hiddenFilters.includes('Reason') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
          <ul className={this.props.hiddenFilters.includes('Reason') ? 'hidden' : 'sidebar-ul sidebar__ocassion-list-ul'}>
            {this.props.data.map((reason, index) =>
              <SideBarReasonListItem
                key={reason}
                data={reason}
                idx={index}
                isActive={this.state.isActive === index}
                reasonSettings={this.sideBarReasonSettings}
                hiddenFilters={this.props.hiddenFilters}
              />
            )}
          </ul>
        </div>
      </div>
    );
  };
};

class SideBarSeasonListItem extends Component {
  render() {
    const { hiddenFilters, seasonSettings, isActive, data, idx } = this.props;
    return (
      <li className={hiddenFilters.includes('Season') ? 'hidden' : 'sidebar-ul-li sidebar__season-list-ul-li'} >
        <button className={isActive ? 'sidebar-button-active' : 'sidebar-button'} onClick={seasonSettings({ name: 'season', value: data }, idx)}>{data}</button>
      </li>
    );
  };
};


class SideBarSeason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: ''
    };
  };

  static get propTypes() {
    return {
      seasonSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.seasonSettings('Season');

  sideBarSeasonSettings = (param, idx) => (event) => {
    event.preventDefault();
    this.props.setFilterParam(param);
    this.setState({
      isActive: idx
    });
  };

  render() {
    return (
      <div className='sidebar__season'>
        <div className='sidebar__division-title'>
          <h3>Сезон</h3>
          <div className={this.props.hiddenFilters.includes('Season') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
          <ul className={this.props.hiddenFilters.includes('Season') ? 'hidden' : 'sidebar-ul sidebar__season-list-ul'} >
            {this.props.data.map((season, index) =>
              <SideBarSeasonListItem
                key={season}
                data={season}
                idx={index}
                isActive={this.state.isActive === index}
                seasonSettings={this.sideBarSeasonSettings}
                hiddenFilters={this.props.hiddenFilters}
              />
            )}
          </ul>
        </div>
      </div>
    );
  };
};


class BrandSideBarListItem extends Component {
  render() {
    const { hiddenFilters, brandSettings, isActive, data, idx } = this.props;
    return (
      <li className={hiddenFilters.includes('Brand') ? 'hidden' : 'sidebar-ul-li sidebar__brand-list-ul-li'} >
        <button className={isActive ? 'sidebar-button-active' : 'sidebar-button'} onClick={brandSettings({ name: 'brand', value: data }, idx)}>{data}</button>
      </li>
    );
  };
};

class SideBarBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: ''
    };
  };

  static get propTypes() {
    return {
      brandSettings: PropTypes.func.isRequired,
      hiddenFilters: PropTypes.array.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired
    };
  };

  handleClick = () => this.props.brandSettings('Brand');

  sideBarBrandSettings = (param, idx) => (event) => {
    event.preventDefault();
    this.props.setFilterParam(param);
    this.setState({
      isActive: idx
    });
  };

  render() {
    return (
      <div className='sidebar__brand'>
        <div className='sidebar__division-title'>
          <h3>Бренд</h3>
          <div className={this.props.hiddenFilters.includes('Brand') ? 'opener-up' : 'opener-down'} onClick={this.handleClick}></div>
          <ul className={this.props.hiddenFilters.includes('Brand') ? 'hidden' : 'sidebar-ul sidebar__brand-list-ul'} >
            {this.props.data.map((brand, index) =>
              <BrandSideBarListItem
                key={brand}
                data={brand}
                idx={index}
                isActive={this.state.isActive === index}
                brandSettings={this.sideBarBrandSettings}
                hiddenFilters={this.props.hiddenFilters}
              />
            )}
          </ul>
        </div>
      </div>
    );
  };
};


class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenFilters: []
    };
    //console.log(this.props)
  };

  static get propTypes() {
    return {
      setFilterParam: PropTypes.func.isRequired,
      setFilterArrayParam: PropTypes.func.isRequired,
      filtersValue: PropTypes.object.isRequired,
      maxPrice: PropTypes.number.isRequired,
      minPrice: PropTypes.number.isRequired,
      discounted: PropTypes.bool.isRequired,
      setDiscountedParam: PropTypes.func.isRequired,
      clearFilters: PropTypes.func.isRequired
    };
  };

  openerButton = (filterName) => {
    const filterIndex = this.state.hiddenFilters.findIndex((filter) => {
      return filter === filterName;
    });
    if (filterIndex === -1) {
      this.setState({
        hiddenFilters: [...this.state.hiddenFilters, filterName]
      });
    } else {
      this.setState({
        hiddenFilters: this.state.hiddenFilters.filter((item, index) => index !== filterIndex)
      });
    };
  };

  render() {
    const { setFilterParam, setFilterArrayParam, minPrice, maxPrice, filtersValue, clearFilters, setDiscountedParam, discounted } = this.props;
    const { hiddenFilters } = this.state;
    return (
      <section className='sidebar'>
        <section className='sidebar__division'>
          <SideBarCatalogueList
            shoesTypeSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
            data={filtersValue.type}
          />
        </section>
        <div className='separator-150 separator-150-1'></div>
        <section className='sidebar__division'>
          <SideBarPrice
            priceSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
            maxPrice={maxPrice}
            minPrice={minPrice}
          />
        </section>
        <div className='separator-150 separator-150-2'></div>
        <section className='sidebar__division'>
          <SideBarColor
            colorSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
          />
        </section>
        <div className='separator-150 separator-150-3'></div>
        <section className='sidebar__division'>
          <SideBarSize
            sizeSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterArrayParam={setFilterArrayParam}
            data={filtersValue.sizes}
          />
        </section>
        <div className='separator-150 separator-150-4'></div>
        <section className='sidebar__division'>
          <SideBarHeelSize
            heelSizeSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterArrayParam={setFilterArrayParam}
            data={filtersValue.heelSize}
          />
        </section>
        <div className='separator-150 separator-150-5'></div>
        <section className='sidebar__division'>
          <SideBarReason
            reasonSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
            data={filtersValue.reason}
          />
        </section>
        <div className='separator-150 separator-150-6'></div>
        <section className='sidebar__division'>
          <SideBarSeason
            seasonSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
            data={filtersValue.season}
          />
        </section>
        <div className='separator-150 separator-150-7'></div>
        <section className='sidebar__division'>
          <SideBarBrand
            brandSettings={this.openerButton}
            hiddenFilters={hiddenFilters}
            setFilterParam={setFilterParam}
            data={filtersValue.brand}
          />
          <label>
            <input
              checked={discounted}
              onChange={() => setDiscountedParam(!discounted)}
              type='checkbox'
              className='checkbox'
              name='checkbox-disc'
            />
            <span className='checkbox-discount'></span> <span className='text-discount'>Со скидкой</span>
          </label>
          <div className='separator-240'></div>
        </section>
        <section className='sidebar__division'>
          <div className='drop-down'>
            <a onClick={clearFilters} ><span className='drop-down-icon'></span>Сбросить</a>
          </div>
        </section>
      </section>
    );
  };
};

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeImg: this.props.images
    };
  };

  handleClick = (event) => this.props.addFavorite(event, this.props.id);

  itemArrowClickLeft = (event) => {
    event.preventDefault();
    const tempDataArr = [...this.state.activeImg];
    const firstImg = tempDataArr.shift();
    tempDataArr.push(firstImg);
    this.setState({
      activeImg: tempDataArr
    });
  };

  itemArrowClickRight = (event) => {
    event.preventDefault();
    const tempDataArr = [...this.state.activeImg];
    const lastImg = tempDataArr.pop();
    tempDataArr.unshift(lastImg);
    this.setState({
      activeImg: tempDataArr
    });
  };

  render() {
    const { id, title, isActive, brand, price, oldPrice } = this.props;
    return (
      <Link className="item-list__item-card item" to={`/productCard/${id}`}>
        <div className="item-pic">
          <img className="item-pic-img" src={this.state.activeImg[0]} alt={title} />
          <div className='product-catalogue__product_favorite' onClick={this.handleClick}>
            <p className={isActive ? 'product-catalogue__product_favorite-chosen' : 'product-catalogue__product_favorite-icon'} ></p>
          </div>
          <div className="arrow arrow_left" onClick={this.itemArrowClickLeft} ></div>
          <div className="arrow arrow_right" onClick={this.itemArrowClickRight} ></div>
        </div>
        <div className="item-desc">
          <h4 className="item-name">{title}</h4>
          <p className="item-producer">Производитель: <span className="producer">{brand}</span></p>
          <p className="item-price">{price}</p>
          {oldPrice && <p className="item-price old-price"><s>{oldPrice}</s></p>}
        </div>
      </Link>
    );
  };
};

class CatalogueProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: '',
      goods: '',
      page: 1,
      sortVal: 'price',
      favoriteKeyData: localStorage.favoriteKey ? JSON.parse(localStorage.favoriteKey) : [],
    };
    this.loadCatalogue(this.props.urlParam);
  };

  static get propTypes() {
    return {
      filterParam: PropTypes.string,
      catalogueParam: PropTypes.object,
      setDiscountedParam: PropTypes.func.isRequired,
      setFilterArrayParam: PropTypes.func.isRequired,
      setFilterParam: PropTypes.func.isRequired,
      filters: PropTypes.object.isRequired,
      filtersValue: PropTypes.object.isRequired,
      clearFilters: PropTypes.func.isRequired,
      urlParam: PropTypes.string
    };
  };

  componentWillUpdate(nextProps) {
    if (this.props.urlParam !== nextProps.urlParam) {
      this.loadCatalogue(nextProps.urlParam);
    };
  };

  loadCatalogue = (urlParam) => {
    fetch(`https://api-neto.herokuapp.com/bosa-noga/products?${urlParam}`, {
      method: "GET"
    })
      .then(response => {
        if (200 <= response.status && response.status < 300) {
          return response;
        }
        throw new Error(response.statusText);
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: data.data,
          pages: data.pages,
          goods: data.goods,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  setSortByFilter = (event) => {
    const sortValue = event.currentTarget.value;
    const sortUrlParam = this.props.urlParam ? this.props.urlParam + `&sortBy=${sortValue}` : `sortBy=${sortValue}`;
    this.loadCatalogue(sortUrlParam);
    this.setState({
      urlParam: sortUrlParam,
      sortVal: sortValue,
    });
  };

  pageClick = (page) => (event) => {
    event.preventDefault();
    const pageUrlParam = this.props.urlParam ? this.props.urlParam + `&page=${page}` : `page=${page}`;
    this.loadCatalogue(pageUrlParam);
    this.setState({
      urlParam: pageUrlParam,
      page: page
    });
  };

  arrowClick = (value) => (event) => {
    event.preventDefault();
    const newPageNumber = this.state.page + value;
    if (newPageNumber < 1 || newPageNumber > this.state.pages) return;
    const pageUrlParam = this.props.urlParam ? this.props.urlParam + `&page=${newPageNumber}` : `page=${newPageNumber}`;
    this.loadCatalogue(pageUrlParam);
    this.setState({
      page: newPageNumber
    });
  };

  checkActiveId = (itemID) => {
    const favoriteData = this.state.favoriteKeyData && this.state.favoriteKeyData;
    if (favoriteData.length > 0) {
      const result = favoriteData.find((el) => itemID === el.id);
      return result
    };
  };

  favoriteAdd = (event, itemID) => {
    event.preventDefault();
    const tempFavoriteKeyData = [...this.state.favoriteKeyData];
    const favoriteFilter = this.state.favoriteKeyData.filter((el) => itemID === el.id);
    if (favoriteFilter.length > 0 && favoriteFilter[0].id === itemID) {
      const removeData = this.state.favoriteKeyData.indexOf(favoriteFilter[0]);
      tempFavoriteKeyData.splice(removeData, 1);
      this.setState({
        favoriteKeyData: tempFavoriteKeyData
      });
      const serialTempData = JSON.stringify(tempFavoriteKeyData);
      localStorage.setItem("favoriteKey", serialTempData);
    } else {
      tempFavoriteKeyData.push(this.state.data.find((el) => itemID === el.id));
      this.setState({
        favoriteKeyData: tempFavoriteKeyData,
      });
      const serialTempData = JSON.stringify(tempFavoriteKeyData);
      localStorage.setItem("favoriteKey", serialTempData);
    };
  };

  render() {
    const { goods, pages, page, data, sortVal } = this.state;
    const { setDiscountedParam, setFilterArrayParam, setFilterParam, clearFilters, filters, filtersValue, catalogueParam } = this.props;
    return (
      <main className="product-catalogue">
        <SideBar setFilterParam={setFilterParam} setFilterArrayParam={setFilterArrayParam} filtersValue={filtersValue}
          maxPrice={filters.maxPrice} minPrice={filters.minPrice} discounted={filters.discounted} setDiscountedParam={setDiscountedParam} clearFilters={clearFilters} />
        <section className="product-catalogue-content">
          <section className="product-catalogue__head">
            <div className="product-catalogue__section-title">
              <h2 className="section-name">{catalogueParam ? catalogueParam.activeCategory.title : 'Каталог'}</h2>
              <span className="amount">{goods}</span>
            </div>
            <div className="product-catalogue__sort-by">
              <p className="sort-by">Сортировать</p>
              <select
                name="sortBy"
                value={sortVal}
                onChange={this.setSortByFilter}
                id="sorting">
                <option value="popularity">по популярности</option>
                <option value="price">по цене</option>
              </select>
            </div>
          </section>
          {goods === 0 ?
            <section className="product-catalogue__item-list">
              <p className="product-catalogue__item-list_not-found">По вашему запросу товар не найден</p>
            </section> :
            <section className="product-catalogue__item-list">
              {data.length > 0 && data.map(items =>
                <ListItem key={items.id}
                  id={items.id}
                  title={items.title}
                  images={items.images}
                  brand={items.brand}
                  price={items.price}
                  oldPrice={items.oldPrice}
                  addFavorite={this.favoriteAdd}
                  isActive={this.checkActiveId(items.id)}
                />
              )}
            </section>}
          {pages && <Pagination page={page} pages={pages} pageClick={this.pageClick} arrowClick={this.arrowClick} />}
        </section>
        <div style={{ clear: 'both' }}></div>
      </main>
    );
  };
};


class Catalogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlookedData: sessionStorage.overlookedKey ? JSON.parse(sessionStorage.overlookedKey) : [],
      urlParam: this.props.filterParam,
      categoryId: this.props.catalogueParam ? this.props.catalogueParam.activeCategory.id : '',
      shoesType: '',
      color: '',
      sizes: [],
      heelSizes: [],
      minPrice: 0,
      maxPrice: 90000,
      reason: '',
      season: '',
      brand: '',
      search: '',
      discounted: false
    };
  };

  static get propTypes() {
    return {
      categories: PropTypes.array,
      catalogueParam: PropTypes.shape({
        activeCategory: PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired
        }),
        selectedCategoriesProps: PropTypes.object.isRequired
      }),
      filters: PropTypes.shape({
        brand: PropTypes.array.isRequired,
        color: PropTypes.array.isRequired,
        heelSize: PropTypes.array.isRequired,
        reason: PropTypes.array.isRequired,
        season: PropTypes.array.isRequired,
        sizes: PropTypes.array.isRequired,
        type: PropTypes.array.isRequired
      }).isRequired,
      filterParam: PropTypes.string
    };
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      this.catalogueUrlConfigurator(nextProps, nextState);
    };
  };

  updateFilters = (nextProps) => {
    const types = nextProps.catalogueParam.selectedCategoriesProps;
    Object.keys(types).forEach(name => {
      switch (name) {
        case 'reason':
          this.setState({
            reason: name
          });
          break;
        case 'shoesType':
          this.setState({
            shoesType: name
          });
          break;
        case 'season':
          this.setState({
            season: name
          });
          break;
        case 'brand':
          this.setState({
            brand: name
          });
          break;
        case 'search':
          this.setState({
            search: name
          });
          break;
        default:
          break;
      };
    });
  };

  setFilterParam = ({ name, value }) => {
    if (this.state[name] === value) return;
    this.setState({
      [name]: value
    });
  };

  setFilterArrayParam = (event) => {
    const { value, name } = event.currentTarget;
    const filter = this.state[name];
    const index = filter.indexOf(+value);
    if (index === -1) {
      filter.push(+value);
    } else {
      filter.splice(index, 1);
    }
    this.setState({
      [name]: filter
    });
  };

  setDiscountedParam = (param) => {
    this.setState({
      discounted: param
    });
  };

  clearFilters = () => {
    this.setState({
      shoesType: '',
      color: '',
      sizes: [],
      heelSizes: [],
      minPrice: 0,
      maxPrice: 90000,
      reason: '',
      season: '',
      brand: '',
      search: '',
      discounted: false
    });
  };

  catalogueUrlConfigurator = (nextProps, nextState) => {
    const { shoesType, color, categoryId, reason, season, brand, minPrice, maxPrice, search, discounted, sizes, heelSizes } = nextState;
    const sizeParam = sizes.reduce((param, size) => {
      return param + `size[]=${size}&`;
    }, '');
    const heelSizeParam = heelSizes.reduce((param, heelSize) => {
      return param + `heelSize[]=${heelSize}&`;
    }, '');
    const type = shoesType;

    // const categoryIdParam = categoryId ? `categoryId=${categoryId}&` : '';
    // const typeParam = shoesType ? `type=${shoesType}&` : '';
    // const colorParam = color ? `color=${color}&` : '';
    // const reasonParam = reason ? `reason=${reason}&` : '';
    // const seasonParam = season ? `season=${season}&` : '';
    // const brandParam = brand ? `brand=${brand}&` : '';
    // const minPriceParam = minPrice ? `minPrice=${minPrice}&` : '';
    // const maxPriceParam = maxPrice ? `maxPrice=${maxPrice}&` : '';
    // const searchParam = search ? `search=${search}&` : '';
    // const discountedParam = discounted ? `discounted=${discounted}` : '';


    const urlParam = querystring.encode({type, color, reason, season, brand, minPrice, maxPrice, search, discounted}).split('&').filter(function(el) {
        return /=\w|\%/.test(el) 
  }).join('&');

    // const urlParam = categoryIdParam + typeParam + colorParam + sizeParam + heelSizeParam + minPriceParam + maxPriceParam + reasonParam + seasonParam + brandParam + searchParam + discountedParam;
    if (this.state.urlParam !== urlParam) {
      this.setState({
        urlParam: urlParam
      });
    };

    // console.log(urlParam); 
    
  };

  render() {
    
    const { overlookedData, urlParam } = this.state;
    const { filterParam, catalogueParam, filters, filterLoader } = this.props
    const { setSortByFilter, setDiscountedParam, setFilterParam, setFilterArrayParam, state, clearFilters } = this
    return (
      <div>
        <SitePath filterParamFunc={filterLoader}
          filterParam={catalogueParam} mainUrlparam={{ to: '/catalogue/', title: 'Каталог' }} />
        <CatalogueProductList
          filterParam={filterParam}
          catalogueParam={catalogueParam}
          setSortByFilter={setSortByFilter}
          setDiscountedParam={setDiscountedParam}
          setFilterArrayParam={setFilterArrayParam}
          setFilterParam={setFilterParam}
          filters={state}
          filtersValue={filters}
          clearFilters={clearFilters}
          urlParam={urlParam}
        />
        {overlookedData.length > 0 && <OverlookedSlider overlookedData={overlookedData} />}
      </div>
    );
  };
};

export default Catalogue;
