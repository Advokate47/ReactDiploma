import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import slider from './slider';
import slider1 from '../img/slider1.jpg';
import slider180deg from '../img/slider180deg.jpeg';

// const Slider = () => {
  
// };

class Slider extends React.Component {
  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
    this.textInput = React.createRef();
      this.focusTextInput = this.focusTextInput.bind(this);
  }

  // focus() {
  //   // Установка фокуса на поле текстового ввода (input) с явным использованием исходного API DOM
  //   this.textInput.focus();
  // }

  focusTextInput() {
    // Явная фокусировка на текстовом поле, используя нативный DOM API
    // Обратите внимание: мы осуществляем доступ к
    // свойству current, чтобы получить DOM-узел
    this.textInput.current.focus();
  }

  render() {
    // Использование обратного вызова `ref` для сохранения ссылки на поле текстового ввода (input)
    // как элемента DOM в this.textInput.
    return (
      <div className="wrapper">
        <div className="slider__pictures" ref={this.textInput} onClick={this.focusTextInput}>
          <Link className="slider__image" to="/">
            <img src={slider1} alt="slide img" />
          </Link>
          <Link className="slider__image" to="/">
            <img src={slider180deg} alt="slide img" />
          </Link>
          <Link className="slider__image" to="/">
            <img src={slider1} alt="slide img" />
          </Link>
          <Link className="slider__image" to="/">
            <img src={slider180deg} alt="slide img" />
          </Link>
          <div className="arrow slider__arrow slider__arrow_left" ></div>
          <div className="arrow slider__arrow slider__arrow_right" ></div>
          <div className="slider__circles" >
            <button className="slider__circle" value="0"></button>
            <button className="slider__circle" value="1"></button>
            <button className="slider__circle" value="2"></button>
            <button className="slider__circle" value="3"></button>
          </div>
          <h2 className="h2">К весне готовы!</h2>
        </div>
      </div>
    );

    // return (
    //   <div>
    //     <input
    //       type="text"
    //       ref={(input) => { this.textInput = input; }} />
    //     <input
    //       type="button"
    //       value="Focus the text input"
    //       onClick={this.focus}
    //     />
    //   </div>
    // );
  }
}


const SalesNews = () => {
  return (
    <div className="sales-and-news__items">
      {salesItemsData.map(item => <div key={item.id} className={`sales-and-news__item sales-and-news__item_${item.id}`}>
        <Link to={item.to} className="sales-and-news__item-link">
          <h3 className="h3">{item.title[0]}<br /><span>{item.title[1]}</span></h3>
        </Link>
      </div>)}
      <div className="sales-and-news__news">
        <div className="sales-and-news__arrow sales-and-news__arrow_up arrow"></div>
        {salesNewsData.map(item =>
          <div key={item.id} className="sales-and-news__new">
            <time dateTime={item.time}>{item.pubdate}</time>
            <Link className="sales-and-news__item-link" to={item.to}>{item.title}</Link>
          </div>)}
        <div className="sales-and-news__arrow sales-and-news__arrow_down arrow"></div>
      </div>
    </div>
  );
};

const salesItemsData = [
  {
    id: 1,
    to: "/",
    title: ["обувь к свадьбе"]
  },
  {
    id: 2,
    to: "/",
    title: ["20% скидка", "На летнюю обувь"]
  },
  {
    id: 3,
    to: "/",
    title: ["готовимся к лету!"]
  },
  {
    id: 4,
    to: "/",
    title: ["Больше покупок – ", "больше скидка!"]
  }
];

const salesNewsData = [
  {
    id: 1,
    to: "/",
    time: "2017-01-18 00:00",
    pubdate: "18 января 2017",
    title: "Американские резиновые сапоги Bogs идеально подходят для русской зимы!"
  },
  {
    id: 2,
    to: "/",
    time: "2017-05-18 00:00",
    pubdate: "18 мая 2017",
    title: "Магазины Bosa Noga"
  },
  {
    id: 3,
    to: "/",
    time: "2017-03-10 00:00",
    pubdate: "10 марта 2017",
    title: "Тенденция весны 2018: розовый и фуксия. 10 пар обуви для яркого образа"
  }
];

const AboutUs = () => {
  return (
    <div>
      <h2 className="about-us__title">Клиенты делают заказ
        <br /> в интернет-магазине BosaNoga!</h2>
      <p className="about-us__text">
        В Интернете можно встретить немало магазинов, предлагающих аксессуары. Но именно к нам хочется возвращаться снова и снова.
      </p>
      <h3 className="about-us__text_header">Мы предлагаем вам особые условия:</h3>
      <ol className="about-us__text">
        <li>Индивидуальный подход специалиста. Когда поступает новая коллекция обуви весна-лето или же коллекция обуви осень-зима
          – покупателям бывает трудно сориентироваться во всем многообразии новинок. Наш менеджер по телефону поможет вам
          определиться с товарами, подходящими именно вам.</li>
        <li>Мы периодически проводим распродажи как женских и мужских, так и детских моделей. Вы будете приятно удивлены ценами
          на аксессуары в магазине BosaNoga.</li>
        <li>У нас всегда есть из чего выбрать. Неважно, какую категорию вы просматриваете: осень-зима, или же весна-лето –
          вы всегда сможете найти варианты, подходящие вам по внешнему виду и цене.</li>
        <li>Мы несем ответственность за все товары.</li>
        <li>Молодые мамы будут рады обширному ассортименту детских моделей.</li>
      </ol>
      <p className="about-us__text">
        Если вы ищете место, где представлены обувные новинки от самых известных брендов, то вы зашли по верному адресу.
      </p>
      <p className="about-us__text">
        У нас представлены модели для мужчин, женщин, а также детские сапоги, босоножки, ботинки и туфли. Сделав заказ в нашем интернет-магазине,
        вы сможете быть модным и стильным как осенью-зимой, так и весной-летом. Просто наберите номер нашего телефона, и мы
        поможем вам определиться с покупкой.
      </p>
      <span className="about-us__text_overlay"></span>
      <button className="about-us__text_button">читать</button>
    </div>
  );
};

const ProductFirst = (props) => {
  return (
    <div className="new-deals__product new-deals__product_first">
      <Link className="new-deals__product_link" to={`productCard/${props.id}`}>
        <img className="new-deals__product_first_img" src={props.images} alt={"lastProduct"} />
      </Link>
    </div>
  );
};

class ProductActive extends Component {
  handleClick = (event) => this.props.func(event, this.props.id);
  render() {
    return (
      <div>
        <div className="new-deals__product new-deals__product_active">
          <Link className="new-deals__product_link" to={`productCard/${this.props.id}`}>
            <img className="new-deals__product_active_img" src={this.props.images} alt={"ActiveProduct"} />
          </Link>
          <div className={this.props.isActive ? "new-deals__product_favorite-chosen" : "new-deals__product_favorite"} onClick={this.handleClick}></div>
        </div>
      </div>
    );
  };
};

const ProductLast = (props) => {
  return (
    <div className="new-deals__product new-deals__product_last">
      <Link className="new-deals__product_link" to={`productCard/${props.id}`}>
        <img className="new-deals__product_last_img" src={props.images} alt={"LastProduct"} />
      </Link>
    </div>
  );
};

class DealsSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      favoriteKeyData: localStorage.favoriteKey ? JSON.parse(localStorage.favoriteKey) : [],
    };
  };

  static get propTypes() {
    return {
      data: PropTypes.array.isRequired,
      infoFunc: PropTypes.func.isRequired
    };
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        data: this.props.data
      });
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

  moveLeft = () => {
    const tempDataArr = [...this.state.data];
    const firstItem = tempDataArr.shift();
    tempDataArr.push(firstItem);
    this.setState({
      data: tempDataArr,
    });
    this.props.infoFunc(tempDataArr[1]);
  };

  moveRight = () => {
    const tempDataArr = [...this.state.data];
    const lastItem = tempDataArr.pop();
    tempDataArr.unshift(lastItem);
    this.setState({
      data: tempDataArr,
    });
    this.props.infoFunc(tempDataArr[1]);
  };

  checkActiveId(itemID) {
    const favoriteData = this.state.favoriteKeyData && this.state.favoriteKeyData;
    if (favoriteData.length > 0) {
      const result = favoriteData.find((el) => itemID === el.id);
      return result;
    };
  };

  render() {
    const { data } = this.state
    return (
      <div className="new-deals__slider">
        <div className="new-deals__arrow new-deals__arrow_left arrow" onClick={this.moveLeft}></div>
        <ProductFirst images={data[0].images[0]} id={data[0].id} />
        <ProductActive
          images={data[1].images[0]}
          func={this.favoriteAdd}
          id={data[1].id}
          isActive={this.checkActiveId(data[1].id)}
        />
        <ProductLast images={data[2].images[0]} id={data[2].id} />
        <div className="new-deals__arrow new-deals__arrow_right arrow" onClick={this.moveRight}></div>
      </div>
    );
  };
};


class ListItem extends Component {
  handleClick = () => this.props.func(this.props.idx);
  render() {
    return (
      <li className={this.props.isActive ? 'new-deals__menu-item new-deals__menu-item_active' : 'new-deals__menu-item'}>
        <button className={this.props.isActive ? 'new-deals__item-button new-deals__item-button_active' : 'new-deals__item-button'} onClick={this.handleClick}>{this.props.title}</button>
      </li>)
  };
};

class NewDealsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: "",
    };
  };
  static get propTypes() {
    return {
      func: PropTypes.func.isRequired
    };
  };

  handleClick = (index) => {
    this.props.func(index);
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { activeIndex } = this.state;
    const { categories } = this.props;
    return (
      <div className="new-deals__menu">
        <ul className="new-deals__menu-items">
          {categories.map((item, index) => <ListItem key={item.id}
            url={item.url}
            func={this.handleClick}
            title={item.title}
            isActive={activeIndex === index}
            idx={index} />)}
        </ul>
      </div>
    );
  };
};

class NewDeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeData: null
    };
  };

  static get propTypes() {
    return {
      data: PropTypes.array,
      info: PropTypes.object,
      categories: PropTypes.array.isRequired
    };
  };

  loadProductInfo = (param) => {
    this.setState({
      productInfo: param
    });
  };

  setActiveCategory = (idx) => {
    const { categories, data } = this.props;
    const activeCategoryFilter = data.filter((item) => categories[idx].id === item.categoryId);
    if (activeCategoryFilter.length > 0) {
      this.setState({
        activeData: activeCategoryFilter
      });
    };
  };

  render() {
    return (
      <section className="new-deals wave-bottom">
        <h2 className="h2">Новинки</h2>
        <NewDealsMenu categories={this.props.categories} func={this.setActiveCategory} />
        <DealsSlider data={this.state.activeData ? this.state.activeData : this.props.data} infoFunc={this.loadProductInfo} />
        <ProductInfo info={this.props.info} />
      </section>
    );
  };
};

const ProductInfo = (props) => {
  return (
    <div className="new-deals__product-info">
      <Link to="productCard" className="h3">{props.info.title}</Link>
      <p>Производитель:
          <span>{props.info.brand}</span>
      </p>
      <h3 className="h3">{props.info.price}₽</h3>
    </div>
  );
};


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      featuredData: null,
      productInfo: null,
      check: false
    };
  };

  static get propTypes() {
    return {
      categories: PropTypes.array,
    };
  };

  componentDidMount() {
    let sliderPictures = this.textInput.current.textInput.current;
    // console.log(this.textInput.current.textInput.current);
    // let sliderImage = sliderPictures.firstChild;
    // console.log(sliderImage)

    // var f = document.querySelector('.slider__pictures'),
    let a = sliderPictures.getElementsByClassName('slider__image'),
      button = sliderPictures.getElementsByClassName('slider__circle'),
      arrows = sliderPictures.getElementsByClassName('slider__arrow');
    slider(sliderPictures, a, button, '4000', '1000', arrows);
    const featured = this.featuredFetch()
    Promise.all([featured]).then(([featured]) => {
      this.setState({
        featuredData: featured.data,
        productInfo: featured.data[1],
        check: true,
      });
    }
    );
  };

  featuredFetch = () => {
    return new Promise((resolve, reject) => {
      fetch("https://api-neto.herokuapp.com/bosa-noga/featured", {
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
          resolve(data)
        })
        .catch(error => {
          reject(error)
        });
    });
  };

  availableCategories() {
    const categories = this.props.categories;
    const featuredData = this.state.featuredData;
    return categories.filter(category => featuredData.find(item => item.categoryId === category.id)).sort((a, b) => a.id > b.id);
  };

  render() {
    const { featuredData, productInfo } = this.state;
    return (
      <div className='main-page'>
        <section className="slider">
          <Slider ref={this.textInput} />
        </section>
        {this.state.check && <NewDeals categories={this.availableCategories()} data={featuredData} info={productInfo} />}
        <section className="sales-and-news wave-bottom">
          <h2 className="h2">акции и новости</h2>
          <SalesNews />
        </section>
        <section className="about-us">
          <AboutUs />
        </section>
      </div>
    );
  };
};

export default MainPage;