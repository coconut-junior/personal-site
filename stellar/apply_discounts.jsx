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
var centSymbol = new String('\u00a2');

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
        if(item != undefined && item == "[object TextFrame]" && item.texts[0].appliedFont.name.match('ChocolateMilk')) {
            
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
                newPrice = newPrice.replace('$','') + centSymbol;
            }

            newPrice = newPrice.replace('¢¢','¢');

            //remove excess paragraphs
            if(item.paragraphs.length > 0) {
                for(var p = 1;p<item.paragraphs.length;++p) {
                    item.paragraphs[p].remove();
                }
            }

            item.contents = newPrice;
            

        }
            
    }
    catch(e) {}
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