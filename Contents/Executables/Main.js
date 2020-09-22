/*
 React Studio wrapper for the 'react-tsparticles' npm package.

 - 2020 / Nitin Khanna / @nitinthewiz / automedia.ai
 */


// -- plugin info requested by host app --

this.describePlugin = function(id, lang) {
  switch (id) {
    case 'displayName':
      return "tsparticles";

    case 'shortDisplayText':
      return "tsparticles!";

    case 'defaultNameForNewInstance':
      return "tsparticles";
  }
}


// -- private variables --

this._data = {
  declarative: ""
};


// -- persistence, i.e. saving and loading --

this.persist = function() {
  return this._data;
}

this.unpersist = function(data) {  
	this._data = data;
}


// -- inspector UI --

this.inspectorUIDefinition = [
  {
    "type": "label",
    "text": "Paste the tsParticles config JSON below.\nDimensions come from React Studio canvas",
    "height": 40,
  },
  {
    "type": "textinput",
    "id": "declarative",
    "label": "JSON Declaration",
    "actionBinding": "this.onUIChange",
    "multiline": true,
    "height": 600
  }
];

this._uiTextFields = [ 'declarative' ];
this._uiCheckboxes = [];
this._uiNumberFields = [];
this._uiColorPickers = [];
this._uiComponentPickers = [];

this._accessorForDataKey = function(key) {
  if (this._uiTextFields.includes(key)) return 'text';
  else if (this._uiCheckboxes.includes(key)) return 'checked';
  else if (this._uiNumberFields.includes(key)) return 'numberValue';
  else if (this._uiColorPickers.includes(key)) return 'rgbaArrayValue';
  else if (this._uiComponentPickers.includes(key)) return 'componentName';
  return null;
}

this.onCreateUI = function() {
  var ui = this.getUI();
  for (var controlId in this._data) {
    var prop = this._accessorForDataKey(controlId);
    if (prop) {
      try {
      	ui.getChildById(controlId)[prop] = this._data[controlId];
      } catch (e) {
        console.log("** can't set ui value for key "+controlId+", prop "+prop);
      }
    }
  }
}

this.onUIChange = function(controlId) {
  var ui = this.getUI();
  var prop = this._accessorForDataKey(controlId);
  if (prop) {
    this._data[controlId] = ui.getChildById(controlId)[prop];
  } else {
    console.log("** no data property found for controlId "+controlId);
  }
}


// -- plugin preview --

this.renderIcon = function(canvas) {
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  ctx.save();
  if (this.icon == null) {
    // got the Particles logo online
    var path = Plugin.getPathForResource("particles_logo.png");
    this.icon = Plugin.loadImage(path);
  }
  var iconW = this.icon.width;
  var iconH = this.icon.height;
  var aspectScale = Math.min(w/iconW, h/iconH);
  var scale = 0.9 * aspectScale; // add some margin around icon
  iconW *= scale;
  iconH *= scale;
  ctx.drawImage(this.icon, (w-iconW)*0.5, (h-iconH)*0.5, iconW, iconH);
  ctx.restore();
};

this.renderEditingCanvasPreview = function(canvas, controller) {
  this._renderPreview(canvas, controller);
}

this._renderPreview = function(canvas, controller) {
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  ctx.save();

  if (this.icon == null) {
    var path = Plugin.getPathForResource("particles_logo.png");
    this.icon = Plugin.loadImage(path);
  }
  var iconW = this.icon.width;
  var iconH = this.icon.height;
  var aspectScale = Math.min(w/iconW, h/iconH);
  var scale = 0.9 * aspectScale; // add some margin around icon
  iconW *= scale;
  iconH *= scale;
  ctx.drawImage(this.icon, (w-iconW)*0.5, (h-iconH)*0.5, iconW, iconH);
  ctx.restore();
  
}


// -- code generation, React web --

this.getReactWebPackages = function() {
  // Return dependencies that need to be included in the exported project's package.json file.
  // Each key is an npm package name that must be imported, and the value is the package version.
  // 
  // Example:
  //    return { "somepackage": "^1.2.3" }
  
  return {
    "react-tsparticles": "^1.17.10"
  };
}

this.getReactWebImports = function(exporter) {
	var arr = [
    { varName: "Particles", path: "react-tsparticles" }
  ];
	
	return arr;
}

this.writesCustomReactWebComponent = false;

this.getReactWebJSXCode = function(exporter) {  
  var json_declaration = this._data.declarative;
  
  var jsx = `<Particles id="tsparticles" options={${JSON.parse(json_declaration)}} />`;

  return jsx;
}

