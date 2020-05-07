import {Menu} from 'semantic-ui-react'
import {kea, useActions, useValues} from 'kea'
import React from 'react'

import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import MapView from './MapView'
import InputView from './InputView'

const logic = kea({
  actions: () => ({
    setPage: page => ({page}),
    setPageUrl: url => ({url}),
  }),

  reducers: ({actions}) => ({
    page: ['input', PropTypes.string, {
      [actions.setPage]: (_, payload) => payload.page,
    }],
  }),

  actionToUrl: ({actions}) => ({
    [actions.setPageUrl]: payload => `/${payload.url}`,
  }),

  urlToAction: ({actions}) => ({
    '/': () => actions.setPage('input'),
    '/:page': ({page}) => actions.setPage(page),
  }),
})

const items = [{
  key: 'input', name: 'Input',
}, {
  key: 'map', name: 'Map',
}]

const components = {
  input: <InputView />,
  map: <MapView />,
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .menu {
    margin: 0;
  }
`

const Page = styled.div`
  flex-grow: 1;
`

export default function App() {
  const {page} = useValues(logic)
  const {setPageUrl} = useActions(logic)
  const component = components[page] || <div />
  return (
    <Container>
      <Menu pointing secondary>
        {items.map(({key, name}) => (
          <Menu.Item
            key={key}
            name={name}
            active={page === key}
            onClick={e => setPageUrl(key)}
          />
        ))}
      </Menu>
      <Page>
        {component}
      </Page>
    </Container>
  )
}
