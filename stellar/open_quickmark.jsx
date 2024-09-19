var args = arguments[0].split(','); //format: url:1,2,3,4;url:5,6,7
var path = args[0];
var id = args[1];
var id = parseInt(id);

try {
  app.activate();
  app.open(path);
  var doc = app.activeDocument;
  var bookmarkedItem = doc.pageItems.itemByID(id);
  bookmarkedItem.select();
  doc.layoutWindows[0].zoomPercentage = 100;
} catch (e) {
  alert(e);
  alert(
    'Could not locate quickmark. Check to see if the document was renamed.'
  );
}
