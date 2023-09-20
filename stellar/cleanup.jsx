#target indesign

var debug=false;
var scriptPath = File($.fileName).path;
var gSettings=new Object();
var currentSettingsFile = File(scriptPath+"/cleanup_demo.ini");

if (currentSettingsFile.exists)
    {
        currentSettingsFile.open("r");
        gSettings = eval(currentSettingsFile.read());
        currentSettingsFile.close();
    }

//load settings

Array.prototype.joinNames = function()
{
    var result="|";
    for (var i=0;i<this.length;i++)
        result+=this[i].name+"|";
       return result;
}


Array.prototype.pushOnce=function(obj)
{
if(!this.contains(obj))
this.push(obj);
}

Array.prototype.pushWithBasedStyles=function(style)
{
if(!this.contains(style))
{
this.push(style);
this.joinWithArray(basedOnStyles(style));
}
}

Array.prototype.joinWithArray=function(obj)
{
	for(var i=0;i<obj.length;i++)
		this.pushOnce(obj[i]);
}


Array.prototype.contains=function(obj)
{
var result=false;	
if(this.joinNames().indexOf("|"+obj.name+"|")!=-1)
	result=true;
	return result;
}

Array.prototype.containsApplied=function(style)
{
//array of cell/object styles with appliedParagraphStyle 
var result=false;
for (var i=0;i<this.length;i++)
if (this[i].appliedParagraphStyle==style)
{result=true; break;
}
	return result;
}

Array.prototype.containsNested=function(style)
{
//array of parastyles with nested and nested grep styles
var result=false;
for (var i=0;i<this.length;i++)
{
	
var allNested=this[i].nestedStyles.everyItem().getElements().slice(0);
allNested=allNested.concat(this[i].nestedGrepStyles.everyItem().getElements().slice(0));

	for(var j=0;j<allNested.length;j++)
	{
			if(allNested[j].appliedCharacterStyle==style) {
				result=true;
				break;
				}
	}
if(result) break;
}
return result;
}

Table.prototype.containsCellStyle=function(style)
{
var result=false;
for(var i=0;i<this.cells.length;i++)
{
	if(this.cells[i].appliedCellStyle==style)
	{
		result=true;
		break;
	}
}
return result;
}

Array.prototype.containsCellStyle=function(style)
{
//array of table styles 
var result=false;
	for(var i=0;i<this.length;i++)
	{
		var curr=this[i];
		if(  
			curr.bodyRegionCellStyle==style ||
			curr.footerRegionCellStyle==style ||
			curr.headerRegionCellStyle==style ||
			curr.leftColumnRegionCellStyle==style ||
			curr.rightColumnRegionCellStyle==style
		){result=true;break;}
	}
return result;
}


Array.prototype.tablesContainCellStyle=function(style)
{
//array of tables
var result=false;
	for(var i=0;i<this.length;i++)
	{
		var curr=this[i];
		if(curr.containsCellStyle(style)){result=true;break;}
	}
return result;
}

Application.prototype.doUndoableScript=function(theFunction,undoName)
{
	 app.doScript(theFunction,ScriptLanguage.javascript,
     undefined,
     UndoModes.entireScript,undoName);
}


var w = new Window('dialog', 'CleanUp');

		w.orientation='row';
		w.alignChildren='top';
		
		var d=w.add('panel');
		d.orientation = 'column';
		d.alignChildren = 'left';
		
		
		var removeUnusedStylesCheckbox=d.add('checkbox',undefined,'Remove Styles not in Use');
		removeUnusedStylesCheckbox.helpTip="Removes Paragraph, Character, Object, Table and Cell styles not in use";
		
		var removeUnusedColorsCheckbox=d.add('checkbox',undefined,'Remove Colours not in Use');
		removeUnusedColorsCheckbox.helpTip="Removes colour swatches not in use in document";
		
		
		var deleteUnusedLayersCheckbox=d.add('checkbox',undefined,'Remove Unused Layers');
		deleteUnusedLayersCheckbox.helpTip="Remove layers not in use in document";

		if (gSettings.cleanPasteboard) cleanPasteboardCheckbox.value=true;
		if (gSettings.removeUnusedStyles) removeUnusedStylesCheckbox.value=true;
		if (gSettings.removeUnusedColors) removeUnusedColorsCheckbox.value=true;
		if (gSettings.addUnnamedColorsToSwatches) addUnnamedColorsToSwatchesCheckbox.value=true;
		if (gSettings.convertRGBSwatches) convertRGBSwatchesCheckbox.value=true;
		if (gSettings.convertSpotSwatches) convertSpotSwatchesCheckbox.value=true;
		if (gSettings.deleteUnusedLayers) deleteUnusedLayersCheckbox.value=true;

		var gr1=d.add('group');
		gr1.orientation='row';
		var loadBookButton=gr1.add('button',undefined,'Load Book');
		var bookName=gr1.add('statictext', undefined, '', {
		        truncate: 'middle'
		    });
		bookName.characters = 30;
		 loadBookButton.enabled=false;
		
		
		var d2=w.add('group');
		d2.orientation = 'column';
		d2.alignChildren = 'fill';
		
		var okButton=d2.add('button',undefined,'Start CleanUp',{name:'ok'});
		var cancelButton=d2.add('button',undefined,'Cancel',{name:'cancel'});
		
		cancelButton.onClick=function()
		{
		//populate settings

		gSettings.removeUnusedStyles=removeUnusedStylesCheckbox.value;
		gSettings.removeUnusedColors=removeUnusedColorsCheckbox.value;
		gSettings.deleteUnusedLayers=deleteUnusedLayersCheckbox.value;
		
		currentSettingsFile.open("w");      
            currentSettingsFile.write(gSettings.toSource());
            currentSettingsFile.close();
		w.close();
		}
		
		okButton.onClick=function()
		{
		//populate settings
		gSettings.cleanPasteboard=cleanPasteboardCheckbox.value;
		gSettings.removeUnusedStyles=removeUnusedStylesCheckbox.value;
		gSettings.removeUnusedColors=removeUnusedColorsCheckbox.value;
		gSettings.addUnnamedColorsToSwatches=addUnnamedColorsToSwatchesCheckbox.value;
		gSettings.convertRGBSwatches=convertRGBSwatchesCheckbox.value;
		gSettings.convertSpotSwatches=convertSpotSwatchesCheckbox.value;
		gSettings.deleteUnusedLayers=deleteUnusedLayersCheckbox.value;
		//save
		currentSettingsFile.open("w");      
            currentSettingsFile.write(gSettings.toSource());
            currentSettingsFile.close();
		//process
		
		w.close(1);
		}
		
		if (w.show()==1)
		app.doUndoableScript(process,"CleanUp");
		
		
function process()
{

	if(app.documents.length) 
	{processOneDoc(app.activeDocument);	
alert('CleanUp finished!');
}
else alert('No active document to process');
}
		
function processOneDoc(docRef)
{
do{
if(!docRef) break;

if(gSettings.removeUnusedStyles)
{
	
var allTables=new Array();
for(var i=0;i<docRef.stories.length;i++)
	allTables=allTables.concat(docRef.stories[i].tables.everyItem().getElements().slice(0));

var allUsedTableStyles=new Array();	
//table styles
for(var i=0;i<allTables.length;i++)
	allUsedTableStyles.pushWithBasedStyles(allTables[i].appliedTableStyle);

for(var i=docRef.allTableStyles.length-1;i>=0;i--)
	if(!allUsedTableStyles.contains(docRef.allTableStyles[i]))
		try{docRef.allTableStyles[i].remove();}catch(e){};
			
//cell styles	
var allCellStyles=docRef.allCellStyles;
var allUsedCellStyles=new Array();	
for(var i=allCellStyles.length-1;i>=0;i--)
{
	if(allTables.tablesContainCellStyle(allCellStyles[i]) || docRef.allTableStyles.containsCellStyle(allCellStyles[i]))
			allUsedCellStyles.pushWithBasedStyles(allCellStyles[i]);
}
for(var i=allCellStyles.length-1;i>=0;i--)
if(!allUsedCellStyles.contains(allCellStyles[i])) 
	try{allCellStyles[i].remove()}catch(e){}
allCellStyles=docRef.allCellStyles;

//object styles
var allObjectStyles=docRef.allObjectStyles;
var allUsedObjectStyles=new Array();
with (app.findChangeObjectOptions)
	{
		includeFootnotes=true;
		includeHiddenLayers=true;
		includeLockedLayersForFind=true;
		includeLockedStoriesForFind=true;
		includeMasterPages=true;
	}
app.findObjectPreferences=NothingEnum.NOTHING;
for(var i=allObjectStyles.length-1;i>=0;i--)
{
app.findObjectPreferences.appliedObjectStyles=allObjectStyles[i];	
var myFinds=docRef.findObject();
if(myFinds.length) allUsedObjectStyles.pushWithBasedStyles(allObjectStyles[i]);
}	

app.findObjectPreferences=NothingEnum.NOTHING;
app.findChangeObjectOptions=NothingEnum.NOTHING;

for(var i=allObjectStyles.length-1;i>=0;i--)
if(!allUsedObjectStyles.contains(allObjectStyles[i])) 
	try{allObjectStyles[i].remove()}catch(e){}

allObjectStyles=docRef.allObjectStyles;

//para styles
var allParaStyles=docRef.allParagraphStyles;
var allUsedParaStyles=new Array();
with (app.findChangeTextOptions)
	{
		includeFootnotes=true;
		includeHiddenLayers=true;
		includeLockedLayersForFind=true;
		includeLockedStoriesForFind=true;
		includeMasterPages=true;
	}
app.findTextPreferences=NothingEnum.NOTHING;
app.findTextPreferences.findWhat="";
for(var i=allParaStyles.length-1;i>=0;i--)
{
app.findTextPreferences.appliedParagraphStyle=allParaStyles[i];	
var myFinds=docRef.findText();
if(myFinds.length || allCellStyles.containsApplied(allParaStyles[i]) || allObjectStyles.containsApplied(allParaStyles[i])) 
		allUsedParaStyles.pushWithBasedStyles(allParaStyles[i]);
}	
for(var i=allParaStyles.length-1;i>=0;i--)
if(!allUsedParaStyles.contains(allParaStyles[i])) 
	try{allParaStyles[i].remove()}catch(e){}
	
//char styles
allParaStyles=docRef.allParagraphStyles;
var allCharStyles=docRef.allCharacterStyles;
var allUsedCharStyles=new Array();
app.findTextPreferences=NothingEnum.NOTHING;
app.findTextPreferences.findWhat="";

log(allCharStyles);

for(var i=allCharStyles.length-1;i>=0;i--)
{
app.findTextPreferences.appliedCharacterStyle=allCharStyles[i];	
var myFinds=docRef.findText();
log(myFinds);
if(myFinds.length || allParaStyles.containsNested(allCharStyles[i])) 
	allUsedCharStyles.pushWithBasedStyles(allCharStyles[i]);
}	

log(allUsedCharStyles);

app.findTextPreferences=NothingEnum.NOTHING;
app.findChangeTextOptions=NothingEnum.NOTHING;
for(var i=allCharStyles.length-1;i>=0;i--)
if(!allUsedCharStyles.contains(allCharStyles[i])) 
	try{allCharStyles[i].remove()}catch(e){log(e)}

}


if (gSettings.removeUnusedColors)
	{
	for (var i = docRef.unusedSwatches.length-1; i >= 0; i--) 
		{
		var mySwatch = docRef.unusedSwatches[i];
		if (mySwatch.name!="") 
			mySwatch.remove();
		}
	}



if(gSettings.deleteUnusedLayers)
	{
	var allLayers=docRef.layers;
	for(var i=allLayers.length-1;i>=0;i--)
		{
			if(!allLayers[i].pageItems.length && !allLayers[i].locked)
			try{allLayers[i].remove()}catch(e){}	
		}
	}

//docRef.save();


}while(false);


}


function basedOnStyles(style)
{
	var result=new Array();
	try{
	while(style.basedOn!=undefined && !result.contains(style.basedOn))
	{		
		style=style.basedOn;
		result.pushOnce(style);
	}
	}catch(e){};
	try{
	if(style.constructor.name=="ParagraphStyle")
		result.pushWithBasedStyles(style.nextStyle);
	}catch(e){}
	
	return result;
}


function log(obj)
{
if (debug) 
{   $.writeln("------");
	$.writeln(obj + " - "+obj.toSource());  
	$.writeln("------");  
}
}