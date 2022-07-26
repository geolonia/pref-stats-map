import React from 'react';
import { PrefData } from './App';
import TitleControl from './TitleControl';
import LegendControl from './LegendControl';
// You can see config.json after running `npm start` or `npm run build`
import config from './config.json'
import './Map.css';

declare global {
  interface Window {
    geolonia: any;
  }
}

type Props = {
  prefData: PrefData[] | null;
};

type colorPaletteType = Array<string>;

export const colorPalette: colorPaletteType = [
  config && config['color1'] ? config['color1'] : '#FC5404',
  config && config['color2'] ? config['color2'] : '#F98404',
  config && config['color3'] ? config['color3'] : '#F9B208',
  config && config['color4'] ? config['color4'] : '#FFE7AD',
];

const mapStyle = {
  "version": 8,
  "sources": {
    "japan": {
      "type": "vector",
      "url": "https://cdn.geolonia.com/tiles/japanese-prefectures.json"
    },
    "pref-capital": {
      "type": "geojson",
      "data": "https://cdn.geolonia.com/japanese-prefs/v1.geojson"
    }
  },
  "glyphs": "https://glyphs.geolonia.com/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#F3F3F3"
      }
    },
    {
      "id": "prefs-blur",
      "type": "line",
      "source": "japan",
      "source-layer": "prefectures",
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "line-round-limit": 1
      },
      "paint": {
        "line-color": "#333333",
        "line-blur": 5,
        "line-width": [
          "interpolate", ["linear"], ["zoom"],
          4, 0,
          8, 6
        ],
        "line-opacity": 0.5,
        "line-translate": [0, 1],
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
      source: "pref-capital",
      paint: {
        'circle-radius': 4,
        'circle-color': 'rgba(255, 255, 255, 0.6)',
      },
    }
  ],
}

// get max and min and 75% and 50%, and 25%
const getPercentage = (max: number, min: number) => {
  const diff = max - min;
  const quarter = diff / 4;
  const half = diff / 2;
  const threeQuarter = 3 * quarter;
  return {
    min: Math.round(min),
    quarter: Math.round(min + quarter),
    half: Math.round(min + half),
    threeQuarter: Math.round(min + threeQuarter),
    max: Math.round(max),
  }
}

const getColor = (data: number, { min, quarter, half, threeQuarter, max }: any, colorPalette: Array<string>) => {

  if (data < quarter) {
    return colorPalette[3];
  }
  if (data < half) {
    return colorPalette[2];
  }
  if (data < threeQuarter) {
    return colorPalette[1];
  }

  return colorPalette[0];
}

const Component = (props: Props) => {

  const { prefData } = props;
  const unit = config ? config['unit'] : '';

  const mapContainer = React.useRef(null);

  React.useEffect(() => {

    if (!prefData) {
      return;
    }

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      zoom: 4.8,
      hash: true,
      center: [138.22, 38.91],
      style: mapStyle,
      minZoom: 4,
      maxZoom: 8,
    })

    map.on('load', () => {

      const maxData = prefData[prefData.length - 1].data;
      const minData = prefData[0].data;

      const perCentageData= getPercentage(maxData, minData)

      const titleControl = new TitleControl();
      map.addControl(titleControl, 'top-left');

      const legendControl = new LegendControl(perCentageData);
      map.addControl(legendControl, 'bottom-right');

      prefData.forEach((item) => {

        const fillColor = getColor(item.data, perCentageData, colorPalette);

        map.addLayer({
          "id": `fill-${item.name}`,
          "type": "fill",
          "source": "japan",
          "source-layer": "prefectures",
          "filter": [
            "==",
            "name",
            item.name
          ],
          "paint": {
            "fill-color": fillColor,
          }
        }, 'point-pref')

        map.addLayer({
          "id": `line-${item.name}`,
          "type": "line",
          "source": "japan",
          "source-layer": "prefectures",
          "filter": [
            "==",
            "name",
            item.name
          ],
          "paint": {
            "line-color": '#555555',
          }
        }, 'point-pref')

      })

      prefData.forEach((item, index) => {

        let minzoom;

        if (index < prefData.length - 5) {
          minzoom = 7;
        } else {
          minzoom = 4;
        }

        map.addLayer({
          "id": `circle-${item.name}`,
          "type": "circle",
          source: "pref-capital",
          minzoom,
          "filter": [
            "==",
            "name",
            item.name
          ],
          "paint": {
            'circle-stroke-width': 1.5,
            'circle-stroke-color': 'rgba(255, 255, 255, 1)',
            'circle-radius': 20,
            'circle-color': 'rgba(255, 0, 0, 1)',
          },
        })

        map.addLayer({
          "id": `label-${item.name}`,
          "type": "symbol",
          source: "pref-capital",
          minzoom,
          "filter": [
            "==",
            "name",
            item.name
          ],
          "layout": {
            "text-allow-overlap": true,
            "text-font": [
              "Noto Sans CJK JP Bold"
            ],
            "text-field": `${prefData.length - index}`,
          },
          "paint": {
            "text-color": "#FFFFFF",
          }
        })

        map.addLayer({
          "id": `symbol-${item.name}`,
          "type": "symbol",
          source: "pref-capital",
          minzoom,
          "filter": [
            "==",
            "name",
            item.name
          ],
          "layout": {
            "text-font": [
              "Noto Sans Regular"
            ],
            "text-field": `{name:ja}\n${item.data.toLocaleString()}${unit}`,
            "text-size": 16,
            'text-variable-anchor': ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
            'text-radial-offset': 1.5,
            'text-line-height': 1.5,
            'text-justify': 'auto',
          },
          "paint": {
            "text-color": "#555555",
            "text-halo-width": 1.5,
            "text-halo-color": "#FFFFFF"
          }
        })
      })

    })
  }, [prefData, unit]);

  return (
    <>
      <div id="map" ref={mapContainer} />
    </>
  );
}

export default Component;
