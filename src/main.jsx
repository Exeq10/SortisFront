
import ReactDOM from "react-dom/client";

import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

import { register } from "/serviceWorkerRegistration.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

register()