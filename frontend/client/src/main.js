import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUser, faLock, faEnvelope, faEye, faEyeSlash, 
  faTachometerAlt, faProjectDiagram, faTasks, faCalendarAlt,
  faCog, faSignOutAlt, faSearch, faBell, faChevronLeft,
  faChevronRight, faCheck, faTimes, faDesktop, faMobile,
  faTabletAlt, faCheckCircle, faComment, faChartLine, faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add icons to the library
library.add(
  faUser, faLock, faEnvelope, faEye, faEyeSlash, 
  faTachometerAlt, faProjectDiagram, faTasks, faCalendarAlt,
  faCog, faSignOutAlt, faSearch, faBell, faChevronLeft,
  faChevronRight, faCheck, faTimes, faDesktop, faMobile,
  faTabletAlt, faCheckCircle, faComment, faChartLine, faUsers
);

// Configure axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';
axios.defaults.withCredentials = true;

// Create Vue app
const app = createApp(App);

// Register global components
app.component('font-awesome-icon', FontAwesomeIcon);

// Use plugins
app.use(store);
app.use(router);

// Mount app
app.mount('#app'); 