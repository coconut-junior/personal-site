var discount = 0;

const ourPriceStyle = 'our price';
var yellow = app.activeDocument.colors[-1].duplicate();
yellow.properties = { colorValue: [0, 0, 100, 0], space: ColorSpace.CMYK };
var red = app.activeDocument.colors[-1].duplicate();
red.properties = { colorValue: [0, 99, 97, 0], space: ColorSpace.CMYK };
var white = 'Paper';

var window = new Window('dialog', 'Discount');
var dropdown = window.add(
  'dropdownlist',
  [0, 0, 100, 10],
  [
    '0',
    '5',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
    '60',
    '65',
    '70',
    '75',
  ],
  undefined
);
var text = window.add('statictext');
text.text = '% off';
var button = window.add('button');
var button2 = window.add('button');
button.text = 'Calculate';
button2.text = 'Cancel';
var centSymbol = new String('\u00a2');

var key;
try {
  var key = arguments[0];
} catch (e) {}

function main() {
  var canceled = false;

  if (key == 'stellar') {
    button.onClick = function () {
      discount = parseInt(dropdown.selection.text) * 0.01;
      window.close();
    };

    button2.onClick = function () {
      window.close();
      canceled = true;
    };
  } else {
    window.close();
    alert(
      'This automation only works through Stellar. Please launch it again from the app.'
    );
    canceled = true;
  }

  window.show();
  if (!canceled) {
    calculate();
  }
}

function round(num, precision) {
  var base = Math.pow(10, precision);
  return (Math.round(num * base) / base).toFixed(precision);
}

function calculate() {
  var doc = app.activeDocument;
  var items = doc.allPageItems;

  for (var i = 0; i < items.length; ++i) {
    var item = items[i];

    //our price
    if (item != undefined && item == '[object TextFrame]') {
      for (var p = 0; p < item.paragraphs.length; ++p) {
        if (
          item.paragraphs[p].appliedFont.name.match('ChocolateMilk') &&
          (item.paragraphs[p].contents.match(/^\$/) ||
            item.paragraphs[p].contents.match(centSymbol))
        ) {
          var contents = item.paragraphs[p].contents;
          var priceString = contents.replace(/\D/g, '');
          var price = parseInt(priceString) * 0.01;
          var newPrice = '';

          if (contents.match(/^\$/)) {
            newPrice = '$' + round(price * (1 - discount), 2) * 100;
          } else if (contents.match(centSymbol)) {
            newPrice = round(price * (1 - discount), 2) * 100;
            newPrice = newPrice.toString() + centSymbol;
          }

          newPrice = newPrice.replace('.', '');
          item.paragraphs[p].contents = item.paragraphs[p].contents
            .replace('$', '')
            .replace(centSymbol, '')
            .replace(priceString, newPrice);
        }
      }
    }
  }
}

// Repeatedly shrink text paragraphs by .1 points until the text is no longer overset
function shrinkProportional(myTextFrame) {
  var myLeading = 1;
  do {
    myTextFrame.paragraphs[0].pointSize =
      myTextFrame.paragraphs[0].pointSize - 0.1;
    myTextFrame.paragraphs[0].leading =
      myTextFrame.paragraphs[0].pointSize * myLeading;
  } while (myTextFrame.overflows == true);
}

function shrinkVertical(myTextFrame) {
  vScale = myTextFrame.paragraphs[0].verticalScale;
  hScale = myTextFrame.paragraphs[0].horizontalScale;
  leading = myTextFrame.paragraphs[0].leading;
  size = myTextFrame.paragraphs[0].pointSize;

  while (myTextFrame.overflows && vScale >= 50 && leading > 0) {
    myTextFrame.paragraphs[0].verticalScale = parseFloat(vScale);
    myTextFrame.paragraphs[0].horizontalScale = parseFloat(hScale);
    if (myTextFrame.paragraphs[0].leading != Leading.AUTO) {
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
    if (myTextFrame.paragraphs[0].leading != Leading.AUTO) {
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
    if (myTextFrame.paragraphs[0].leading != Leading.AUTO) {
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
