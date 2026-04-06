import { SpreadSheet } from "../spreadSheet";

export class FontWeight extends HTMLElement{
fontFamilies = ["Arial", "Roboto", "Times New Roman"];
    private spreadSheet!:SpreadSheet;

    constructor() {
        super();
    }   

    connectedCallback() {
       this.renderer();
        const select = this.querySelector("#bold") as HTMLSpanElement;
        select?.addEventListener("click", ()=>{
           this.spreadSheet.setFontWeight();
        });
        setTimeout(()=>{
          this.spreadSheet = new SpreadSheet();
          //   clearTimeout(timerId);
        },500);
        
    };
    
    renderer() {
        this.innerHTML = `<button id="bold"><i class="fa-solid fa-bold"></i></button>`;
    }
};

customElements.define('font-weight', FontWeight);