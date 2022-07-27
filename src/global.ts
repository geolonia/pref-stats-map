import config from './config.json'

export type PrefData = {
  name: string,
  data: number,
}

export type colorPaletteType = Array<string>;

export const unit = config ? config['unit'] : '';

export const colorPalette: colorPaletteType = [
  config && config['color1'] ? config['color1'] : '#FC5404',
  config && config['color2'] ? config['color2'] : '#F98404',
  config && config['color3'] ? config['color3'] : '#F9B208',
  config && config['color4'] ? config['color4'] : '#FFE7AD',
];

export const attributionText = config ? config['attribution'] : '';
export const attributionUrl = config ? config['attribution_url'] : '';
