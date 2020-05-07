import 'semantic-ui-css/semantic.min.css'

import './index.css'

import {Provider} from 'react-redux'
import {resetContext, getContext} from 'kea'
import {routerPlugin} from 'kea-router'
import React from 'react'
import ReactDOM from 'react-dom'
import listenersPlugin from 'kea-listeners'
import localStoragePlugin from 'kea-localstorage'

import App from './app'
import * as serviceWorker from './serviceWorker'

const location = {
  get pathname() {
    return window.location.hash.substring(1).split('?', 1)[0]
  },
  get search() {
    const search = '?' + (window.location.hash.substring(1).split('?', 2)[1] || '')
    return search === '?' ? '' : search
  },
}

const history = {
  pushState(state, title, url) {
    window.history.pushState(state, title, '/#' + url)
  },
  replaceState(state, title, url) {
    window.history.replaceState(state, title, '/#' + url)
  },
}

function fixHash() {
  window.location.href.indexOf('#/') === -1 && history.pushState({}, '', '/')
}

window.addEventListener('popstate', fixHash)
fixHash()

resetContext({
  createStore: {
    paths: ['kea', 'app'],
  },
  plugins: [
    localStoragePlugin,
    listenersPlugin,
    routerPlugin({
      history,
      location,
      queryStringOptions: {
        encode: false,
      },
    }),
  ],
})

ReactDOM.render(
  <Provider store={getContext().store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
