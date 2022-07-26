import React from 'react';
import Map from './Map';
import { parse } from 'csv-parse/browser/esm/sync';
import ReactLoading from 'react-loading';
// You can see config.json after running `npm start` or `npm run build`
import config from './config.json'
import './App.css';

export type PrefData = {
  name: string,
  data: number,
}

export type ConfigData = {
  'title': string;
  'unit': string;
  'attribution': string;
  'color1': string;
  'color2': string;
  'color3': string;
  'color4': string;
}

const formatPref = (records: Array<any>) => {

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

  return records;
}

function App() {

  const [prefData, setPrefData] = React.useState<Array<PrefData>|null>(null);

  React.useEffect(() => {

    const fetchData = async () => {

      const url = `${config.data_url}&timestamp=${Date.now()}`;
      const response = await fetch(url);
      const text = await response.text();

      let records = parse(text, {
        columns: true,
      });

      records = formatPref(records);
      setPrefData(records);

    }

    fetchData();

  }, []);

  return (
    <div className="App">
      {!prefData && !config && <ReactLoading className="loading" type={'bubbles'} height={100} width={100} />}
      {prefData !== null &&
        <Map
          prefData={prefData}
        />
      }
    </div>
  );
}

export default App;
