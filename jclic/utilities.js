/* 
 * Copyright (C) 2014 XTEC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

// Gets a boolean value [1|0] from a numeric or textual expression
function getBoolean(val, defaultValue) {
  return Number(val === 'true' | defaultValue ? 1 : 0);
}

// Gets a tri-state value [1|0|-1] from a set of 'true', 'false', 'default' possible values
function getTriState(val) {
  return Number(val === 'true' ? 1 : val === 'false' ? 0 : -1);
}

// Checks if the provided variable is 'null' or 'undefined'
function isNullOrUndef(variable) {
  return (typeof variable === 'undefined' || variable === null);
}

// Converts java-like color codes (like '0xRRGGBB') to valid CSS values
// like '#RRGGBB' or 'rgba(r,g,b,a)'
function checkColor(color, defaultColor) {
  var col = (isNullOrUndef(color) ? defaultColor : color).replace('0x', '#');

  // Check for Alpha value
  if (col.charAt(0) === '#' && col.length > 7) {
    col = 'rgba(' +
            parseInt(col.substring(3, 5), 16) + ',' +
            parseInt(col.substring(5, 7), 16) + ',' +
            parseInt(col.substring(7, 9), 16) + ',' +
            (parseInt(col.substring(1, 3), 16) / 255.0) + ')';
  }
  return col;
}

// Reads 'p' blocks inside XML elements
function getXmlText(xml) {
  var text = '';
  $(xml).children('p').each(function () {
    text += '<p>' + this.textContent + '</p>';
  });
  return text;
}

// Read a point specification from a JQuery XML element
function readPoint($xml) {
  return {
    x: Number($xml.attr('x')),
    y: Number($xml.attr('y'))};
}

// Read a size specification from a JQuery XML element
function readSize($xml) {
  return {
    width: Number($xml.attr('width')),
    height: Number($xml.attr('height'))};
}

// Gets the CSS 'linear-gradient' function for a JClic gradient object.
// To be used as a value for CSS property 'background-image'
function getGradientCSS(gradient) {
  var repeat = Number(gradient.cycles, 1);
  var css = 'linear-gradient(' +
          (Number(gradient.angle, 0) + 90) + 'deg, ' +
          gradient.source + ', ' +
          gradient.dest;
  for (i = 1; i < repeat; i++) {
    css += ', ' + (i % 2 > 0 ? gradient.source : gradient.dest);
  }
  css += ')';
  return css;
}

function SVG(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}


function getSVGshapes(shaper, width, height, baseID) {

  var $svg = $(SVG('svg')).attr({width: 0, height: 0});
  var $defs = $(SVG('defs'));
  var count = 0;

  // TODO: scaleX, scaleY?
  switch (shaper.class) {
    case '@JigSaw':
    case '@ClassicJigSaw':
    case '@TriangularJigSaw':
    case '@Rectangular':
      //var cellWidth = width / shaper.cols;
      //var cellHeight = height / shaper.rows;
      var cellWidth = 1 / shaper.cols;
      var cellHeight = 1 / shaper.rows;
      for (var y = 0; y < shaper.rows; y++) {
        for (var x = 0; x < shaper.cols; x++) {
          var $clipPath = $(SVG('clipPath')).attr('id', baseID + '_' + count++);
          // Workaround to avoid JQuery lowercase capitalization
          //$clipPath.attr('clipPathUnits', 'objectBoundingBox');
          $clipPath[0].setAttribute('clipPathUnits', 'objectBoundingBox');
          $clipPath.append($(SVG('rect')).attr({
            x: 0,
            y: 0,
            width: 1,
            height: 1
          }));
          $clipPath.appendTo($defs);
        }
      }
      break;

    case '@Holes':
      var x0 = 0, y0 = 0, shw = 1, shh = 1;
      var n = 3;
      if (shaper.enclosing.action === 'rectangle') {
        x0 = shaper.enclosing.data[0];
        y0 = shaper.enclosing.data[1];
        shw = shaper.enclosing.data[2] - x0;
        shh = shaper.enclosing.data[3] - y0;
      }
      for (var i = 0; i < shaper.sh.length; i++) {

        var $clipPath = $(SVG('clipPath')).attr('id', baseID + '_' + count++);

        // Workaround to avoid JQuery lowercase capitalization
        //$clipPath.attr('clipPathUnits', 'objectBoundingBox');
        $clipPath[0].setAttribute('clipPathUnits', 'objectBoundingBox');

        var sd = shaper.sh[i];
        var x0 = sd[0].data[0] / shw;
        var y0 = sd[0].data[1] / shh;

        switch (sd[0].action) {

          case 'rectangle':
            $clipPath.append($(SVG('rect')).attr({
              x: (x0).toFixed(n),
              y: (y0).toFixed(n),
              width: (sd[0].data[2] / shw).toFixed(n),
              height: (sd[0].data[3] / shh).toFixed(n)
            }));
            break;

          case 'ellipse':
            var rx = sd[0].data[2] / 2 / shw;
            var ry = sd[0].data[3] / 2 / shh;
            var s = 'M ' + (x0).toFixed(n) + ',' + (y0 + ry).toFixed(n) +
                    ' a ' + (rx).toFixed(n) + ',' + (ry).toFixed(n) + ' 0 1,1 0,0.0001' +
                    ' Z';
            $clipPath.append($(SVG('path')).attr('d', s));
            break;

          default:
            var s = '';
            var closed = false;
            for (var j = 0; j < sd.length; j++) {
              switch (sd[j].action) {
                case 'M':
                  // Move To
                  s += ' M ' + (sd[j].data[0] / shw).toFixed(n) + ',' + (sd[j].data[1] / shh).toFixed(n);
                  break;
                case 'L':
                  // Line To
                  s += ' L ' + (sd[j].data[0] / shw).toFixed(n) + ',' + (sd[j].data[1] / shh).toFixed(n);
                  break;
                case 'Q':
                  // Quad to
                  s += ' Q ' + (sd[j].data[0] / shw).toFixed(n) + ' ' + (sd[j].data[1] / shh).toFixed(n) + ' '
                          + (sd[j].data[2] / shw).toFixed(n) + ' ' + (sd[j].data[3] / shh).toFixed(n);
                  break;
                case 'B':
                  // Cubic to
                  s += ' C ' + (sd[j].data[0] / shw).toFixed(n) + ' ' + (sd[j].data[1] / shh).toFixed(n) + ' '
                          + (sd[j].data[2] / shw).toFixed(n) + ' ' + (sd[j].data[3] / shh).toFixed(n) + ' '
                          + (sd[j].data[4] / shw).toFixed(n) + ' ' + (sd[j].data[5] / shh).toFixed(n);
                  break;
                case 'X':
                  // Close path
                  s += ' Z';
                  closed = true;
                  break;
              }
            }
            if (!closed)
              s += ' Z';
            $clipPath.append($(SVG('path')).attr('d', s));
            break;
        }
        $clipPath.appendTo($defs);
      }
      break;
  }

  $defs.appendTo($svg);

  return $svg;
}


var PathIterator = {
  WIND_NON_ZERO: true,
  SEG_LINETO: "lt",
  SEG_QUADTO: "qt",
  SEG_CUBICTO: "ct",
  SEG_CLOSE: "cl"
};

function ShapeData() {
  var CAPACITY_BLOCK = 6;
  this.points = [2 * CAPACITY_BLOCK];
  this.pointsIndex = 0;
  this.descriptors = [CAPACITY_BLOCK];
  this.descriptorsIndex = 0;
  this.windingRule = PathIterator.WIND_NON_ZERO;
  this.primitivePoints = [];
  this.primitiveType = -1;
  this.comment = null;

  this.addDescriptor = function (descriptor) {
    this.descriptors[this.descriptorsIndex++] = descriptor;
  };

  this.addData = function (data) {
    for (var d in data)
      this.points[this.pointsIndex++] = d;
  };

  this.add = function (descriptor, data) {
    this.addDescriptor(descriptor);
    if (data !== undefined && data !== null)
      this.addData(data);
  };

  this.moveTo = function (x, y) {
    add(PathIterator.SEG_MOVETO, [x, y]);
  };

  this.lineTo = function (x, y) {
    add(PathIterator.SEG_LINETO, [x, y]);
  };

  this.quadTo = function (x0, y0, x1, y1) {
    add(PathIterator.SEG_QUADTO, [x0, y0, x1, y1]);
  };

  this.cubicTo = function (x0, y0, x1, y1, x2, y2) {
    add(PathIterator.SEG_CUBICTO, [x0, y0, x1, y1, x2, y2]);
  };

  this.closePath = function () {
    add(PathIterator.SEG_CLOSE);
  };

  this.setWindingRule = function (setRule) {
    this.windingRule = setRule;
  };

  this.scaleTo = function (scaleX, scaleY) {
    for (var i = 0; i < this.points.length; i += 2) {
      this.points[i] /= scaleX;
      this.points[i + 1] /= scaleY;
    }

    for (var i = 0; i < this.primitivePoints.length; i += 2) {
      this.primitivePoints[i] /= scaleX;
      this.primitivePoints[i + 1] /= scaleY;
    }
  };
  
}


function Shaper(nx, ny) {

  this.reset(nx, ny);

  this.reset = function (nCols, nRows) {
    if(nCols !== undefined)
      this.nCols = nCols;
    if(nRows !== undefined)
      this.nRows = nRows;
    this.nCells = nRows * nCols;
    this.initiated = false;
    this.shapeData = [this.nCells];
    for (i = 0; i < this.nCells; i++)
      this.shapeData[i] = new ShapeData();
  };

    

  
}



