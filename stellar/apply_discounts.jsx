var discount = 0;

const ourPriceStyle = "our price";
var yellow = app.activeDocument.colors[-1].duplicate();
yellow.properties = {colorValue:[0,0,100,0],space:ColorSpace.CMYK};
var red = app.activeDocument.colors[-1].duplicate();
red.properties = {colorValue:[0,99,97,0],space:ColorSpace.CMYK};
var white = 'Paper';

var window = new Window("dialog","Discount");
var dropdown = window.add("dropdownlist", [0,0,100,10], ["0","5","10","15","20","25","30","35","40","45","50","55","60","65","70","75"], undefined);
var text = window.add("statictext");
text.text = "% off"
var button = window.add("button");
var button2 = window.add("button");
button.text = "Calculate";
button2.text = "Cancel"

var key;
try{
    var key = arguments[0];
}catch(e){}

function main() {
    var canceled = false;

    if(key == 'stellar') {
        button.onClick = function() {
            discount = parseInt(dropdown.selection.text) * 0.01;
            window.close();
        };
    
        button2.onClick = function() {
            window.close();
            canceled = true;
        };
    }
    else {
        window.close();
        alert('This automation only works through Stellar. Please launch it again from the app.');
        canceled = true;
    }

    window.show();
    if(!canceled) {
        calculate();
    }
}

function calculate() {
    var doc = app.activeDocument;
    var items = doc.pages[0].allPageItems;

    for (var i = 0;i<items.length;++i) {
    try {
        var item = items[i];

        //our price
        if(item != undefined && item == "[object TextFrame]" &&
            ((item.contents.match('$') && item.texts[0].position==Position.SUPERSCRIPT)
            || (item.contents.match('¢') && item.texts[0].appliedParagraphStyle.name == ourPriceStyle))) {
            
            var bounds = item.geometricBounds;
            var contents = '';
            for(var c = 0;c<item.paragraphs.length;++c) {
                contents = contents + item.paragraphs[c].contents;
            }

            var price = parseInt(contents.replace(/\D/g, "")) * 0.01;
            var newPrice = '';

            if(contents.match('$')) {
                newPrice = '$' + ((price * (1-discount)).toFixed(2) * 100);
            }
            if(contents.match('¢')) {
                newPrice = ((price * (1-discount)).toFixed(2) * 100) + '¢';
            }
            newPrice = newPrice.replace('.','');

            //replace dollars with cents if less than dollar
            if(newPrice.length == 3 && newPrice.match('$')) {
                newPrice = newPrice.replace('$','') + '¢';
            }

            newPrice = newPrice.replace('¢¢','¢');

            //remove excess paragraphs
            if(item.paragraphs.length > 0) {
                for(var p = 1;p<item.paragraphs.length;++p) {
                    item.paragraphs[p].remove();
                }
            }

            //apply our price style to paragraphs that are missing it
            if(item.paragraphs[0].appliedParagraphStyle.name != 'our price') {
                //somehow change grep style ONLY
                item.paragraphs[0].appliedParagraphStyle = 'our price';
            }
            
            //make ours price white
            item.paragraphs[0].fillColor = white;
            item.paragraphs[0].strokeColor = 'None';

            //red bg
            item.fillColor = red;
            //set new price
            item.paragraphs[0].contents = newPrice;
            item.textFramePreferences.autoSizingType = AutoSizingTypeEnum.OFF;
            //item.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.BOTTOM_RIGHT_POINT

            //add discount message
            var messageText = 'AFTER ' + dropdown.selection.text + '% OFF!!!';
            var discountMessage = doc.textFrames.add(item.itemLayer, {
                geometricBounds:item.geometricBounds,
                contents:messageText
            });

            discountMessage.paragraphs[0].appliedFont = "Dom Casual";
            discountMessage.paragraphs[0].fontStyle = "Regular";
            discountMessage.paragraphs[0].fillColor = red;
            discountMessage.paragraphs[0].strokeWeight = 0;

            discountMessage.fillColor = yellow;
            discountMessage.paragraphs[0].justification = Justification.CENTER_ALIGN;


            //shrink price
            var y1 = item.geometricBounds[0];
            var x1 = item.geometricBounds[1];
            var y2 = item.geometricBounds[2];
            var x2 = item.geometricBounds[3];
            var messageHeight = (y2 - y1) / 8; //message should be 1/8 height of our price
            item.geometricBounds = [y1+messageHeight,x1,y2,x2];
            shrinkVertical(item);

            //shrink message
            var y1 = discountMessage.geometricBounds[0];
            var x1 = discountMessage.geometricBounds[1];
            var y2 = discountMessage.geometricBounds[2];
            var x2 = discountMessage.geometricBounds[3];
            discountMessage.geometricBounds = [y1,x1,y1 + (messageHeight*2),x2];
            growVertical(discountMessage);
        }
        //their price
        else if (item == "[object TextFrame]" && item.paragraphs[0].contents.match('theirs')) {
            for(var p = 0;p<item.paragraphs.length;++p) {
                item.paragraphs[p].fillColor = white;
                item.paragraphs[p].strokeWeight = 0;
                item.paragraphs[p].verticalScale = item.paragraphs[p].verticalScale - 15;
                //item.paragraphs[p].horizontalScale = item.paragraphs[p].horizontalScale - 15;
                item.paragraphs[p].leading = parseFloat(item.paragraphs[p].pointSize / 1.2); //decrease leading by 20%

                var y1 = item.geometricBounds[0];
                var x1 = item.geometricBounds[1];
                var y2 = item.geometricBounds[2];
                var x2 = item.geometricBounds[3];
                var height = y2 - y1;
                item.geometricBounds = [y1 + (height/10),x1,y2 + (height/10),x2];
                item.bringToFront();
                app.documents[0].recompose();
            }
        }
    }
    catch(e) {
        //alert(e + " line " + e.line);
    }
    }
}

// Repeatedly shrink text paragraphs by .1 points until the text is no longer overset
function shrinkProportional(myTextFrame) {
    var myLeading = 1;
	do {
		myTextFrame.paragraphs[0].pointSize = myTextFrame.paragraphs[0].pointSize - .1;
		myTextFrame.paragraphs[0].leading = myTextFrame.paragraphs[0].pointSize * myLeading;
	} while (myTextFrame.overflows == true);
}

function shrinkVertical(myTextFrame) {
    vScale = myTextFrame.paragraphs[0].verticalScale;
    hScale = myTextFrame.paragraphs[0].horizontalScale;
    leading = myTextFrame.paragraphs[0].leading;
    size = myTextFrame.paragraphs[0].pointSize; 

    while ((myTextFrame.overflows) && (vScale >=50) && leading > 0) {
        myTextFrame.paragraphs[0].verticalScale = parseFloat(vScale);
        myTextFrame.paragraphs[0].horizontalScale = parseFloat(hScale);
        if(myTextFrame.paragraphs[0].leading != Leading.AUTO) {
            myTextFrame.paragraphs[0].leading = parseFloat(leading);
        }
        myTextFrame.paragraphs[0].pointSize = parseFloat(size);
        vScale -= 1;
        hScale += 0.5; //only grow by half a percent, otherwise text becomes squished
        leading -= 1;
        size -= 1;
        app.documents[0].recompose();
    }
}

function growVertical(myTextFrame) {
    vScale = myTextFrame.paragraphs[0].verticalScale;
    hScale = myTextFrame.paragraphs[0].horizontalScale;
    leading = myTextFrame.paragraphs[0].leading;
    size = myTextFrame.paragraphs[0].pointSize; 

    while (!myTextFrame.overflows) {
        myTextFrame.paragraphs[0].horizontalScale = parseFloat(hScale);
        myTextFrame.paragraphs[0].verticalScale = parseFloat(vScale);
        if(myTextFrame.paragraphs[0].leading != Leading.AUTO) {
            myTextFrame.paragraphs[0].leading = parseFloat(leading);
        }
        myTextFrame.paragraphs[0].pointSize = parseFloat(size);
        vScale += 1;
        hScale += 1;
        leading += 1;
        size += 1;

        app.documents[0].recompose();
    }

    //correct overflow
    while (myTextFrame.overflows) {
        myTextFrame.paragraphs[0].horizontalScale = parseFloat(hScale);
        myTextFrame.paragraphs[0].verticalScale = parseFloat(vScale);
        if(myTextFrame.paragraphs[0].leading != Leading.AUTO) {
            myTextFrame.paragraphs[0].leading = parseFloat(leading);
        }
        myTextFrame.paragraphs[0].pointSize = parseFloat(size);
        vScale -= 1;
        hScale -= 1;
        leading -= 1;
        size -= 1;

        app.documents[0].recompose();
    }
}

main();