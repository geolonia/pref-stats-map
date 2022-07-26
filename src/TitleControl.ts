import './TitleControl.css';
import config from './config.json'

class TitleControl {

  map: any;
  container: HTMLDivElement | undefined;

  onAdd(map: any){

    this.map = map;

    this.container = document.createElement('h1');
    this.container.className = 'title';
    this.container.textContent = `${config.title}`;
    return this.container;

  }

  onRemove(){

    if (this.container && this.container.parentNode) {

      this.container.parentNode.removeChild(this.container);
      this.container = undefined;

    }

  }
}

export default TitleControl;
