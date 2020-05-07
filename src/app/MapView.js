import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import {kea, useActions, useValues} from 'kea'
import React from 'react'
import styled from '@emotion/styled'

import PropTypes from 'prop-types'

const logic = kea({
  actions: () => ({
    setViewport: viewport => ({viewport}),
    moveViewport: viewport => ({viewport}),
    resetViewport: true,
    setPosition: position => ({position}),
    resetPosition: true,
  }),

  reducers: ({actions, cache}) => ({
    viewport: [null, PropTypes.object, {persist: true, immer: true}, {
      [actions.setViewport]: (_, payload) => payload.viewport,
      [actions.moveViewport]: (_, payload) => payload.viewport,
      [actions.resetViewport]: () => cache.localStorageDefaults.viewport,
    }],
    position: [null, PropTypes.array, {persist: true}, {
      [actions.setPosition]: (_, payload) => payload.position,
      [actions.resetPosition]: () => cache.localStorageDefaults.position,
    }],
  }),

  defaults: ({selectors}) => ({
    viewport: {
      center: [36.575, 135.984],
      zoom: 5,
    },
    position: [35.68, 139.76],
  }),

  urlQuerySync: ({key, selectors, defaults, cache, actions}) => ({
    viewport: {
      path: '/map',
      selector: selectors.viewport,
      defaultValue: cache.localStorageDefaults.viewport,
      push: true,
      action: actions.setViewport,
      resetAction: actions.resetViewport,
      valueToString: value => {
        const {center: [lat, lng], zoom} = value
        return [lat, lng, zoom].join(',')
      },
      stringToArguments: string => {
        const [lat, lng, zoom] = string.split(',').map(Number)
        return [{center: [lat, lng], zoom}]
      },
    },
    position: {
      path: '/map',
      selector: selectors.position,
      defaultValue: cache.localStorageDefaults.position,
      push: true,
      action: actions.setPosition,
      resetAction: actions.resetPosition,
      valueToString: value => value.join(','),
      stringToArguments: string => [string.split(',').map(Number)],
    },
  }),
})

const Container = styled.div`
  width: 100%;
  height: 100%;

  .leaflet-container {
    height: 100%;
  }
`

export default function MapView() {
  const {viewport, position} = useValues(logic)
  const {moveViewport, setPosition} = useActions(logic)
  const [lat, lng] = position
  return (
    <Container>
      <Map
        viewport={viewport}
        onViewportChanged={viewport => moveViewport(viewport)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy <a href=&quothttp://osm.org/copyright&quot>OpenStreetMap</a> contributors"
        />
        <Marker
          draggable={true}
          position={position}
          onDragend={e => {
            const {lat, lng} = e.target._latlng
            setPosition([lat, lng])
          }}
        >
          <Popup>{`${lat.toFixed(4)}, ${lng.toFixed(4)}`}</Popup>
        </Marker>
      </Map>
    </Container>
  )
}
