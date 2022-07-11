import React from 'react';
import { dataSet, unit } from './data';
declare global {
  interface Window {
    geolonia: any;
  }
}

const style = {
  position: 'absolute',
  width: '100vw',
  height: '100vh',
} as React.CSSProperties;

const mapStyle = {
  "version": 8,
  "sources": {
    "japan": {
      "type": "vector",
      "url": "https://cdn.geolonia.com/tiles/japanese-prefectures.json"
    }
  },
  "glyphs": "https://glyphs.geolonia.com/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#222222"
      }
    },
    {
      "id": "prefs",
      "type": "fill",
      "source": "japan",
      "source-layer": "prefectures",
      "paint": {
        "fill-color": "#333333",
        "fill-outline-color": "#444444"
      }
    },
    {
      id: 'point-pref',
      type: 'circle',
      source: "japan",
      "source-layer": "admins",
      paint: {
        'circle-radius': 4,
        'circle-color': 'rgba(255, 255, 255, 0.6)',
      },
    }
  ],
}

const Component = () => {
  const mapContainer = React.useRef(null);

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      zoom: 7,
      hash: true,
      center: [135.53, 34.454],
      pitch: 30,
      style: mapStyle,
    })

    map.on('load', () => {

      // データの小さい順に並び替え
      dataSet.sort((a, b) => {
        if (a.data > b.data) {
          return 1
        }
        if (a.data < b.data) {
          return -1
        }
        return 0
      })

      dataSet.forEach((item) => {
        map.addLayer({
          "id": item.id,
          "type": "fill-extrusion",
          "source": "japan",
          "source-layer": "prefectures",
          "filter": [
            "==",
            "name",
            item.name
          ],
          "paint": {
            "fill-extrusion-color": item.color,
            "fill-extrusion-height": item.data / 500,
            "fill-extrusion-opacity": 0.9
          }
        }, 'point-pref')
      })

      dataSet.forEach((item) => {
        map.addLayer({
          "id": `symbol-${item.id}`,
          "type": "symbol",
          source: "japan",
          "source-layer": "admins",
          minzoom: 6,
          "filter": [
            "==",
            "name",
            item.name
          ],
          "layout": {
            "text-font": [
              "Noto Sans Regular"
            ],
            "text-field": `{name:en}\n${item.data.toLocaleString()}${unit}`,
            "text-size": 16,
            'text-variable-anchor': ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
            'text-radial-offset': 0.5,
            'text-line-height': 1.5,
            'text-justify': 'auto',
          },
          "paint": {
            "text-color": "#FFFFFF",
            "text-halo-width": 1,
            "text-halo-color": "#555555"
          }
        }, 'point-pref')
      })
    })

  });

  return (
    <>
      <div style={style} ref={mapContainer} />
    </>
  );
}

export default Component;