
var resetLayers = function(layers) {
    for(var i = 0; i < layers.length; i++) {
        layer = layers[i];
        layer.visible = true;
        layer.locked = false;
	    layer.layers.length && resetLayers(layer.layers);
    }
}

var findColor = new RGBColor();
findColor.red = 255;
findColor.green = 255;
findColor.blue = 255;

var c1 = new RGBColor();
c1.red = 255;
c1.green = 191;
c1.blue = 102;
var c2 = new RGBColor();
c2.red = 255;
c2.green = 255;
c2.blue = 140;
var c3 = new RGBColor()
c3.red = 204;
c3.green = 255;
c3.blue = 153;
var c4 = new RGBColor()
c4.red = 46;
c4.green = 230;
c4.blue = 199;
var c5 = new RGBColor()
c5.red = 77;
c5.green = 195;
c5.blue = 255;
var c6 = new RGBColor()
c6.red = 192;
c6.green = 128;
c6.blue = 255;
var c7 = new RGBColor()
c7.red = 255;
c7.green = 102;
c7.blue = 153;
var colors = { b: c1, c: c2, d: c3, e: c4, f: c5, g: c6, h:c7 };


var actLayer = activeDocument.activeLayer;
actLayer.visible = true;
actLayer.locked = false;
resetLayers(actLayer.layers)


for (var i = 0; i < actLayer.layers.length; i++) {
  var targetLayer = actLayer.layers[i];

  targetLayer.layers.add();
  var addLayer = targetLayer.layers[0];
  addLayer.name = "a"

  for (var b = targetLayer.pageItems.length - 1; b >= 0; b--) {
    targetLayer.pageItems[b].move(addLayer, ElementPlacement.PLACEATBEGINNING);
  }

  for (key in colors) {
    targetLayer.layers.add();
    var newLayer = targetLayer.layers[0];
    newLayer.name = key;
    for (var o = addLayer.pageItems.length - 1; o >= 0; o--) {
      addLayer.pageItems[o].duplicate(newLayer, ElementPlacement.PLACEATBEGINNING);
    }
    for (var p = newLayer.pageItems.length - 1; p >= 0; p--) {
      var item = newLayer.pageItems[p]
      if (Math.round(item.fillColor.red) == findColor.red &&
        Math.round(item.fillColor.green) == findColor.green &&
        Math.round(item.fillColor.blue) == findColor.blue)
       {
          item.fillColor = colors[key];
       }
    }
  }
}