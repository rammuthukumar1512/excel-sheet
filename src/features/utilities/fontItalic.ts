import { SpreadSheet } from "../spreadSheet";

export class FontItalic extends HTMLElement {
    private spreadSheet!:SpreadSheet;
    constructor() {
      super();
    }   
    
        connectedCallback() {
           this.renderer();
           this.spreadSheet = SpreadSheet.instance;
            const select = this.querySelector("#italic") as HTMLSpanElement;
            select?.addEventListener("click", ()=>{
              console.log(this.spreadSheet.selectedCell,"sheet")
              this.spreadSheet.applyStyleToSelection("font-style", "italic");
            });
        };
        
        renderer() {
            this.innerHTML = `<button id="italic"><i class="fa-solid fa-italic"></i></button>`;
        };
}

customElements.define("font-italic", FontItalic);