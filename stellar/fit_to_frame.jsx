var key;
var interval = 0.5;

try{
    var key = arguments[0];
}catch(e){}

function main() {

    fill(app.selection[0]);

    
    // var canceled = false;

    // if(key == 'stellar') {
    //     fill(app.selection[0]);
    // }
    // else {
    //     alert('This automation only works through Stellar. Please launch it again from the app.');
    //     canceled = true;
    // }
}

function fill(frame) {
    if(frame == undefined) {
        alert('Please select a text frame.');
    }
    else {
        do {
            frame.paragraphs[0].pointSize = frame.paragraphs[0].pointSize + interval;
            frame.paragraphs[0].leading = frame.paragraphs[0].pointSize * 1;
        } while (frame.overflows == false);
    
        shrink(frame);
    }
}

function shrink(myTextFrame) {
	do {
		myTextFrame.paragraphs[0].pointSize = myTextFrame.paragraphs[0].pointSize - interval;
		myTextFrame.paragraphs[0].leading = myTextFrame.paragraphs[0].pointSize * 1;
	} while (myTextFrame.overflows == true);
}

// main();


if (parseFloat(app.version) < 6)
    main();
else
    app.doScript(
        main,
        ScriptLanguage.JAVASCRIPT,
        undefined,
        UndoModes.ENTIRE_SCRIPT,
        "Make Images Proportional"
    );
