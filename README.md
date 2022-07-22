# Pref Stats Map

スプレッドシートに入力した都道府県別のデータを、地図に表示できる テンプレートリポジトリです。

<img width="1206" alt="スクリーンショット 2022-07-22 14 21 46" src="https://user-images.githubusercontent.com/8760841/180374507-727d493b-5ffa-4aeb-8cd8-346068f822dc.png">


## カスタマイズする際の手順

###  自分のリポジトリにコピー

* [Use this template](https://github.com/geolonia/pref-stats-map/generate) をクリック。
* **[Include all branches]** にチェックを入れ、**Public** を選択し、設定が終わったら **「Create repository from template」** を選択します。

<img src="https://user-images.githubusercontent.com/8760841/180371014-ceecc339-b8e7-4138-aadd-2e0d71c22da7.png" width="600px" />

### サイト全体の設定

`config.yml` を書き換えることでサイト全体の設定を変更できます。

設定の例:

```
title: 1世帯あたりの菓子類平均支出額（1ヶ月分）
data_url: https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTrkzYm-Z3dD7erHNV_N7-EbAXJh1MdnBeajgWx2R4mHbxqwp8vzIwk6UFRm50Z_GaIovARIGwodU/pub?gid=0&single=true&output=csv
attribution: 総務省「2019年全国家計構造調査」
attribution_url: https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00200564&tstat=000001139024&stat_infid=000032053504
color1: '#FFE7AD'
color2: '#F9B208'
color3: '#F98404'
color4: '#FC5404'
unit: 円
```

- `title`: サイトのタイトルです。
- `data_url`: アプリで読み込む CSV データまでの　スプレッドシートの URL を記述してください。（URLの取得方法は後述します）
- `attribution`: データの出典名です。
- `attribution_url`: データの出典 URL です。
- `color1`: 塗りの色1です。
- `color2`: 塗りの色2です。
- `color3`: 塗りの色3です。
- `color4`: 塗りの色4です。
- `unit`: データの単位です。

### データについて

以下のスプレッドシートをコピーしてください。

https://docs.google.com/spreadsheets/d/1oh4N7tqZMPKnNfdiDPAvW0eAYp-FW1qWtud_I4dLmlY/edit?usp=sharing

![スクリーンショット 2022-07-22 14 55 26](https://user-images.githubusercontent.com/8760841/180372852-5f62e3cc-4b17-4e89-85cc-7e59bac9a31e.png)

次に共有設定を行ってください。

![スクリーンショット 2022-07-22 14 57 57](https://user-images.githubusercontent.com/8760841/180373503-ac78da6c-f190-468d-8b9d-235017c000ed.png)


![スクリーンショット 2022-07-22 14 58 33](https://user-images.githubusercontent.com/8760841/180373520-f3d73aac-8701-43dc-88ac-642908333f24.png)

URL コピーしてください

![スクリーンショット 2022-07-22 14 58 49](https://user-images.githubusercontent.com/8760841/180373754-ef8444be-74ee-405a-82ed-003a707983f1.png)


コピーした URL を、`config.yml` の `data_url` にセットして、ファイルをコミットして下さい。GitHub に push すると GitHub Actions が実行され、2~3分でデプロイされます。


## 開発者向け

```
git clone https://github.com/geolonia/pref-stats-map.git
cd pref-stats-map
npm install
npm start
```

## その他

- GitHub Pages の利用規約により作成した アプリは商用にはご利用いただけませんのでご注意ください。詳細は以下をご覧ください。
https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages#prohibited-uses
