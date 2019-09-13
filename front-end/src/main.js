import "./styles/normalize.scss";
import "./styles/styles.scss"
import "core-js-pure";

import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from "react-redux";

import Container from "./components/container";
import configStore from "./store/configStore";

const store = configStore();
window.x = store;

const jsx = (
    <Provider store={store}>
        <Container/>
    </Provider>
);

ReactDOM.render(jsx, document.getElementById("root"));