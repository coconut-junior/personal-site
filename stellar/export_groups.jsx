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

app.jpegExportPreferences.exportResolution = 72;
app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.LOW;

var doc = app.activeDocument;
var groups = doc.groups;
var path = doc.fullName.fsName.replace(
  doc.fullName.fsName.split('/')[doc.fullName.fsName.split('/').length - 1],
  ''
);
var imgPath = Folder(path + '/images');

if (doc.saved) {
  if (!imgPath.exists) {
    imgPath.create();
  }
  exportAll();
} else {
  alert('Please save your document first!');
}

function exportAll() {
  for (var i = 0; i < groups.length; ++i) {
    var g = groups[i];
    var fileName = undefined;

    for (var j = 0; j < g.textFrames.length; ++j) {
      var t = g.textFrames[j];

      for (var k = 0; k < t.paragraphs.length; ++k) {
        var para = t.paragraphs[k];
        if (para.appliedParagraphStyle.name.match('mainline')) {
          fileName = para.contents
            .toLowerCase()
            .replace(/([^0-9a-z])/gi, '_')
            .replaceAll('__', '_');
        }
      }
    }

    if (fileName != undefined) {
      if (fileName.length > 16) {
        fileName = fileName.slice(0, 16);
      }
      g.exportFile(
        (format = ExportFormat.JPG),
        (to = path + '/images/' + fileName + '.jpg')
      );
    }
  }
  alert('Complete! \nYour images can be found in ' + path + '/images');
}
