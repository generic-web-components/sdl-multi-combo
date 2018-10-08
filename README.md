# \<sdl-data\>

 This html input & combo wrapper listens to keystrokes on the slot and sends 'input' events to be more compatible with vue.js. 
 Other important functionality for combos includes:
 1.  Given a 'url' it will fetch the data for you (from the server) and insert it into the 'items' array of the combo in the slot.
 2.  If multiselect is specified it will use the combo box in the slot to allow multiple selections and put them
        into pills below the combo input.


## Download from npm using yarn into your node_modules directory
```
$ yarn upgrade
$ yarn add @sdl-web/sdl-combo-wrapper --flat
```

##  Run the es6 version of the Demo (Assuming you installed at SERVER_ROOT using npm)
```
{SERVER_ROOT}/node_modules/@sdl-web/sdl-combo-wrapper/build-demo/es6-bundled/demo/index.html
```

##  Include sdl-data-loader.js to use as stand-alone bundled component 
or 
##  Include sdl-data.js directly if including in a polymer project. 
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">

    <title>sdl-combo-wrapper demo</title>

    <!-- If using in an existing polymer project:  use sdl-srch-bar.js directly-->
    <script type="import" src="@sdl-web/sdl-combo-wrapper/src/components/sdl-data.js"></script> 

    <!-- Now add sdl-data to html section -->
    <sdl-combo-wrapper name="combo1-data" id='combo1-data' url='./data/srch-data.txt'>  
        <vaadin-combo-box name="combo1" item-label-path="name" item-value-path="_id" label="Name"></vaadin-combo-box>
    </sdl-combo-wrapper>


    <!-- Finally, listen for change event -->
    <!-- <script>
        $('document').ready(function(){

          var combo1 = document.querySelector('#combo1-data');
          combo1.addEventListener("sdl-data-ready", function(e) {
            console.log("NAME=",e.detail.name);
            console.log("PAYLOAD",e.detail.payload);
          }, false);

        });
    </script> -->

    </script>
  </body>
</html>

```
