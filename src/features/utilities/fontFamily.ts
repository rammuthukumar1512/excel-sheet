import type { SpreadSheet } from "../spreadSheet";


export class FontFamily extends HTMLElement {
    fontFamilies = ["Arial", "Roboto", "Times New Roman"];
    private spreadSheet: SpreadSheet;

    constructor(sheet: SpreadSheet) {
        super();
        this.spreadSheet = sheet;
    }

    connectedCallback() {
       this.renderer();
        const select = this.querySelector("#fontFamily") as HTMLSelectElement;
        select?.addEventListener("change", (e: Event)=>{
             const selElement = e.currentTarget as HTMLSelectElement;
             const selectedFont = selElement.options[selElement.selectedIndex].value;
             this.spreadSheet.setFontFamily(selectedFont);
        });
        
    }
    
    renderer() {
        this.innerHTML = `<select id="fontFamily" name="font">
            ${ this.fontFamilies.map((value: string, index: number)=>{
                return `<option value=${value}>${value}</option>`;
            }).join("") }
        </select>`;
    }
};

customElements.define('font-family', FontFamily);