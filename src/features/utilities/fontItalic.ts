import { SpreadSheet } from "../spreadSheet";

export class FontItalic extends HTMLElement {
    private spreadSheet!:SpreadSheet;
    constructor() {
      super();
    }   
    
        connectedCallback() {
           this.renderer();
            const select = this.querySelector("#bold") as HTMLSpanElement;
            select?.addEventListener("click", ()=>{
              //  this.spreadSheet.setFontItalic();
              this.spreadSheet.applyStyleToSelection("font-style", "italic");
            });
            setTimeout(()=>{
              this.spreadSheet = new SpreadSheet();
            },500);
            
        };
        
        renderer() {
            this.innerHTML = `<button id="bold"><i class="fa-solid fa-italic"></i></button>`;
        }
}

customElements.define("font-italic", FontItalic);