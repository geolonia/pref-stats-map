import './TitleControl.css';
import config from './config.json'
import { colorPalette } from './Map'
import './LegendControl.css';

const attributionText = config ? config['attribution'] : '';
const attributionUrl = config ? config['attribution_url'] : '';
const unit = config ? config['unit'] : '';

class LegendControl {

  map: any;
  container: HTMLDivElement | undefined;
  perCentage: any;

  constructor(perCentage: any) {
    this.perCentage = perCentage;
  }

  onAdd(map: any){

    this.map = map;

    this.container = document.createElement('div');
    this.container.className = '';
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'checkbox maplibregl-ctrl';

    let legendText = '';

    for (let i = 0; i < colorPalette.length; i++) {

      const color = colorPalette[i]

      if (i === 0) {
        legendText = `${this.perCentage.threeQuarter.toLocaleString()}${unit}以上`;
      } else if (i === 1) {
        legendText = `${this.perCentage.half.toLocaleString()}${unit} ~ ${this.perCentage.threeQuarter.toLocaleString()}${unit}未満`;
      } else if (i === 2) {
        legendText = `${this.perCentage.quarter.toLocaleString()}${unit} ~ ${this.perCentage.half.toLocaleString()}${unit}未満`;
      } else if (i === 3) {
        legendText = `${this.perCentage.quarter.toLocaleString()}${unit}未満`;
      }

      const legend = document.createElement('div');
      legend.innerHTML = `<label><span class="legend-color" style="background-color: ${color}" ></span>${legendText}</label>`;
      fieldset.appendChild(legend);

    }

    const attribution = document.createElement('div');
    attribution.className = 'attribution';
    attribution.innerHTML = `<a href="${attributionUrl}" target="_blank" rel="noopener noreferrer">${attributionText}</a>`;
    fieldset.appendChild(attribution);

    this.container.appendChild(fieldset);

    return this.container;

  }

  onRemove(){

    if (this.container && this.container.parentNode) {

      this.container.parentNode.removeChild(this.container);
      this.container = undefined;

    }

  }
}

export default LegendControl;


