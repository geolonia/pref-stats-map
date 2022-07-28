import config from './config.json';

export const mapStyle = {
  "version": 8,
  "sources": {
    "japan": {
      "type": "vector",
      "url": "https://tileserver.geolonia.com/news-japan/tiles.json?key=YOUR-API-KEY",
      "attribution": '<a href="https://geolonia.com/credit/" target="_blank">&copy; Geolonia</a>'
    },
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
        "fill-color": `${config.color4}`,
        "fill-outline-color": "#444444"
      }
    },
    {
      "id": "news-border",
      "type": "line",
      "source": "japan",
      "source-layer": "border",
      "paint": {
        "line-color": `#555555`,
      }
    },
    {
      id: 'point-pref',
      type: 'circle',
      "source": "japan",
      "source-layer": "pref-capital",
      paint: {
        'circle-radius': 4,
        'circle-color': 'rgba(255, 255, 255, 0.6)',
      },
    }
  ],
}
