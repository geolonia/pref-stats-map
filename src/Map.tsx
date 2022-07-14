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
const unit = '円';
const attribution = '総務省「2019年全国家計構造調査」';
const colorPalette = [
  '#ffe7ad',
  '#F9B208',
  '#F98404',
  '#FC5404',
];

const style = {
  width: 'calc(100% - 20px)',
  height: 'calc(100% - 20px)',
} as React.CSSProperties;

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
  const [perCentage, setPercentage] = React.useState<any|null>(null);

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
      zoom: 4.8,
      hash: true,
      center: [138.22, 38.91],
      style: mapStyle,
      minZoom: 4,
      maxZoom: 8,
    })

    map.on('load', () => {

      dataSet.forEach((item) => {

        const maxData = dataSet[dataSet.length - 1].data;
        const minData = dataSet[0].data;

        const perCentageData= getPercentage(maxData, minData)
        const fillColor = getColor(item.data, perCentageData);

        setPercentage((perCentageData))

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

      dataSet.forEach((item, index) => {

        let minzoom;

        if (index < dataSet.length - 5) {
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
            "text-field": `${dataSet.length - index}`,
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
  }, [dataSet]);

  return (
    <>
      <fieldset className="checkbox">

        {colorPalette.map((color, index) => {

          if (!perCentage) {
            return <></>;
          }

          let label = '';

          if (index === 0) {
            label = `${perCentage.threeQuarter.toLocaleString()}${unit}以上`;
          } else if (index === 1) {
            label = `${perCentage.half.toLocaleString()}${unit} ~ ${perCentage.threeQuarter.toLocaleString()}${unit}未満`;
          } else if (index === 2) {
            label = `${perCentage.quarter.toLocaleString()}${unit} ~ ${perCentage.half.toLocaleString()}${unit}未満`;
          } else if (index === 3) {
            label = `${perCentage.quarter.toLocaleString()}${unit}未満`;
          }
          
          const reversedColor = colorPalette[colorPalette.length - index - 1];

          return (
            <div key={index}>
              <label><span className="legend-color" style={{ backgroundColor: reversedColor}}></span>{label}</label>
            </div>
          )
        })}

        <div className='attribution'>{attribution}</div>

      </fieldset>
      <div style={style} ref={mapContainer} />
    </>
  );
}

export default Component;