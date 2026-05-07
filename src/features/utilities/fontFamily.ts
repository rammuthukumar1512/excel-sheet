import { SpreadSheet } from "../spreadSheet";


export class FontFamily extends HTMLElement {
    fontFamilies = ["Arial", "Roboto", "Times New Roman"];
    private spreadSheet!:SpreadSheet;

    constructor() {
        super();
    }   

    connectedCallback() {
       this.renderer();
        this.spreadSheet = SpreadSheet.instance;
        const select = this.querySelector("#fontFamily") as HTMLSelectElement;
        select?.addEventListener("change", (e: Event)=>{
            const selElement = e.currentTarget as HTMLSelectElement;
            const selectedFont = selElement.options[selElement.selectedIndex].value;
            this.spreadSheet.applyStyleToSelection("font-family", selectedFont);
        });
        
    };
    
    renderer() {
        this.innerHTML = `<select id="fontFamily" name="font">
            ${ this.fontFamilies.map((value: string, index: number)=>{
                return `<option value=${value}>${value}</option>`;
            }).join("") }
        </select>`;
    }
};

customElements.define('font-family', FontFamily);