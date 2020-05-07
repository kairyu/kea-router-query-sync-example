import {Header, Icon, Input} from 'semantic-ui-react'
import {kea, useActions, useValues} from 'kea'
import React from 'react'
import styled from '@emotion/styled'

import PropTypes from 'prop-types'

const logic = kea({
  actions: () => ({
    setText: text => ({text}),
    resetText: true,
    setHello: text => ({text}),
  }),

  reducers: ({actions, defaults, cache}) => ({
    text: ['World', PropTypes.string, {
      [actions.setText]: (_, payload) => payload.text,
      [actions.resetText]: () => defaults.text,
    }],
    hello: ['World', PropTypes.string, {persist: true}, {
      [actions.setHello]: (_, payload) => payload.text,
      [actions.resetText]: () => defaults.text,
    }],
  }),

  urlQuerySync: ({key, selectors, defaults, cache, actions}) => ({
    hello: {
      path: '/input',
      selector: selectors.hello,
      defaultValue: defaults.text,
      action: actions.setText,
      resetAction: actions.resetText,
    },
  }),

  events: ({actions, values}) => ({
    afterMount: () => {
      actions.setText(values.hello)
    },
  }),

  listeners: ({actions}) => ({
    [actions.setText]: async ({text}, breakpoint) => {
      await breakpoint(300)
      actions.setHello(text)
    },
  }),
})

const Container = styled.div`
  width: 100%;
  height: 100%;
  display:inline-block;
  justify-content: center;
  align-items: center;
  display: flex;

  > div {
    margin-bottom: 1rem;
    text-align: center;
  }

  h1 span {
    text-decoration: underline;
  }
`

export default function InputView() {
  const {text} = useValues(logic)
  const {setText, resetText} = useActions(logic)
  return (
    <Container>
      <div>
        <Header as='h1'>Hello <span>{text}</span>!</Header>
        <Input
          placeholder='Input...'
          icon={<Icon name='undo' link onClick={e => resetText()} />}
          value={text}
          onChange={(e, data) => setText(data.value)}
        />
      </div>
    </Container>
  )
}
