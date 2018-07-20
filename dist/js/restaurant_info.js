(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const idbKey = require('./indexedb');

const scheme = 'http://',
  host = 'localhost',
  port = ':1337',
  path = {
    restaurants: '/restaurants/',
    reviews: '/reviews/'
  },
  query = {
    is_favorite: '/?is_favorite=',
    restaurant_id: '?restaurant_id='
  },

  baseURI = scheme + host + port;
  
const DBHelper = {

  DATABASE_URL:{
    GET: {
      allRestaurants: () => fetch(baseURI + path.restaurants),
      allReviews: () => fetch(baseURI + path.reviews),
      restaurant: (id) => fetch(baseURI + path.restaurants + id ),
      restaurantReviews: (id) => fetch(baseURI + path.reviews + query.restaurant_id + id)
    },
    POST: {
      newReview: (body) => fetch(baseURI + path.reviews, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    },
    PUT: {
      favoriteRestaurant: (id, answer) => fetch(baseURI + path.restaurants + id + query.is_favorite + answer, {
        method: 'PUT'
      }),
      updateReview: (id) => fetch(baseURI + path.reviews + id, {
        method: 'PUT'
      })
    },
    DELETE: {
      review: (id) => fetch(baseURI + path.reviews + id, {
        method: 'DELETE'
      })
    }
  },
  /**
   * Fetch all restaurants.
   */
  fetchRestaurants: () => {
    const store = 'restaurants';
    return idbKey.getAll(store)
    .then(restaurants => {
      if (restaurants.length < 10) {
        return DBHelper.DATABASE_URL.GET.allRestaurants()
        .then(response => response.json())
        .then(restaurants => {
          console.log('- Restaurants data fetched !');
          return restaurants.restaurants || restaurants;
        })
        .then(restaurants => {
          restaurants.forEach(restaurant => {
            restaurant.is_favorite = restaurant.is_favorite.toString();
            idbKey.set(store, restaurant);
          });
          return restaurants;
        })
        .catch(error => console.error(`Request failed. Returned status of ${error}`));
      } else {
        return restaurants;
      }
    }).catch(error => {
      console.error(error)
    });
  },
  /**
   * Fetch all reviews.
   */
  fetchReviews: () => {
    return DBHelper.DATABASE_URL.GET.allReviews()
    .then(response => response.json())
    .then(reviews => {
      console.log('- Reviews data fetched !');
      return reviews.reviews || reviews;
    })
    .catch(error => console.error(`Request failed. Returned status of ${error}`));
  },
  
  /**
   * Fetch restaurant reviews.
   */
  fetchRestaurantReviews: async (id) => {
    const store = 'reviews';
    let cachedReviews = await idbKey.getAll(store).catch(error => console.error(error))
    cachedReviews = cachedReviews.filter(review => review.restaurant_id === Number(id));
    
    if (!cachedReviews.length) {
      const response = await DBHelper.DATABASE_URL.GET.restaurantReviews(id).catch(error => console.error(`Request failed. Returned status of ${error}`));
      console.log('- Restaurant reviews fetched !');
      let reviews = await response && response.json();
      reviews = await reviews && reviews.reviews || await reviews;
      await reviews && await reviews.length && await reviews.forEach(review => idbKey.set(store, review));
      return reviews;
    } 
    else {
      return cachedReviews;
    };
  },
  
  /**
   * Fetch a restaurant by its ID.
   */
  fetchRestaurantById: (id) => {
    // fetch all restaurants with proper error handling.
    const store = 'restaurants';

    return idbKey.get(store, Number(id))
      .then((restaurant) => {
        if (!restaurant) {
          console.log('- No restaurant cached');
          return DBHelper.DATABASE_URL.GET.restaurant(id)
            .then(response => response.json())
            .then(restaurant => {
              restaurant.is_favorite = restaurant.is_favorite.toString();
              idbKey.set(store, restaurant);
              return restaurant;
            })
            .catch(error => console.error(`Restaurant does not exist: ${error}`));
        } else {
          return restaurant;
        }
      })
  },

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  fetchRestaurantByCuisineAndNeighborhood: (cuisine, neighborhood) => {
    // Fetch all restaurants
    const store = 'restaurants';
    return idbKey.getAll(store)
      .then((cachedResults) => {
        if (cachedResults.length < 10) {
          return DBHelper.fetchRestaurants()
            .then(restaurants => {
              const results = restaurants;
              results.forEach((restaurant) => idbKey.set(store, restaurant));
              return DBHelper.filterResults(results, cuisine, neighborhood);
            })
            .catch(error => console.error(error));
        } else {
          return DBHelper.filterResults(cachedResults, cuisine, neighborhood);
        }
      }).catch((error) => console.error(error));
  },

  filterResults: (results, cuisine, neighborhood) => {
    if (cuisine !== 'all') {
      results = results.filter(restaurant => restaurant.cuisine_type == cuisine);
    }
    if (neighborhood !== 'all') {
      results = results.filter(restaurant => restaurant.neighborhood == neighborhood);
    }
    return results;
  },
  /**
   * Fetch all neighborhoods with proper error handling.
   */
  addNeighborhoodsOptions: (restaurants) => {
    // Get all neighborhoods from all restaurants
    const neighborhoods = restaurants.map(restaurant => restaurant.neighborhood);
    // Remove duplicates from neighborhoods
    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
    return uniqueNeighborhoods;
  },

  /**
   * Fetch all cuisines with proper error handling.
   */
  addCuisinesOptions: (restaurants) => {
    // Get all cuisines from all restaurants
    const cuisines = restaurants.map(restaurant => restaurant.cuisine_type);
    // Remove duplicates from cuisines
    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
    return uniqueCuisines;
  },

  /**
   * Restaurant page URL.
   */
  urlForRestaurant: (restaurant) => {
    return (`restaurant.html?id=${restaurant.id}`);
  },

  /**
   * Restaurant image URL.
   */
  imageUrlForRestaurant: (restaurant) => {
    return (`assets/img/jpg/${restaurant.photograph}`);
  },
  
  imageWebpUrlForRestaurant: (restaurant) => {
    return (`assets/img/webp/${restaurant.photograph}`);
  },

  postReview: async (e) => {
    console.log('Trying to post review...')
    e.preventDefault();
    const form = document.querySelector('#title-container form').elements;
    const body = {
      restaurant_id: Number(window.location.search.match(/\d+/)[0]),
      name: form["name"].value,
      rating: Number(form["rating"].value),
      comments: form["comments"].value,
    }
    await idbKey.set('posts', body);
    body.createdAt = Date.now(),
    body.updatedAt = Date.now();
    await idbKey.addReview('reviews', body);
    const registration = await navigator.serviceWorker.ready
    Notification.requestPermission()
      .then(function (result) {
        if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
        }
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
        }
        if (result === 'granted') { 
          console.log('Notification allowed')
        }
      });
    await registration.sync.register('post-review');
    location.reload();
  },

  setFavorite: async (target, restaurant) => {
    target.classList.toggle('hidden');
    const favorite = restaurant.is_favorite === 'true'? 'false' : 'true';
    const store = 'restaurants';
    restaurant.is_favorite = favorite;
    await idbKey.set(store, restaurant);
    return await DBHelper.DATABASE_URL.PUT.favoriteRestaurant(restaurant.id, favorite);
  },
  /**
   * Map marker for a restaurant.
   */
  mapMarkerForRestaurant: (restaurant, map) => {
    const marker = new google.maps.Marker({
      position: {
        lat: restaurant.lat || restaurant.latlng.lat,
        lng: restaurant.lng || restaurant.latlng.lng
      },
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'assets/img/svg/marker.svg'
    });
    return marker;
  }
};

module.exports = DBHelper;
},{"./indexedb":3}],2:[function(require,module,exports){
const
  filterOptions = document.querySelector('.filter-options'),
  filterButton = document.getElementById('menuFilter');
  filterResultHeading = document.querySelector('.filter-options h3');
  
const launch = {
  goToRestaurantPage: (e) => {
    e.target.classList.toggle('move-left');
    window.location.assign(e.target.dataset.url)
  },
  fixedOnViewport: (referer, target) => {

    const clonedTarget = target.cloneNode(true);
    clonedTarget.className = 'fixed exclude';

    target.appendChild(clonedTarget);
    
    if ('IntersectionObserver' in window) {
      const options = {
        root: null,
        threshold: [0.01],
        rootMargin: "0px"
      }
      
      const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          
          if (entry.intersectionRatio <= .01) {
            clonedTarget.classList.remove('exclude');
            clonedTarget.classList.add('shadow');
            target.classList.add('shadow');
          } else {
            if (target.classList.contains('shadow')){ target.classList.remove('shadow');}
            clonedTarget.classList.remove('shadow');
            clonedTarget.classList.add('exclude');
          }
        });
      },options);
      observer.observe(referer);
    }
  },

  toggleMenu: () => {
    filterOptions.classList.toggle('optionsOpen');
    filterOptions.setAttribute('aria-hidden', 'false');
    filterButton.classList.toggle('pressed');
    filterButton.blur();
    filterResultHeading.setAttribute('tabindex', '-1');
    filterResultHeading.focus();
  },
  isFormValid: () => {
    if (document.querySelector('form').checkValidity()) {
      document.querySelector('form input[type="submit"]').style.color = "green";
    } else {
      document.querySelector('form input[type="submit"]').style.color = "#ca0000";
    }
  },
  toggleForm: () => {
    document.getElementById('title-container').classList.toggle("reviews-toggled");
    document.getElementById('reviews-list').classList.toggle("reviews-toggled");
    document.querySelector('section form').classList.toggle("toggled-display");
    setTimeout(() => {
      document.querySelector('section form').classList.toggle("toggled-translate");
    },800)
  },
  lazyLoading:() => {
    const lazyImages = [].slice.call(document.querySelectorAll('.lazy'));

    if ('IntersectionObserver' in window) {
      const options = {
        root: null,
        threshold: [],
        rootMargin: "200px"
      }
      for (let i = 0.00; i <= 1; i += 0.01){
        options.threshold.push(Math.round(i*100)/100);
      }
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(function (entry) {
          const lazyImage = entry.target;
          if (entry.isIntersecting || entry.intersectionRatio >= .01) {
            if (lazyImage.localName === 'source') {
              lazyImage.srcset = lazyImage.dataset.srcset;
            } else {
              lazyImage.src = lazyImage.dataset.src;
            }
            lazyImage.classList.remove('lazy');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      }, options);
      lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          launch.lazyLoading();
        }
      }
    } else {
      // Possible fallback to a more compatible method here
      let lazyImages = [].slice.call(document.querySelectorAll('.lazy'));

      let active = false;
      const lazyLoad = function () {
        if (active === false) {
          active = true;
          const windowInnerHeight = window.innerHeight + 200;

          // setTimeout(function () {
          lazyImages.forEach(function (lazyImage) {
            if ((lazyImage.getBoundingClientRect().top <= windowInnerHeight
              && lazyImage.getBoundingClientRect().bottom >= 0)
              && getComputedStyle(lazyImage).display !== 'none') {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.classList.remove('lazy');

              lazyImages = lazyImages.filter(function (image) {
                return image !== lazyImage;
              });

              if (lazyImages.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
              }
            }
          });

          active = false;
          // }, 200);
        }
      };
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
      if (document.readyState == "complete") {
        console.log('document ready for lazy load');
        lazyLoad();
      }
      document.onreadystatechange = function () {
        if (document.readyState == "complete") {
          console.log('document ready for lazy load');
          lazyLoad();
        }
      }
    }
  },
  sortByNote: (a, b) => {
    const aNote = launch.getAverageNote(a.reviews)
    const bNote = launch.getAverageNote(b.reviews)
    if (bNote > aNote) {
      return 1
    }
    if (bNote < aNote) {
      return -1
    }
    return 0;
  },
  sortByName: (a, b) => {
    return a.name > b.name;
  },
  sortByNameInverted: (a, b) => {
    return a.name < b.name; 
  },
  getAverageNote: (id, reviews = self.reviews) => {
    let totalRatings = 0;
    let totalReviews = 0;
    reviews && reviews.forEach(review => {
      if (review.restaurant_id === id) {
        totalRatings += Number(review.rating);
        totalReviews++;
      }
    });
    totalRatings = totalRatings / totalReviews;
    return totalRatings && `${(Math.round(totalRatings * 10)) / 10}/5` || 'N/A';
  },
  switchToDefaultImage: (event, observer) => {
    observer.unobserve(event.target);
    if (event.target.localName === 'source') {
      return event.target.srcset = 'assets/img/svg/no-wifi.svg';
    } else {
      return event.target.src = 'assets/img/svg/no-wifi.svg';
    }
  }
};
module.exports = launch;
},{}],3:[function(require,module,exports){
const idb = require('../../node_modules/idb/lib/idb');

const openDatabase = () => {
  return idb.open('restaurant-reviews', 3, (upgradeDb) => {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
      case 1:
        upgradeDb.createObjectStore('reviews', { keyPath: 'id', autoIncrement:true});
      case 1:
        upgradeDb.createObjectStore('posts', {keyPath: 'restaurant_id'});
    }
  })
};

const idbKey = {
  get(store, key) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .get(key);
    }).catch(error => console.error(error));
  },
  set(store, value) {
    return openDatabase().then(db => {
      if (!db) return;
      const tx = db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .put(value);
      return tx.complete;
    }).catch(error => console.error(error));
  },
  getAll(store) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .getAll();
    }).catch(error => console.error(error));
  },
  delete(store, id) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .delete(id);
    }).catch(error => console.error(error));
  },
  addReview(store, review) {
    return openDatabase().then(db => {
      if (!db) {
        return;
      }
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .add(review);
    }).catch(error => console.error(error));
  },
  getRestaurantReviews(store, key) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .getAll()
        .then(reviews => reviews.filter(review => review.restaurant_id === key))
    }).catch(error => console.error(error));
  }
};
module.exports = idbKey;
},{"../../node_modules/idb/lib/idb":5}],4:[function(require,module,exports){
const DBHelper = require('./dbhelper');
const Launch = require('./helpers');

var restaurant;
var map;

const mapLoader = document.getElementById('map-loader');

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const pathToServiceWorker = window.location.hostname === 'hallya.github.io' ? '/mws-restaurant-stage-1/sw.js' : '../sw.js'
    navigator.serviceWorker.register(pathToServiceWorker)
      .then(registration => {
        registration.sync.register('post-review');
        registration.sync.register('fetch-new-reviews');
        console.log('Registered to SW & "post-review" sync tag & "fetch-new-reviews" tag')
      });
  }
});
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL()
    .then(restaurant => {
      const mapPlaceHolder = document.createElement('div');
      mapPlaceHolder.setAttribute('tabindex', '-1');
      mapPlaceHolder.setAttribute('aria-hidden', 'true');
      mapPlaceHolder.id = "map";
      self.map = new google.maps.Map(mapPlaceHolder, {
        zoom: 16,
        center: {
          lat: restaurant.latlng.lat,
          lng: restaurant.latlng.lng
        },
        streetViewControl: false,
        zoomControl: true,
        fullscreenControl: true,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
      })
      document.getElementById('map-container').appendChild(mapPlaceHolder);
      self.map.addListener('tilesloaded', function () {
          mapLoader.classList.toggle('hidden');
      });
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      fillBreadcrumb();
    })
    .then(Launch.lazyLoading)
    .catch(error => console.error(error));
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = () => {
  if (self.restaurant) { // restaurant already fetched!
    console.log('- Restaurant already fetch');
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    return console.error('No restaurant id in URL');
  }
  return Promise.all([DBHelper.fetchRestaurantById(id), DBHelper.fetchRestaurantReviews(id)])
    .then(results => {
      self.reviews = results[1] && results[1].reverse();
      return self.restaurant = results[0];
    })
    .then(fillRestaurantHTML)
    .catch(error => console.error(error));
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', `located at ${restaurant.address}`);
  
  const figure = document.getElementsByTagName('figure')[0];
  const figcaption = document.getElementsByTagName('figcaption')[0];
  const picture = document.createElement('picture');
  
  const sourceWebp = document.createElement('source');
  sourceWebp.dataset.srcset = `${DBHelper.imageWebpUrlForRestaurant(restaurant)}-large_x1.webp 1x, ${DBHelper.imageWebpUrlForRestaurant(restaurant)}-large_x2.webp 2x`;
  sourceWebp.srcset = 'assets/img/svg/puff.svg';
  sourceWebp.className = 'lazy';
  sourceWebp.media = '(min-width: 1000px)';
  sourceWebp.type = 'image/webp';
  const source = document.createElement('source');
  source.dataset.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-large_x1.jpg 1x, ${DBHelper.imageUrlForRestaurant(restaurant)}-large_x2.jpg 2x`;
  source.srcset = 'assets/img/svg/puff.svg';
  source.className = 'lazy';
  source.media = sourceWebp.media;
  source.type = 'image/jpeg';
  
  
  const ndSourceWebp = document.createElement('source');
  ndSourceWebp.dataset.srcset = `${DBHelper.imageWebpUrlForRestaurant(restaurant)}-medium_x1.webp 1x, ${DBHelper.imageWebpUrlForRestaurant(restaurant)}-medium_x2.webp 2x`;
  ndSourceWebp.srcset = 'assets/img/svg/puff.svg';
  ndSourceWebp.className = 'lazy';
  ndSourceWebp.media = '(min-width: 420px)';
  ndSourceWebp.type = 'image/webp';
  const ndSource = document.createElement('source');
  ndSource.dataset.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-medium_x1.jpg 1x, ${DBHelper.imageUrlForRestaurant(restaurant)}-medium_x2.jpg 2x`;
  ndSource.srcset = 'assets/img/svg/puff.svg';
  ndSource.className = 'lazy';
  ndSource.media = ndSourceWebp.media;
  ndSource.type = 'image/jpeg';
  
  const thSourceWebp = document.createElement('source');
  thSourceWebp.dataset.srcset = `${DBHelper.imageWebpUrlForRestaurant(restaurant)}-small_x2.webp 2x, ${DBHelper.imageWebpUrlForRestaurant(restaurant)}-small_x1.webp 1x`;
  thSourceWebp.srcset = 'assets/img/svg/puff.svg';
  thSourceWebp.className = 'lazy';
  thSourceWebp.media = '(min-width: 320px)';
  thSourceWebp.type = 'image/webp';
  const thSource = document.createElement('source');
  thSource.dataset.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-small_x2.jpg 2x, ${DBHelper.imageUrlForRestaurant(restaurant)}-small_x1.jpg 1x`;
  thSource.srcset = 'assets/img/svg/puff.svg';
  thSource.className = 'lazy';
  thSource.media = thSourceWebp.media;
  thSource.type = 'image/jpeg';
  
  const image = document.createElement('img');
  image.className = 'restaurant-img lazy';
  image.dataset.src = `${DBHelper.imageUrlForRestaurant(restaurant)}-large_x1.jpg`;
  image.src = 'assets/img/svg/puff.svg';
  image.setAttribute('sizes', '(max-width: 1100px) 85vw, (min-width: 1101px) 990px');
  image.alt = `${restaurant.name}'s  restaurant`;
  image.type = 'image/jpeg';

  const containerFavorite = document.createElement('button');
  const notFavorite = document.createElement('img');
  const favorite = document.createElement('img');

  containerFavorite.className = 'container--favorite';
  containerFavorite.id = restaurant.id;
  containerFavorite.addEventListener('click',
    () => DBHelper.setFavorite(notFavorite, restaurant));
  notFavorite.src = 'assets/img/svg/not-favorite.svg';
  notFavorite.id = 'not-favorite';
  notFavorite.className = restaurant.is_favorite === 'true' && 'hidden';
  favorite.src = 'assets/img/svg/favorite.svg';
  favorite.id = 'favorite';

  containerFavorite.append(favorite);
  containerFavorite.append(notFavorite);
  
  picture.appendChild(sourceWebp);
  picture.appendChild(source);
  picture.appendChild(ndSourceWebp);
  picture.appendChild(ndSource);
  picture.appendChild(thSourceWebp);
  picture.appendChild(thSource);
  picture.appendChild(image);
  figure.insertBefore(picture, figcaption);
  figure.append(containerFavorite);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const labelFoodType = document.createElement('label');
  labelFoodType.innerHTML = `${restaurant.cuisine_type} food`;
  labelFoodType.setAttribute('hidden', 'hidden');
  labelFoodType.id = 'foodType';

  cuisine.parentNode.insertBefore(labelFoodType, cuisine.nextSibling);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
  return restaurant;
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.setAttribute('aria-label', `open on ${key}`);
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.setAttribute('aria-label', `${operatingHours[key]},`);
    row.appendChild(time);
    row.setAttribute('role', 'row');
    hours.appendChild(row);
  }
};


/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    return container.appendChild(noReviews);
  }
  const titleContainer = document.createElement('div');
  const title = document.createElement('h3');
  const addReview = document.createElement('button');
  const addContent = document.createElement('span');
  const deleteContent = document.createElement('span');

  title.innerHTML = 'Reviews';
  addContent.innerHTML = "+";
  deleteContent.innerHTML = "-";
  deleteContent.className = "toggled";
  titleContainer.id = "title-container";

  addReview.addEventListener('click', showForm);
  addReview.appendChild(addContent);
  addReview.appendChild(deleteContent);

  titleContainer.appendChild(title);
  titleContainer.appendChild(addReview);

  container.appendChild(titleContainer);

  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

const showForm = () => {

  const form = document.createElement('form');
  const labelNameInput = document.createElement('label');
  const nameInput = document.createElement('input');
  const ratingFieldset = document.createElement('fieldset');
  const appreciation = ['excellent', 'good', 'ok', 'bad', 'awful'];
  
  form.autocomplete = 'on';

  nameInput.id = 'form-name';
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.placeholder = 'Your name';
  nameInput.minLength = '2';
  nameInput.maxLength = '50';
  nameInput.pattern = '^[a-zA-Z\s]+$';
  nameInput.required = true;

  labelNameInput.setAttribute('for', nameInput.id);
  labelNameInput.className = "visuallyHidden";
  labelNameInput.innerHTML = "Enter your name";
  
  ratingFieldset.className = 'new-rating';

  for (let i = 5; i > 0; i--){

    const starInput = document.createElement('input');
    const starLabel = document.createElement('label');
    
    starInput.type = 'radio';
    starInput.id = `star${i}`;
    starInput.name = 'rating';
    starInput.value = i;
    starInput.class = 'visuallyHidden';
    starInput.required = true;
    starInput.addEventListener('input', Launch.isFormValid);
    
    starLabel.setAttribute('for', `star${i}`);
    starLabel.title = 'It was', appreciation[i - 1];
    

    ratingFieldset.appendChild(starInput);
    ratingFieldset.appendChild(starLabel);
  }
  
  const labelCommentsInput = document.createElement('label');
  const commentsInput = document.createElement('textarea');
  const labelSubmitButton = document.createElement('label');
  const submitButton = document.createElement('input');

  commentsInput.id = 'form-comment';
  commentsInput.name = 'comments';
  commentsInput.type = 'text';
  commentsInput.required = true;
  commentsInput.minLength = 3;
  commentsInput.maxLength = 5000;
  commentsInput.placeholder = 'Your comment';
  commentsInput.addEventListener('keydown', autosize);

  
  labelCommentsInput.setAttribute('for', commentsInput.id);
  labelCommentsInput.className = 'visuallyHidden';
  labelCommentsInput.innerHTML = 'Enter your opinion about this restaurant';

  submitButton.id = 'form-submit';
  submitButton.type = 'submit';
  submitButton.value = 'Save';

  labelSubmitButton.setAttribute('for', submitButton.id);
  labelSubmitButton.className = 'visuallyHidden';

  nameInput.addEventListener('change', Launch.isFormValid);
  commentsInput.addEventListener('input', Launch.isFormValid);

  form.appendChild(labelNameInput);
  form.appendChild(nameInput);
  form.appendChild(ratingFieldset);
  form.appendChild(labelCommentsInput);
  form.appendChild(commentsInput);
  form.appendChild(submitButton);
  form.appendChild(labelSubmitButton);

  form.addEventListener('submit', DBHelper.postReview);

  document.getElementById('title-container').classList.toggle('form-open');
  document.getElementById('title-container').appendChild(form);
  form.classList.toggle('form-toggled');
  setTimeout(() => {
  }, 300)
  document.querySelector('#title-container button').removeEventListener('click', showForm);
  document.querySelector('#title-container button').addEventListener('click', hideForm);
  document.querySelectorAll('#title-container button span').forEach(span => span.classList.toggle('toggled'))
}

const hideForm = () => {
  document.querySelector('#title-container form').classList.toggle('form-toggled');
  document.getElementById('title-container').classList.toggle('form-open');
  setTimeout(() => {
    document.querySelector('#title-container form').remove();
  }, 300)
  document.querySelectorAll('#title-container button span').forEach(span => span.classList.toggle('toggled'))
  document.querySelector('#title-container button').removeEventListener('click', hideForm);
  document.querySelector('#title-container button').addEventListener('click', showForm);
}
/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {

  const li = document.createElement('li');
  const name = document.createElement('p');
  name.className = 'userName';
  name.innerHTML = review.name;
  name.setAttribute('aria-label', `${review.name},`);
  li.appendChild(name);

  const date = document.createElement('p');
  date.className = 'dateReview';
  const convertDate = new Date(review.updatedAt);
  date.innerHTML = convertDate.toDateString();
  date.setAttribute('aria-label', `${date.innerHTML},`);
  li.appendChild(date);

  const rating = document.createElement('p');
  let stars = document.createElement('span');
  rating.className = 'userRating';
  stars.className = 'ratingStars';
  for (let i = 0; i < review.rating; i++) {
    const star = document.createElement('span');
    star.innerHTML += '★';
    star.id = `star${i + 1}`
    stars.appendChild(star);
  }
  stars.setAttribute('aria-label', `${review.rating} stars on 5,`);
  rating.innerHTML = 'Rating: ';
  rating.appendChild(stars);
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.className = 'userComments';
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  li.setAttribute('role', 'listitem');
  li.setAttribute('aria-setsize', self.reviews);
  li.setAttribute('aria-posinset', self.reviews.indexOf(review)+1);
  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = ` ${restaurant.name}`;
  li.className = 'fontawesome-arrow-right';
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
  Launch.fixedOnViewport(document.querySelector('nav'), document.querySelector('#breadcrumb'));
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


function autosize() {
  const el = this;
  document.getElementById('title-container').style.height = 'auto';
  el.style.cssText = 'height:auto; padding:0';
  el.style.cssText = 'height:' + el.scrollHeight + 'px';
}
},{"./dbhelper":1,"./helpers":2}],5:[function(require,module,exports){
'use strict';

(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());

},{}]},{},[4]);