function exportLayersIndividually() {
  var doc = app.activeDocument;
  var myPDFExportPreset = app.pdfExportPresets.item('[High Quality Print]');

  // Create dialog window
  // Increase the height (last value) from 250 to, for example, 300
  var win = new Window('dialog', 'Export Layers');
  win.alignChildren = 'left';

  // Format selection dropdown
  win.add('statictext', undefined, 'Export Format:');
  var formatDropdown = win.add('dropdownlist', undefined);
  formatDropdown.add('item', 'PDF');
  formatDropdown.add('item', 'JPG');
  formatDropdown.selection = 0;

  // Folder selection
  win.add('statictext', undefined, 'Export Folder:');
  var pathText = win.add(
    'edittext',
    [150, 50, 350, 75],
    doc.filePath ? doc.filePath.absoluteURI : Folder.desktop.absoluteURI
  );
  pathText.enabled = false;
  var browseButton = win.add('button', undefined, 'Browse...');

  // Locked layers option
  var lockedCheckbox = win.add(
    'checkbox',
    undefined,
    'Change visibility of locked layers'
  );
  lockedCheckbox.value = false;

  var buttonGroup = win.add('group');
  buttonGroup.orientation = 'row';
  buttonGroup.alignChildren = 'center';

  // Dialog buttons
  var okButton = buttonGroup.add('button', [150, 140, 250, 170], 'OK');
  var cancelButton = buttonGroup.add('button', [260, 140, 360, 170], 'Cancel');

  // Handle folder selection
  browseButton.onClick = function () {
    var folder = Folder.selectDialog('Select Export Folder');
    if (folder) pathText.text = folder.absoluteURI;
  };

  // Show dialog and wait for user input
  win.center();
  if (win.show() === 1) {
    win.close();
    var progressDlg = new Window('palette', 'Progress', undefined, {
      closeButton: false,
    });
    var status = progressDlg.add('statictext');
    status.preferredSize = [400, -1];
    var pb = progressDlg.add('progressbar', undefined, 0, 100);
    pb.preferredSize = [400, -1];
    pb.maxvalue = doc.layers.length;
    progressDlg.show();

    var exportFormat = formatDropdown.selection.text.toUpperCase();
    var folderPath = new Folder(
      decodeURI(pathText.text.replace('file://', ''))
    );
    var changeLockedVisibility = lockedCheckbox.value;

    // Save original layer states
    var originalVisibility = [];
    var originalLocked = [];
    for (var i = 0; i < doc.layers.length; i++) {
      originalVisibility[i] = doc.layers[i].visible;
      originalLocked[i] = doc.layers[i].locked;
    }

    // Create export folder if needed
    if (!folderPath.exists) folderPath.create();

    // Process each layer
    for (var i = 0; i < doc.layers.length; i++) {
      ++pb.value;
      var layer = doc.layers[i];
      status.text = 'Exporting ' + layer.name + '...';

      // Skip locked layers if not allowed to change
      if (layer.locked && !changeLockedVisibility) continue;

      // Set layer visibility
      for (var j = 0; j < doc.layers.length; j++) {
        var currentLayer = doc.layers[j];
        if (j === i) {
          currentLayer.visible = true;
        } else {
          if (!currentLayer.locked || changeLockedVisibility) {
            currentLayer.visible = false;
          }
        }
      }

      // Export file
      var fileName = layer.name.replace(/[^a-z0-9-]/gi, '_');
      +'.' + (exportFormat === 'PDF' ? 'pdf' : 'jpg');
      var saveFile = new File(folderPath.fsName + '/' + fileName);

      if (exportFormat === 'PDF') {
        doc.exportFile(
          ExportFormat.PDF_TYPE,
          saveFile,
          false,
          myPDFExportPreset
        );
      } else {
        doc.exportFile(ExportFormat.JPG, saveFile);
      }
    }

    // Restore original states
    for (var i = 0; i < doc.layers.length; i++) {
      doc.layers[i].visible = originalVisibility[i];
      doc.layers[i].locked = originalLocked[i];
    }

    alert('Exported layers to:\n' + folderPath.fsName);
  }
}

// Run the script
exportLayersIndividually();
