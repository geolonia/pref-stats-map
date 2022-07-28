import './TitleControl.css';
import { colorPalette, unit, attributionText, attributionUrl } from './global';
import './LegendControl.css';


class LegendControl {

  map: any;
  container: HTMLDivElement | undefined;
  perCentage: any;

  constructor(perCentage: any) {
    this.perCentage = perCentage;
  }

  mobileClass(){

    if (!this.container) {
      return;
    }

    if (window.innerWidth < 670) {
      this.container.classList.add('legend-mobile');
    } else {
      this.container.classList.remove('legend-mobile');
    }

  }

  onAdd(map: any){

    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'legend-container maplibregl-compact-show';

    this.mobileClass();

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'checkbox';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'legend-close';
    closeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
    fieldset.appendChild(closeBtn)

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

    const button = document.createElement('button');
    button.className = 'legend-toggle';
    button.innerHTML = '<span class="material-symbols-outlined">open_in_full</span>';

    this.container.appendChild(button);

    window.addEventListener('resize', () => this.mobileClass());

    button.addEventListener('click', () => {

      if (!this.container) {
        return;
      }

      this.container.classList.toggle('maplibregl-compact-show');
    })

    closeBtn.addEventListener('click', () => {

      if (!this.container) {
        return;
      }

      this.container.classList.remove('maplibregl-compact-show');
    })

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


