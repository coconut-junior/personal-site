//backport replaceall function to es3
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

var doc = app.activeDocument;
var groups = doc.groups;
var path = doc.fullName.fsName.replace(doc.fullName.fsName.split('/')[doc.fullName.fsName.split('/').length-1],'');
var imgPath = Folder(path + "/images");

if(doc.saved) {
    if(!imgPath.exists) {
        imgPath.create();
    }
    exportAll();
}
else {
    alert('Please save your document first!');
}


function exportAll() {
    for(var i = 0;i<groups.length;++i) {
        var g = groups[i];
        var pngName = g.textFrames[g.textFrames.length-1].contents.replace(/([^0-9a-z])/ig, "");
        if(pngName.length > 16) {pngName = pngName.slice(0,16);}

        g.exportFile(format = ExportFormat.PNG_FORMAT, to = path + "/images/" + pngName + ".png");
    }
    alert('Complete! \nYour images can be found in ' + path + "/images");
}