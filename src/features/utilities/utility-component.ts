import utilitycomponent from './utilities.html?raw';

export class UtilityComponent extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
       this.innerHTML = `
       ${utilitycomponent}`;
    }
}

customElements.define('utilities-component', UtilityComponent)