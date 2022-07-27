export const mapStyle = {
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
        "fill-color": "#F3F3F3",
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
