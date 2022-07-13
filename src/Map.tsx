import React from 'react';
import { parse } from 'csv-parse/browser/esm/sync';

declare global {
  interface Window {
    geolonia: any;
  }
}

type dataType = {
  name: string,
  data: number,
}

const googleCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTrkzYm-Z3dD7erHNV_N7-EbAXJh1MdnBeajgWx2R4mHbxqwp8vzIwk6UFRm50Z_GaIovARIGwodU/pub?output=csv'

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

const colorPalette = [
  '#ffe7ad',
  '#F9B208',
  '#F98404',
  '#FC5404',
]

// get max and min and 75% and 50%, and 25%
const getPercentage = (max: number, min: number) => {
  const diff = max - min;
  const quarter = diff / 4;
  const half = diff / 2;
  const threeQuarter = 3 * quarter;
  return {
    min,
    quarter: min + quarter,
    half: min + half,
    threeQuarter: min + threeQuarter,
    max,
  }
}

const getColor = (data: number, { min, quarter, half, threeQuarter, max }: any) => {

  if (data < quarter) {
    return colorPalette[0];
  }
  if (data < half) {
    return colorPalette[1];
  }
  if (data < threeQuarter) {
    return colorPalette[2];
  }
  
  return colorPalette[3];
}

const Component = () => {

  const mapContainer = React.useRef(null);
  const [dataSet, setDataSet] = React.useState<Array<dataType>|null>(null);

  React.useEffect(() => {

    fetch(`${googleCsvUrl}&timestamp=${Date.now()}`)
      .then(response => response.text())
      .then(text => {
        let records = parse(text, {
          columns: true,
        });

        records = Object.entries(records[0]).map(([key, value]) => {
          return {
            name: key,
            // @ts-ignore
            data: parseInt(value.replace(/,/g, '')),
          }
        })

        // データの小さい順に並び替え
        // @ts-ignore
        records.sort((a, b) => {

          if (a.data > b.data) {
            return 1
          }
          if (a.data < b.data) {
            return -1
          }
          return 0
        })

        setDataSet(records);

      })

  }, []);

  React.useEffect(() => {

    if (!dataSet) {
      return;
    }

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      zoom: 7,
      hash: true,
      center: [135.53, 34.454],
      style: mapStyle,
    })

    map.on('load', () => {

      dataSet.forEach((item) => {

        const maxData = dataSet[dataSet.length - 1].data;
        const minData = dataSet[0].data;

        const { min, quarter, half, threeQuarter, max } = getPercentage(maxData, minData)
        console.log(min, quarter, half, threeQuarter, max)
        const fillColor = getColor(item.data, { min, quarter, half, threeQuarter, max });

        console.log(fillColor)

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
            "line-color": '#ffffff',
          }
        }, 'point-pref')

      })

      dataSet.forEach((item) => {
        map.addLayer({
          "id": `symbol-${item.name}`,
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
            "text-field": `{name:en}\n${item.data.toLocaleString()}`,
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
  }, [dataSet]);

  return (
    <>
      <div style={style} ref={mapContainer} />
    </>
  );
}

export default Component;