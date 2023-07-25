//August Revision - New Workflow
//2023 Jimmy Blanck
//Updated to support emails
//Updated to automatically name and place assets in correct folder
//Updated to correct image scaling

Array.prototype.exists = function(search){
	for (var i=0; i<this.length; i++)
	   if (this[i] == search) return true;
	return false;
}

const orientation = {landscape:"landscape",portrait:"portrait",square:"square"};
const titleStyle = "item head m8";
var thisDoc = app.activeDocument;
thisDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.pixels;
thisDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.pixels;
var itemIndex = 0;
var start = new Date();
var link_dir = [];

var dc5050_links = [];
var dc5100_links = [];
var dc5150_links = [];
var national_links = [];

//backport replaceall function to es3
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

//start creating a list of all links by layer

function resetImages(graphics){
    for(img = 0; img < graphics.length; img++){
		try {
			var cuts = graphics[img];

			//checks if the image is stretched vertically or horizontally, then unstretches it
			if (cuts.horizontalScale > cuts.verticalScale){
				cuts.horizontalScale = cuts.verticalScale;
			}else{
				cuts.verticalScale = cuts.horizontalScale;
			}
		}
		catch(e) {}
	}
}

for (var l = 0;l<thisDoc.layers.length;++l) {
	var layer = thisDoc.layers[l];
	var all_imgs = layer.allGraphics;
	resetImages(all_imgs);

	for(var i=0;i<all_imgs.length;++i) {

		var link;
		
		if(String(all_imgs[i].itemLink == "null")){
			link = "null";
		}
		else {
			link = all_imgs[i].itemLink.name;
		}
		

		switch(layer.name){
			case "5050":
				dc5050_links.push(link);
			case "5100":
				dc5100_links.push(link);
			case "5150":
				dc5150_links.push(link);
		}
	}
}

//sort 5050
for (var i=0;i<dc5050_links.length;++i){
	var l = dc5050_links[i]
	if(dc5100_links.exists(l) && dc5150_links.exists(l) && !national_links.exists(l)){
		national_links.push(l);
		//remove from both
	}
}
//sort 5100
for (var i=0;i<dc5100_links.length;++i){
	var l = dc5100_links[i]
	if(dc5050_links.exists(l) && dc5150_links.exists(l) && !national_links.exists(l)){
		national_links.push(l);
	}
}
//sort 5150
for (var i=0;i<dc5150_links.length;++i){
	var l = dc5150_links[i]
	if(dc5050_links.exists(l) && dc5100_links.exists(l) && !national_links.exists(l)){
		national_links.push(l);
	}
}

//remove national items from versioned lists
var temp_links = [];
for (var i=0;i<dc5050_links.length;++i){
	if(!national_links.exists(dc5050_links[i])){
		temp_links.push(dc5050_links[i]);
	}
}
dc5050_links = temp_links;

temp_links = [];
for (var i=0;i<dc5100_links.length;++i){
	if(!national_links.exists(dc5100_links[i])){
		temp_links.push(dc5100_links[i]);
	}
}
dc5100_links = temp_links;

temp_links = [];
for (var i=0;i<dc5150_links.length;++i){
	if(!national_links.exists(dc5150_links[i])){
		temp_links.push(dc5150_links[i]);
	}
}
dc5150_links = temp_links;

//add back og national items
for (var l = 0;l<thisDoc.layers.length;++l) {
	var layer = thisDoc.layers[l];
	var all_imgs = layer.allGraphics;

	for(var i=0;i<all_imgs.length;++i) {
		var link;
		
		if(String(all_imgs[i].itemLink == "null")){
			link = "null";
		}
		else {
			link = all_imgs[i].itemLink.name;
		}

		switch(layer.name){
			case "cmyk_base":
				national_links.push(link);
		}
	}
}

var vFolder = new Folder(Folder.desktop + "/stitcher");
if(!vFolder.exists) {
	vFolder.create();
}

var folders = ["5050","5100","5150","national"];
for (var i=0;i<folders.length;++i){
	var vFolder = new Folder(Folder.desktop + "/stitcher/" + folders[i]);
	if(!vFolder.exists) {
		vFolder.create();
	}
}


//loop thru layers
for (var l = 0;l<thisDoc.layers.length;++l) {
	var layer = thisDoc.layers[l];
	var groups = layer.groups;
	var version = "";

	//create DC folders
	if(layer.name == "5050" || layer.name=="5100" || layer.name=="5150" || layer.name == "cmyk_base"){
		vFolder = new Folder(Folder.desktop + "/stitcher/" + layer.name);
		if (layer.name == "cmyk_base"){
			vFolder = new Folder(Folder.desktop + "/stitcher/national");
			version = "national";
		}
		else {
			version = layer.name;
		}

		if(!vFolder.exists) {
			vFolder.create();
		}

		var products = 0;

		//find groups
		for (var i=0; i<groups.length; i++) {
			var objects = groups[i].allGraphics;//object pdf and image in here?
			var items = groups[i].allPageItems;
			var isProduct = false;
			var links = new Array();
			var productName = "";
		
			//identify product block
			for (var g=items.length-1; g>=0; g--) {
				if (items[g].constructor.name == "TextFrame") {
					var text = items[g].texts[0].contents;
		
					//ChocolateMilk_V19 updated to look for new font
					if(
						text.match('theirs')
						||text.match('% off')
						||text.match('% OFF')
						||(text.match('$') && items[g].texts[0].position==Position.SUPERSCRIPT)
						|| items[g].texts[0].appliedFont.name.match('ChocolateMilk')
					) {
						isProduct = true;
						++products;
					}

					if (items[g].texts[0].appliedParagraphStyle.name.match(titleStyle)
					|| items[g].texts[0].appliedFont.name == 'ollies solid V2') {
						productName = text.toLowerCase().replaceAll(' ','_');
					}

				}
			}
		
			//conditions for creating a new doc
			if(objects.length > 0 && isProduct) {
				createDoc(objects,itemIndex,version,productName);
			}
		
		}

	}
	
}



var ms = new Date() - start;
var seconds = ms/1000;

function getHeight(object) {
	var bounds = object.parent.geometricBounds;
	return bounds[2]-bounds[0];
}

function getWidth(object) {
	var bounds = object.parent.geometricBounds;
	return bounds[3]-bounds[1];
}

function createDoc(objects,index,version,productName) {
	var newDoc = app.documents.add();
	//figure out naming convention for stitcher ads
	newDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.pixels;
	newDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.pixels;
	newDoc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	newDoc.pasteboardPreferences.pasteboardMargins = [0,0];
	newDoc.zeroPoint = [0,0];

	with (newDoc.documentPreferences) {
		pageWidth = 1080;
		pageHeight = 672;
		facingPages = false;
		pageOrientation = PageOrientation.landscape;
		pagesPerDocument = 1;
	}

	for(var i=objects.length-1; i>=0; i--) {
		objects[i].duplicate(newDoc.pages[0]);
	}

	var imgs = newDoc.allGraphics;
	var textframes = newDoc.pages[0].allPageItems;
	var areas = [];
	var docHeight = 672;
	var docWidth = 1080;
	var lastVal = 0;
	var lastIndex = 0;

  	//if single image, scale up
	if(objects.length == 1) {
		var y1 = 0;
		var x1 = 0;
		var y2 = docHeight;
		var x2 = docWidth;
		imgs[0].parent.geometricBounds = [y1,x1,y2,x2];
		imgs[0].fit(FitOptions.proportionally);
		imgs[0].fit(FitOptions.centerContent);
	}
	//if two images, fit together
	else if (imgs.length == 2) {
		//img1
		var y1 = 0;
		var x1 = 0;
		var y2 = docHeight;
		var x2 = docWidth * (1/2);/*1/3*/
		imgs[0].parent.geometricBounds = [y1,x1,y2,x2];
		imgs[0].fit(FitOptions.proportionally);
		imgs[0].fit(FitOptions.centerContent);
		imgs[0].fit(FitOptions.proportionally);

		//img2
		var y1 = 0;
		var x1 = docWidth * (1/2);;
		var y2 = docHeight;
		var x2 = docWidth;/*2/3*/
		imgs[1].parent.geometricBounds = [y1,x1,y2,x2];
		imgs[1].fit(FitOptions.proportionally);
		imgs[1].fit(FitOptions.centerContent);
		imgs[0].fit(FitOptions.proportionally);
	}
	else if (objects.length > 2) {
		var psds = [];
		ais = [];
		//find product in PSD format
		for(var a=imgs.length-1; a>=0; a--) {
			try {
				if(imgs[a].itemLink.name.match('.psd')) {
					lastIndex = a;
					psds.push(imgs[a]);
				}
				else {
					ais.push(imgs[a]);
				}
			}
			catch(err){continue;}
		}

		for(var i=0; i<=ais.length-1; i++) {
			var im = ais[i];
			areas.push(parseInt(getHeight(im)*getWidth(im)));
			im.absoluteRotationAngle = 0;

			//arrange logos along top
			var blockWidth = docWidth/(ais.length);
			var y1 = 0;
			var x1 = blockWidth * i;
			var y2 = docHeight * (1/4);
			var x2 = (blockWidth * i) + blockWidth;

			im.parent.geometricBounds = [y1,x1,y2,x2];
			//center the logos in their frame
			im.fit(FitOptions.proportionally);
			im.fit(FitOptions.centerContent);
		}

		for(var i=0; i<=psds.length-1; i++) {
			var blockWidth = docWidth/(psds.length);
			var im = psds[i];
			var y1 = docHeight * (1/4);
			var x1 = blockWidth * i;
			var y2 = docHeight;
			var x2 = (blockWidth * i) + blockWidth;
			im.parent.geometricBounds = [y1,x1,y2,x2];
			im.fit(FitOptions.proportionally);
			im.fit(FitOptions.centerContent);
		}

		
	}

	var code = "";
	var date = thisDoc.name.split('_')[0] + thisDoc.name.split('_')[1];

	if(date.length == 2) {
		//if date is only 2 digits, make it 3
		date = date.slice(0,1) + "0" + date.slice(1,2)
	}

	//if flyer then name sku by page number
	if(thisDoc.name.match('page')) {
		var pageNumber = thisDoc.name.replace('.indd','').split('_')[4];
		//flyer name incorrect, does not have date
		if(thisDoc.name[0]=='p'){
			pageNumber = thisDoc.name.replace('.indd','').split('_')[1];
			var path = thisDoc.filePath.toString().split('/');
			date = path[path.length-3].split('_');
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
		number = "0" + (index+add);
	}

	if(date.length > 3){
		date = date.slice(0,3);//1020 becomes 102, etc.
	}

	var linkName = imgs[lastIndex].itemLink.name;
	code = pageNumber + date + number;

	if(productName == "") {
		productName = linkName.toLowerCase().replaceAll(' ','_').replace('.jpg','').replace('.ai','').replace('.psd','').replace('.png','');
	}

	productName = productName.replace(/[^a-z0-9]+/gi, "_"); //replace all non alphanumeric
	var complete_name = code + "_" + productName;
	//name document after product
	newDoc.name = complete_name;
	var folder = Folder.desktop;
	var myExportRes = 72;
	app.jpegExportPreferences.exportResolution = myExportRes;
		
	++itemIndex;
	
	//save doc in case designer wants to make edits


	
	if(national_links.exists(linkName)) {
		version = "national";
	}
	else if(dc5050_links.exists(linkName)) {
		version = "5050";
	}
	else if (dc5100_links.exists(linkName)) {
		version = "5100";
	}
	else if (dc5150_links.exists(linkName)) {
		version = "5150";
	}

	//this is an email not flyer
	if(String(pageNumber) == "undefined"){
		if(version == "5050"){
			complete_name=complete_name.replace("undefined","2");
		}
		else if (version == "5100") {
			complete_name=complete_name.replace("undefined","3");
		}
		else if (version == "5150") {
			complete_name=complete_name.replace("undefined","4");
		}
		else (version == "5150") {
			complete_name=complete_name.replace("undefined","1");
		}
	}

	fileName = new File(folder + "/stitcher/" + version + "/" + complete_name + ".jpg");

	if(!link_dir.exists(linkName)){
		newDoc.exportFile(ExportFormat.JPG, fileName, false);
		newDoc.close(SaveOptions.YES,new File(folder + "/stitcher/" + version + "/" + complete_name + ".indd"));
		link_dir.push(linkName);
	}
	else {
		newDoc.close(SaveOptions.NO);
	}
	

	// else{
		// newDoc.close(SaveOptions.NO);
	// }
	
}

function scaleHorz(object,amount) {
	var h = getHeight(object);
	var w = getWidth(object);
	var ratio = w/h;
	resize(object,(ratio*amount) + ' px',amount + 'px')
}

function scaleVert(object,amount) {
	var h = getHeight(object);
	var w = getWidth(object);
	var ratio = w/h;
	resize(object,amount + ' px',(ratio*amount) + ' px');
}

function center(img) {
	moveObject(img,"center",1080/2,672/2);
}

function resize(object, height,width) {
	object.resize(  
	[CoordinateSpaces.PAGE_COORDINATES, BoundingBoxLimits.GEOMETRIC_PATH_BOUNDS],  
    AnchorPoint.TOP_CENTER_ANCHOR,  
    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, 
    [UnitValue(width).as('pt'), UnitValue(height).as('pt')] 
	);
}

function moveObject(myObject,myAnchorPoint,myX,myY) {
	switch(myAnchorPoint) {
		case "bottomLeft":
			var myObjectHeight = myObject.geometricBounds[2]-myObject.geometricBounds[0];
			myObject.move([myX,myY-myObjectHeight]);
			break;
		case "bottomRight":
			var myObjectHeight = myObject.geometricBounds[2]-myObject.geometricBounds[0];
			var myObjectWidth = myObject.geometricBounds[3]-myObject.geometricBounds[1];
			myObject.move([myX+myObjectWidth,myY-myObjectHeight]);
			break;
		case "topLeft":
			myObject.move([myX,myY]);
			break;
		case "topRight":
			var myObjectWidth = myObject.geometricBounds[3]-myObject.geometricBounds[1];
			myObject.move([myX-myObjectWidth,myY]);
			break;
		case "bottomCenter":
			break;
		case "topCenter":
			var myObjectWidth = myObject.geometricBounds[3]-myObject.geometricBounds[1];
			myObject.move([myX-(myObjectWidth/2),myY]);
			break;
        case "center":
 			var myObjectHeight = myObject.geometricBounds[2]-myObject.geometricBounds[0];
			var myObjectWidth = myObject.geometricBounds[3]-myObject.geometricBounds[1];
			myObject.move([myX-(myObjectWidth/2),myY-(myObjectHeight/2)]);
			break;
		default:
			break;
	}
}
