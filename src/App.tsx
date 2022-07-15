import React from 'react';
import Map from './Map';
import { parse } from 'csv-parse/browser/esm/sync';
import ReactLoading from 'react-loading';
import './App.css';

const googleCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTrkzYm-Z3dD7erHNV_N7-EbAXJh1MdnBeajgWx2R4mHbxqwp8vzIwk6UFRm50Z_GaIovARIGwodU/pub?output=csv';
const baseUrl = googleCsvUrl.replace('pub?output=csv', '');

const sheetIdList = [
  {
    'name': 'data',
    'sheetId': '0', //「スポットデータ」のシートID を指定して下さい
  },
  {
    'name': 'settings',
    'sheetId': '1230428952', //「基本データ」のシートID を指定して下さい
  }
]

export type PrefData = {
  name: string,
  data: number,
}

export type ConfigData = {
  'タイトル': string;
  '単位': string;
  '出典': string;
  'カラー1': string;
  'カラー2': string;
  'カラー3': string;
  'カラー4': string;
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

const formatConfig = (records: Array<any>) => {

  let config = {}; 

  Object.entries(records[0]).forEach(([key, value]) => {
    // @ts-ignore
    config[key] = value.replace(/,/g, '');

  })

  return config;
}


function App() {

  const [prefData, setPrefData] = React.useState<Array<PrefData>|null>(null);
  const [config, setConfig] = React.useState<ConfigData|null>(null);

  React.useEffect(() => {

    const fetchData = async () => {

      for (const sheet of sheetIdList) {
        const url = `${baseUrl}pub?gid=${sheet.sheetId}&single=true&output=csv&timestamp=${Date.now()}`;
        const response = await fetch(url);
        const text = await response.text();

        let records = parse(text, {
          columns: true,
        });

        if (sheet.name === 'data') {

          records = formatPref(records);
          setPrefData(records);

        } else {
          records = formatConfig(records);
          setConfig(records);
        }

      }
    }

    fetchData();

  }, []);

  return (
    <div className="App">
      {!prefData && !config && <ReactLoading className="loading" type={'bubbles'} height={100} width={100} />}
      <h1 className='title'>{config !== null && config['タイトル']}</h1>
      {prefData !== null && config !== null &&
        <Map
          prefData={prefData}
          config={config}
        />
      }
    </div>
  );
}

export default App;
