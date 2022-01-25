#target "illustrator"

var scaleSettings  = {
    '25%': 25.0,
    '50%': 50.0,
    '100%': 100.0,
    '200%': 200.0,
    '400%': 400.0,
}

var progress = {
    total: 0,
    done: 0
}

var title = 'Export Innermost Layers';
var currentDir = (new File($.fileName)).parent;
var doc = app.activeDocument;
var workEnable = false;
var dlg;


// Functions
var savePng24 = function (fileName) {
    var scale = scaleSettings[dlg.scaleList.selection]
    var options = new ExportOptionsPNG24();
    options.antiAliasing = true;
    options.transparency = true;
    options.artBoardClipping = true;
    options.horizontalScale = scale;
    options.verticalScale = scale;
    
    var destFile = new File(dlg.dirText.text + '/' + fileName + '.png');
    doc.exportFile(destFile, ExportType.PNG24, options);
}

var hideLayers = function(layers) {
    for(var i = 0; i < layers.length; i++) {
        layer = layers[i];
	    layer.visible = false;
	    layer.layers.length && hideLayers(layer.layers);
    }
}

var exportInnermostLayers = function (layers, name) {
    progress.total += layers.length;
    for (var i = 0; i < layers.length; i++) {
        if (!workEnable) return;
        progress.done++;
        dlg.progBar.value = progress.done / progress.total * 100;
        layer = layers[i];
        layer.visible = true;
        if(layer.name.match( /^\-/ )){
            continue;
		}
        var n = (name ? name + '_' : '') + layer.name;
        if(layer.layers.length) {
            exportInnermostLayers(layer.layers, n);
        } else if (layer.pageItems.length) {
            dlg.progLabel.text = n + ' (' + progress.done + '/' + progress.total + ')';
            dlg.update();
            savePng24(n);
        }
        layer.visible = false;
    }
}

var makeDialog = function (func) {

    dlg = new Window('dialog', title);
    var row;
    
    // scale row
    row = dlg.add('group', undefined, '');
    row.oreintation = 'row';
    row.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.TOP];

    var scalingLabel = row.add('statictext', undefined, 'Scale:'); 
    scalingLabel.size = [100,20];
    
    var scaleNames = [];
    for(key in scaleSettings){
        scaleNames.push(key)
    }
    dlg.scaleList = row.add('dropdownlist', undefined, scaleNames);
    dlg.scaleList.selection = 2;
    
    // select dir
    row = dlg.add( 'group', undefined, '');
    row.orientation = 'row';
    row.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.TOP];
    
    var dirLabel = row.add('statictext', undefined, 'Output directory:'); 
    dirLabel.size = [ 100,20 ];

    dlg.dirText = row.add('edittext', undefined, this.base_path);
    dlg.dirText.text = currentDir;
    dlg.dirText.size = [ 300,20 ];

    var chooseBtn = row.add('button', undefined, 'Choose ...' );
    chooseBtn.onClick = function () {
        dlg.dirText.text = currentDir.selectDlg('Select export directory...');
    }

    // progress bar
    dlg.progBar = dlg.add( 'progressbar', undefined, 0, 100 );
    dlg.progBar.size = [400, 10];

    dlg.progLabel = dlg.add('statictext', undefined, '' ); 
    dlg.progLabel.size = [400, 20];
    
    // buttons row
    row = dlg.add('group', undefined, ''); 
    row.orientation = 'row'

    var cancelBtn = row.add('button', undefined, 'Cancel', {name:'cancel'});
    cancelBtn.onClick = function () {
        workEnable = false;
        dlg.close();
    };

    var okBtn = row.add('button', undefined, 'Export', {name:'ok'});
    okBtn.onClick = function() { 
        workEnable = true;
        okBtn.enabled = false;
        cancelBtn.text = 'Stop';
        func();
    };

    dlg.center();
    dlg.show();
}


// Main
var main = function() {
    var parts = doc.layers;
    
    makeDialog(function() {
        hideLayers(parts);
        exportInnermostLayers(parts, '');
        dlg.close();
    });
}

main();