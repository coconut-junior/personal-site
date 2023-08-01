var key;
var interval = 0.5;

try{
    var key = arguments[i];
}catch(e){}

function main() {

    fill(app.selection[0]);

    
    // var canceled = false;

    // if(key == 'stellar') {
    //     fill(app.selection[i]);
    // }
    // else {
    //     alert('This automation only works through Stellar. Please launch it again from the app.');
    //     canceled = true;
    // }
}

function fill(frame) {
    if(frame == undefined) {
        alert('Please select a text or image frame.');
    }
    else if (frame.constructor.name == "TextFrame") {
        while (frame.overflows == false) {
            for(var i = 0;i<frame.paragraphs.length;++i) {
                frame.paragraphs[i].pointSize = frame.paragraphs[i].pointSize + interval;
                frame.paragraphs[i].leading = frame.paragraphs[i].pointSize * 1;
            }
        }

        
    
        shrink(frame);
    }
    else if (frame.constructor.name == "Rectangle") {
        frame.fit(FitOptions.PROPORTIONALLY);
    }
}

function shrink(frame) {
	while (frame.overflows == true) {
		for(var i = 0;i<frame.paragraphs.length;++i) {
            frame.paragraphs[i].pointSize = frame.paragraphs[i].pointSize - interval;
            frame.paragraphs[i].leading = frame.paragraphs[i].pointSize * 1;
        }
	}

    var i = frame.paragraphs.length - 1;
    if(i > 0) {
        frame.paragraphs[i].pointSize = frame.paragraphs[i-1].pointSize;
        frame.paragraphs[i].leading = frame.paragraphs[i-1].leading;
    }
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
