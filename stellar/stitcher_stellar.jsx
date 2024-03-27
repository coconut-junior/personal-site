//August Revision - New Workflow
//2023 Jimmy Blanck
//Updated to support emails
//Updated to automatically name and place assets in correct folder
//Updated to correct image scaling

var scriptPath = File($.fileName).path;
var mainlineFont = 'Marvin';
var adWidth = 1080;
var adHeight = 672;
var margin = 10;
var gSettings = new Object();
var currentSettingsFile = File(scriptPath + '/smartly.ini');

if (currentSettingsFile.exists) {
  currentSettingsFile.open('r');
  gSettings = eval(currentSettingsFile.read());
  adWidth = gSettings.adWidth;
  adHeight = gSettings.adHeight;
  margin = gSettings.margin;
  currentSettingsFile.close();
}

const orientation = {
  landscape: 'landscape',
  portrait: 'portrait',
  square: 'square',
};
const titleStyle = 'item head m8';
var thisDoc = app.activeDocument;
thisDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.pixels;
thisDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.pixels;

var itemIndex = 0;
var start = new Date();
var link_dir = [];
var exportDir = myTrimName(thisDoc.fullName) + '/digital';

var dc5050_links = [];
var dc5100_links = [];
var dc5150_links = [];
var national_links = [];

Array.prototype.exists = function (search) {
  for (var i = 0; i < this.length; i++) if (this[i] == search) return true;
  return false;
};

//backport replaceall function to es3
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'),
      ignore ? 'gi' : 'g'
    ),
    typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2
  );
};

var w = new Window('dialog', 'Create Smartly Ads');
//w.size = { width: 300, height: 200 };
w.alignChildren = 'fill';
var p = w.add('panel');
p.alignChildren = 'fill';
p.orientation = 'column';
var g1 = p.add('group');
var g2 = p.add('group');
var g3 = p.add('group');
var g4 = w.add('group');

g1.orientation = 'row';
g1.alignChildren = 'fill';
g2.orientation = 'row';
g2.alignChildren = 'fill';
g3.orientation = 'row';
g3.alignChildren = 'fill';

var widthLabel = g1.add('statictext', undefined, 'Width');
widthLabel.size = { width: 50, height: 20 };
var widthText = g1.add('edittext', undefined, adWidth);
widthText.size = { width: 50, height: 20 };

var pxLabel1 = g1.add('statictext', undefined, 'px');
var heightLabel = g2.add('statictext', undefined, 'Height');
heightLabel.size = { width: 50, height: 20 };
var heightText = g2.add('edittext', undefined, adHeight);
heightText.size = { width: 50, height: 20 };
var pxLabel2 = g2.add('statictext', undefined, 'px');

var marginLabel = g3.add('statictext', undefined, 'Margin');
marginLabel.size = { width: 50, height: 20 };
var marginText = g3.add('edittext', undefined, margin);
marginText.size = { width: 50, height: 20 };
var pxLabel3 = g3.add('statictext', undefined, 'px');

var okButton = g4.add('button', undefined, 'Start', { name: 'ok' });
var cancelButton = g4.add('button', undefined, 'Cancel', { name: 'cancel' });

okButton.onClick = function () {
  adHeight = parseInt(heightText.text);
  adWidth = parseInt(widthText.text);
  margin = parseInt(marginText.text);
  gSettings.adHeight = adHeight;
  gSettings.adWidth = adWidth;
  gSettings.margin = margin;

  currentSettingsFile.open('w');
  currentSettingsFile.write(gSettings.toSource());
  currentSettingsFile.close();

  w.close(1);
};
cancelButton.onClick = function () {
  w.close();
};

if (w.show() == 1) makeAds();

if (![].includes) {
  Array.prototype.includes = function (searchElement /*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (
        searchElement === currentElement ||
        (searchElement !== searchElement && currentElement !== currentElement)
      ) {
        return true;
      }
      k++;
    }
    return false;
  };
}

function myTrimName(myFileName) {
  var myString = myFileName.toString();
  var myLastSlash = myString.lastIndexOf('/');
  var myPathName = myString.slice(0, myLastSlash);
  return myPathName;
}

//start creating a list of all links by layer

function resetImages(graphics) {
  for (img = 0; img < graphics.length; img++) {
    try {
      var cuts = graphics[img];

      //checks if the image is stretched vertically or horizontally, then unstretches it
      if (cuts.horizontalScale > cuts.verticalScale) {
        cuts.horizontalScale = cuts.verticalScale;
      } else {
        cuts.verticalScale = cuts.horizontalScale;
      }
    } catch (e) {}
  }
}

function makeAds() {
  for (var l = 0; l < thisDoc.layers.length; ++l) {
    var layer = thisDoc.layers[l];
    var all_imgs = layer.allGraphics;
    resetImages(all_imgs);

    for (var i = 0; i < all_imgs.length; ++i) {
      var link;

      if (String(all_imgs[i].itemLink == 'null')) {
        link = 'null';
      } else {
        link = all_imgs[i].itemLink.name;
      }

      switch (layer.name) {
        case '5050':
          dc5050_links.push(link);
          break;
        case '5100':
          dc5100_links.push(link);
          break;
        case '5150':
          dc5150_links.push(link);
          break;
      }
    }
  }

  //sort 5050
  for (var i = 0; i < dc5050_links.length; ++i) {
    var l = dc5050_links[i];
    if (
      dc5100_links.exists(l) &&
      dc5150_links.exists(l) &&
      !national_links.exists(l)
    ) {
      national_links.push(l);
      //remove from both
    }
  }
  //sort 5100
  for (var i = 0; i < dc5100_links.length; ++i) {
    var l = dc5100_links[i];
    if (
      dc5050_links.exists(l) &&
      dc5150_links.exists(l) &&
      !national_links.exists(l)
    ) {
      national_links.push(l);
    }
  }
  //sort 5150
  for (var i = 0; i < dc5150_links.length; ++i) {
    var l = dc5150_links[i];
    if (
      dc5050_links.exists(l) &&
      dc5100_links.exists(l) &&
      !national_links.exists(l)
    ) {
      national_links.push(l);
    }
  }

  //remove national items from versioned lists
  var temp_links = [];
  for (var i = 0; i < dc5050_links.length; ++i) {
    if (!national_links.exists(dc5050_links[i])) {
      temp_links.push(dc5050_links[i]);
    }
  }
  dc5050_links = temp_links;

  temp_links = [];
  for (var i = 0; i < dc5100_links.length; ++i) {
    if (!national_links.exists(dc5100_links[i])) {
      temp_links.push(dc5100_links[i]);
    }
  }
  dc5100_links = temp_links;

  temp_links = [];
  for (var i = 0; i < dc5150_links.length; ++i) {
    if (!national_links.exists(dc5150_links[i])) {
      temp_links.push(dc5150_links[i]);
    }
  }
  dc5150_links = temp_links;

  //add back og national items
  for (var l = 0; l < thisDoc.layers.length; ++l) {
    var layer = thisDoc.layers[l];
    var all_imgs = layer.allGraphics;

    for (var i = 0; i < all_imgs.length; ++i) {
      var link;

      if (String(all_imgs[i].itemLink == 'null')) {
        link = 'null';
      } else {
        link = all_imgs[i].itemLink.name;
      }

      switch (layer.name) {
        case 'cmyk_base':
          national_links.push(link);
      }
    }
  }

  var vFolder = new Folder(exportDir);
  if (!vFolder.exists) {
    vFolder.create();
  }

  var folders = ['5050', '5100', '5150', 'national'];
  for (var i = 0; i < folders.length; ++i) {
    var vFolder = new Folder(exportDir + '/' + folders[i]);
    if (!vFolder.exists) {
      vFolder.create();
    }
  }

  //loop thru layers
  for (var l = 0; l < thisDoc.layers.length; ++l) {
    var layer = thisDoc.layers[l];
    var groups = layer.groups;
    var version = '';

    //create DC folders
    if (
      layer.name == '5050' ||
      layer.name == '5100' ||
      layer.name == '5150' ||
      layer.name == 'cmyk_base'
    ) {
      vFolder = new Folder(exportDir + '/' + layer.name);
      if (layer.name == 'cmyk_base') {
        vFolder = new Folder(exportDir + '/national');
        version = 'national';
      } else {
        version = layer.name;
      }

      if (!vFolder.exists) {
        vFolder.create();
      }

      var products = 0;

      //find groups
      for (var i = 0; i < groups.length; i++) {
        var objects = groups[i].allGraphics; //object pdf and image in here?
        var items = groups[i].allPageItems;
        var isProduct = false;
        var links = new Array();
        var productName = '';

        //identify product block
        for (var g = items.length - 1; g >= 0; g--) {
          if (items[g].constructor.name == 'TextFrame') {
            var text = items[g].texts[0].contents;

            //ChocolateMilk_V19 updated to look for new font
            if (
              text.toLowerCase().match('theirs') ||
              text.match('% off') ||
              text.match('% OFF') ||
              (text.match('$') &&
                items[g].texts[0].position == Position.SUPERSCRIPT) ||
              items[g].texts[0].appliedFont.name.match('ChocolateMilk')
            ) {
              isProduct = true;
              ++products;
            }

            if (
              items[g].texts[0].appliedFont.name.match(mainlineFont) &&
              !text.toLowerCase().match('each')
            ) {
              productName = text.toLowerCase().replaceAll(' ', '_');
            }
          }
        }

        //conditions for creating a new doc
        if (objects.length > 0 && isProduct) {
          createDoc(objects, itemIndex, version, productName);
        }
      }
    }
  }

  var ms = new Date() - start;
  var seconds = ms / 1000;

  alert(
    'Generated ' +
      itemIndex +
      ' ads in ' +
      seconds +
      ' seconds.\n' +
      exportDir.replaceAll('%20', ' ')
  );
}

function getHeight(object) {
  var bounds = object.parent.geometricBounds;
  return bounds[2] - bounds[0];
}

function getWidth(object) {
  var bounds = object.parent.geometricBounds;
  return bounds[3] - bounds[1];
}

function createDoc(objects, index, version, productName) {
  var newDoc = app.documents.add();
  newDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.pixels;
  newDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.pixels;
  newDoc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
  newDoc.pasteboardPreferences.pasteboardMargins = [1000, 1000];
  newDoc.zeroPoint = [0, 0];
  newDoc.pages[0].marginPreferences.properties = {
    top: margin,
    bottom: margin,
    left: margin,
    right: margin,
  };

  with (newDoc.documentPreferences) {
    pageWidth = adWidth;
    pageHeight = adHeight;
    facingPages = false;
    pageOrientation = PageOrientation.landscape;
    pagesPerDocument = 1;
  }

  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].duplicate(newDoc.pages[0]);
  }

  var imgs = newDoc.allGraphics;
  var areas = [];
  var lastIndex = 0;

  //reset rotation
  for (var i = 0; i < imgs.length; ++i) {
    //frame
    try {
      imgs[i].parent.absoluteRotationAngle = 0;
    } catch (e) {}
    //graphic inside frame
    imgs[i].absoluteRotationAngle = 0;
  }

  //if single image, scale up
  if (objects.length == 1) {
    var y1 = margin;
    var x1 = margin;
    var y2 = adHeight - margin;
    var x2 = adWidth - margin;
    imgs[0].parent.geometricBounds = [y1, x1, y2, x2];
    imgs[0].fit(FitOptions.proportionally);
    imgs[0].fit(FitOptions.centerContent);
  }
  //if two images, fit together
  else if (imgs.length == 2) {
    //img1
    var y1 = margin;
    var x1 = margin;
    var y2 = adHeight - margin;
    var x2 = adWidth * (1 / 2) - margin; /*1/3*/
    imgs[0].parent.geometricBounds = [y1, x1, y2, x2];
    imgs[0].fit(FitOptions.proportionally);
    imgs[0].fit(FitOptions.centerContent);
    imgs[0].fit(FitOptions.proportionally);

    //img2
    var y1 = margin;
    var x1 = adWidth * (1 / 2) + margin;
    var y2 = adHeight - margin;
    var x2 = adWidth - margin; /*2/3*/
    imgs[1].parent.geometricBounds = [y1, x1, y2, x2];
    imgs[1].fit(FitOptions.proportionally);
    imgs[1].fit(FitOptions.centerContent);
    imgs[0].fit(FitOptions.proportionally);
  } else if (objects.length > 2) {
    var psds = [];
    ais = [];
    //find product in PSD format
    for (var a = imgs.length - 1; a >= 0; a--) {
      try {
        if (
          imgs[a].itemLink.name.match('.ai') ||
          imgs[a].itemLink.name.match('logo')
        ) {
          lastIndex = a;
          ais.push(imgs[a]);
        } else {
          psds.push(imgs[a]);
        }
      } catch (err) {
        continue;
      }
    }

    for (var i = 0; i <= ais.length - 1; i++) {
      var im = ais[i];
      areas.push(parseInt(getHeight(im) * getWidth(im)));

      //arrange logos along bottom
      var blockWidth = adWidth / ais.length;
      var y1 = adHeight * (3 / 4);
      var x1 = blockWidth * i + margin;
      var y2 = adHeight - margin;
      var x2 = blockWidth * i + blockWidth - margin;
      im.parent.geometricBounds = [y1, x1, y2, x2];
      //center the logos in their frame
      im.fit(FitOptions.proportionally);
      im.fit(FitOptions.centerContent);
    }

    for (var i = 0; i <= psds.length - 1; i++) {
      var blockWidth = adWidth / psds.length;
      var im = psds[i];

      var y1 = margin;
      var x1 = blockWidth * i + margin;
      var y2 = adHeight * (3 / 4);
      var x2 = blockWidth * i + blockWidth - margin;

      im.parent.geometricBounds = [y1, x1, y2, x2];
      im.fit(FitOptions.proportionally);
      im.fit(FitOptions.centerContent);
    }
  }

  var code = '';
  var date = thisDoc.name.split('_')[0] + thisDoc.name.split('_')[1];

  if (date.length == 2) {
    //if date is only 2 digits, make it 3
    date = date.slice(0, 1) + '0' + date.slice(1, 2);
  }

  //if flyer then name sku by page number
  if (thisDoc.name.match('page')) {
    var pageNumber = thisDoc.name.replace('.indd', '').split('_')[4];
    //flyer name incorrect, does not have date
    if (thisDoc.name[0] == 'p') {
      pageNumber = thisDoc.name.replace('.indd', '').split('_')[1];
      var path = thisDoc.filePath.toString().split('/');
      date = path[path.length - 3].split('_');
      var month = date[0];
      var day = date[1];
      date = month + day;
    }
  }

  //start counting from 00 until 09 is reached
  var number = index;
  var add = 0;
  number = index + add;
  if (number < 10) {
    number = '0' + (index + add);
  }

  if (date.length > 3) {
    date = date.slice(0, 3); //1020 becomes 102, etc.
  }

  var linkName = imgs[lastIndex].itemLink.name;
  code = pageNumber + date + number;

  if (productName == '') {
    productName = linkName
      .toLowerCase()
      .replaceAll(' ', '_')
      .replace('.jpg', '')
      .replace('.ai', '')
      .replace('.psd', '')
      .replace('.png', '');
  }

  productName = productName.replace(/[^a-z0-9]+/gi, '_'); //replace all non alphanumeric
  var complete_name = code + '_' + productName;
  if (complete_name.length > 36) {
    complete_name = complete_name.slice(0, 36);
  }

  //name document after product
  newDoc.name = complete_name;
  var folder = exportDir;
  var myExportRes = 72;
  app.jpegExportPreferences.exportResolution = myExportRes;

  ++itemIndex;

  //save doc in case designer wants to make edits

  if (national_links.exists(linkName)) {
    version = 'national';
  } else if (dc5050_links.exists(linkName)) {
    version = '5050';
  } else if (dc5100_links.exists(linkName)) {
    version = '5100';
  } else if (dc5150_links.exists(linkName)) {
    version = '5150';
  }

  //this is an email not flyer
  if (String(pageNumber) == 'undefined') {
    if (version == '5050') {
      complete_name = complete_name.replace('undefined', '2');
    } else if (version == '5100') {
      complete_name = complete_name.replace('undefined', '3');
    } else if (version == '5150') {
      complete_name = complete_name.replace('undefined', '4');
    } else {
      complete_name = complete_name.replace('undefined', '1');
    }
  }

  fileName = new File(folder + '/' + version + '/' + complete_name + '.jpg');

  newDoc.exportFile(ExportFormat.JPG, fileName, false);
  newDoc.close(
    SaveOptions.YES,
    new File(folder + '/' + version + '/' + complete_name + '.indd')
  );
  if (!linkName.match('.ai')) {
    link_dir.push(linkName);
  }
}

function scaleHorz(object, amount) {
  var h = getHeight(object);
  var w = getWidth(object);
  var ratio = w / h;
  resize(object, ratio * amount + ' px', amount + 'px');
}

function scaleVert(object, amount) {
  var h = getHeight(object);
  var w = getWidth(object);
  var ratio = w / h;
  resize(object, amount + ' px', ratio * amount + ' px');
}

function resize(object, height, width) {
  object.resize(
    [
      CoordinateSpaces.PAGE_COORDINATES,
      BoundingBoxLimits.GEOMETRIC_PATH_BOUNDS,
    ],
    AnchorPoint.TOP_CENTER_ANCHOR,
    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
    [UnitValue(width).as('pt'), UnitValue(height).as('pt')]
  );
}

function moveObject(myObject, myAnchorPoint, myX, myY) {
  switch (myAnchorPoint) {
    case 'bottomLeft':
      var myObjectHeight =
        myObject.geometricBounds[2] - myObject.geometricBounds[0];
      myObject.move([myX, myY - myObjectHeight]);
      break;
    case 'bottomRight':
      var myObjectHeight =
        myObject.geometricBounds[2] - myObject.geometricBounds[0];
      var myObjectWidth =
        myObject.geometricBounds[3] - myObject.geometricBounds[1];
      myObject.move([myX + myObjectWidth, myY - myObjectHeight]);
      break;
    case 'topLeft':
      myObject.move([myX, myY]);
      break;
    case 'topRight':
      var myObjectWidth =
        myObject.geometricBounds[3] - myObject.geometricBounds[1];
      myObject.move([myX - myObjectWidth, myY]);
      break;
    case 'bottomCenter':
      break;
    case 'topCenter':
      var myObjectWidth =
        myObject.geometricBounds[3] - myObject.geometricBounds[1];
      myObject.move([myX - myObjectWidth / 2, myY]);
      break;
    case 'center':
      var myObjectHeight =
        myObject.geometricBounds[2] - myObject.geometricBounds[0];
      var myObjectWidth =
        myObject.geometricBounds[3] - myObject.geometricBounds[1];
      myObject.move([myX - myObjectWidth / 2, myY - myObjectHeight / 2]);
      break;
    default:
      break;
  }
}
