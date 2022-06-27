import React from 'react';
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

const geojson = 'https://gist.githubusercontent.com/miya0001/22a435f6e3a11ce577655e604566edb9/raw/c7114195ed62f08f32f00bd900c7d233522396a9/sample.geojson'

const Component = () => {
  const mapContainer = React.useRef(null);

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      zoom: 10,
      hash: true,
      style: "geolonia/basic",
    })

    map.on('load', () => {

      const ss = new window.geolonia.simpleStyle(geojson, {
        id: 'fire',
      })
  
      ss.addTo(map).fitBounds()

    })
    
  });

  return (
    <>
      <div style={style} ref={mapContainer}>
        Hello world!
      </div>
    </>
  );
}

export default Component;