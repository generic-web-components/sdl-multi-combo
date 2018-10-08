import {LitElement, html} from '@polymer/lit-element';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';
import '@polymer/iron-form/iron-form.js';
import 'jquery/dist/jquery.min.js';

/**
 * `sdl-multi-combo`
 * This html input & combo wrapper listens to keystrokes on the slot and sends 'input' events to be more compatible with vue.js. 
 *  Other important functionality for combos includes:
 *  1.  Given a 'url' it will fetch the data for you (from the server) and insert it into the 'items' array of the combo in the slot.
 *  2.  If multiselect is specified it will use the combo box in the slot to allow multiple selections and put them
 *        into pills below the combo input.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class sdlMultiCombo extends LitElement {

  constructor() {
    super();
    var me = this;

    if (typeof this.itemlabel == 'undefined') {
      this.itemlabel = "name";
    }
    if (typeof this.itemvalue == 'undefined') {
      this.itemvalue = "_id";
    }

    this.addEventListener('rendered', async (e) => {

      var slot = this.shadowRoot.querySelector('#default-slot');
      var slotNodes = slot.assignedNodes();
      if (typeof slotNodes == 'undefined' || typeof slotNodes[0] == 'undefined' 
          || typeof slotNodes[0].nodeName == 'undefined') {
            console.log("Nothing put into slot");
      }

      // Create the input field that will be outside the shadow DOM.  
      // This input field will hold the values to be submitted in any form
      var input = document.createElement("input");

      input.name = me.name;
      input.id = me.name;
      input.hidden = true;

      this.appendChild(input);

      this.sendAjax(slotNodes);
    });

    this.addEventListener("change", this.handleChangedEvent, false);
    
  }

  firstUpdated(properties) {
    this.dispatchEvent(new CustomEvent('rendered'));  
  }

  _didRender(props, changedProps, prevProps) {
    this.dispatchEvent(new CustomEvent('rendered'));  
  }

  handleChangedEvent(e) {

    if (e.detail != null && typeof e.detail != 'undefined' && typeof e.detail.value != 'undefined') {
      e.target.value = e.detail.value;
    }

    var me = this;
    var multiInput = this.querySelector('#'+me.name);
    var multiDiv = this.shadowRoot.querySelector('#multi-div');
    var found = 0;
    var foundItem = 0;

    if (multiInput.value.length > 0) {
      var inputArray = multiInput.value.split(",");
    } else {
      var inputArray = [];
    }

    function removeItem(e) {
      var multiInput = me.querySelector('#'+me.name);
      if (multiInput.value.length > 0) {
        var inputArray = multiInput.value.split(",");
      } else {
        var inputArray = [];
      }

      var idx = inputArray.indexOf(e.data.obj[me.itemvalue]);
      if (idx != -1) {
        inputArray.splice(idx,1);
        multiInput.value = inputArray.join(",");
        me.value = multiInput.value;
        e.data.pill.remove();
      }
    }

    found = inputArray.find(function(value) { if (value === e.target.value) {return 1} return 0});
    foundItem = e.target.items.find(function(items) { if (items[me.itemvalue] === e.target.value) {return 1} return 0});
    if (typeof found == 'undefined' && typeof foundItem != 'undefined') {
      inputArray.push(e.target.value);
      var newDiv = document.createElement("div");
      var buttonDiv = document.createElement("div");
      $(buttonDiv).addClass("clear-button");
      $(buttonDiv).text("X");
      $(newDiv).addClass("pill-button inlineText");
      $(newDiv).text(foundItem[me.itemlabel]);
      $(multiDiv).append(newDiv);
      $(newDiv).append(buttonDiv);
      $(buttonDiv).on( "click", {
        obj: foundItem,
        pill: newDiv,
      }, removeItem);
    }
    multiInput.value = inputArray.join(",");
    me.value = multiInput.value;
  }



  
  sendAjax(nodes) {
    var me = this;

    $.ajax({
       type: "GET",
       url: me.url,
       success: function(response){
 
        if (typeof response.payload == 'undefined') {
          var resp = JSON.parse(response);
        } else {
          var resp = response;
        }

        // Add payload to item array of the element in the slot
        if (typeof nodes !== 'undefined') {
          for(var i=0;i<nodes.length;i++) {
            if (typeof nodes[i] !== 'undefined' && 'items' in nodes[i]) {
              nodes[i].items = resp.payload;
              me.items = resp.payload;

              var multiInput = me.querySelector('#'+me.name);
              var inputArray = me.initvalue.split(",");
              for(var i=0; i<inputArray.length; i++) {
                me.dispatchEvent(new CustomEvent('change', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    value: inputArray[i],
                    items: me.items
                  }
                }));   
              }
        
            }
          }
        }

        // Now throw custom event with the relevant response data in it.
        me.dispatchEvent(new CustomEvent('sdl-data-ready', {
          bubbles: true,
          composed: true,
          detail: {
            target: me,
            name: me.name,
            payload: resp.payload
          }
        }));
     }
    });
 }

  static get properties() { 
    return { 
      url: {
        type: String
      },
      name: {
        type: String
      },
      multiselect: {
        type: String
      },
      itemlabel: {
        type: String
      },
      itemvalue: {
        type: String
      },
      initvalue: {
        type: String
      }
    }
  }

  render() {
      return html`
      <style>
        :host {
          display: block;
        }
  
        div.pill-button {
          float: none;
          width: fit-content;
          height: 17px;
          margin: 1px;
          border: 1px solid #B2B2B2;
          border-radius: 8px;
          display: inline-block;
          background-color: #eeeeee;
        }
  
        div.inlineText {
          font-size: 12px;
          float: none;
          width: fit-content;
          margin: 1px;
          padding: 1px;
        }

        div.clear-button {
          cursor: pointer;
          display: inline-grid;
          width: 10px;
          height: 10px;
          align-items: center;
          justify-content: center;
          padding-left: 3px;
        }
      </style>
        <sdl-srch-bar id="sdl-srch-bar" onchangeonly="true">
          <iron-form id="main-form" style="display:inline-grid">
            <slot id="default-slot"></slot>
            <div id="multi-div" style="display:inline-block"></div>
          </iron-form>
        </sdl-srch-bar>
    `;
  }

}

window.customElements.define('sdl-multi-combo', sdlMultiCombo);