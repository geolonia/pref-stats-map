import React from 'react';
import TitleControl from './TitleControl';
import LegendControl from './LegendControl';
import { mapStyle } from './mapStyle';
import { unit, colorPalette } from './global';
import { formatPref, getPercentage, getColor } from './utils';
import { parse } from 'csv-parse/browser/esm/sync';
// You can see config.json after running `npm start` or `npm run build`
import config from './config.json'
import './Map.css';

declare global {
  interface Window {
    geolonia: any;
  }
}

const Component = () => {

  const mapContainer = React.useRef(null);

  React.useEffect(() => {

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      zoom: 3.5,
      hash: true,
      center: [137.74, 37.53],
      style: mapStyle,
      minZoom: 3,
      maxZoom: 8,
    })

    map.on('load', async () => {

      const titleControl = new TitleControl();
      map.addControl(titleControl, 'top-left');

      const fetchData = async () => {

        const response = await fetch(config.data_url);
        const text = await response.text();

        let records = parse(text, {
          columns: true,
        });

        return formatPref(records);

      }

      const prefData = await fetchData();

      const maxData = prefData[prefData.length - 1].data;
      const minData = prefData[0].data;

      const perCentageData = getPercentage(maxData, minData)

      const legendControl = new LegendControl(perCentageData);
      map.addControl(legendControl, 'bottom-right');

      prefData.forEach((item, index) => {

        const fillColor = getColor(item.data, perCentageData, colorPalette);

        let minzoom;

        if (index < prefData.length - 5) {
          minzoom = 6;
        } else {
          minzoom = 3;
        }

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

        map.addLayer({
          "id": `circle-${item.name}`,
          "type": "circle",
          "source": "japan",
          "source-layer": "pref-capital",
          minzoom,
          "filter": [
            "==",
            "name",
            item.name
          ],
          "paint": {
            'circle-stroke-width': 1.5,
            'circle-stroke-color': 'rgba(255, 255, 255, 1)',
            'circle-radius': [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              10,
              5,
              20
            ],
            'circle-color': 'rgba(255, 0, 0, 1)',
          },
        })

        map.addLayer({
          "id": `label-${item.name}`,
          "type": "symbol",
          "source": "japan",
          "source-layer": "pref-capital",
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
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              10,
              5,
              16
            ],
          },
          "paint": {
            "text-color": "#FFFFFF",
          }
        })

        map.addLayer({
          "id": `symbol-${item.name}`,
          "type": "symbol",
          "source": "japan",
          "source-layer": "pref-capital",
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
  }, []);

  return (
    <>
      <div id="map" ref={mapContainer} />
    </>
  );
}

export default Component;
