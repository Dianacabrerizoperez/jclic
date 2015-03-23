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


// Main function to read JClic project properties
function readJClicProject($xml) {

  var project = new Object;

  project.name = $xml.attr('name');
  project.version = $xml.attr('version');
  project.type = $xml.attr('type');
  project.code = $xml.attr('code');

  project.settings = readProjectSettings($xml.children('settings'));
  project.sequence = readSequence($xml.children('sequence'));
  project.activities = readActivities($xml.children('activities'));
  project.mediaBag = readMediaBag($xml.children('mediaBag'));

  return project;
}

// Reads JClic project settings from a JQUery XML element
function readProjectSettings($xml) {
  var settings = new Object;
  $xml.children().each(function() {
    switch (this.nodeName) {
      case 'title':
        settings.title = this.textContent;
        break;
      case 'language':
        settings.language = this.textContent;
        break;
      case 'eventSounds':
        settings.eventSounds = readEventSounds($(this));
        break;
      case 'skin':
        settings.skin = {
          name: $(this).attr('name'),
          file: $(this).attr('file')};
        break;
    }
  });

  // Other attributes present in the XML element but not loaded:
  // 'description', 'revision', 'author', 'organization'
  // 'descriptors', 'icon', 'locale'

  return settings;
}

// Reads the sequence of JClic activities from a JQUery XML element
function readSequence($xml) {
  var sequence = [];
  $xml.children('item').each(function(i, data) {    
    var $item = $(data);
    var sq = new Object;
    
    $.each($item.get(0).attributes, function() {
      var name = this.name;
      var val = this.value;
      switch (name) {
        case 'id':
        case 'name':
        case 'description':
        // possible navButtons value: 'none', 'fwd', 'back', 'both'
        case 'navButtons':
          sq[name] = val;
          break;
        case 'delay':
          sq[name]=Number(val);
          break;
      };
    });
    
    //sq.jump = {};
    $item.children('jump').each(function() {
      var jmp = readJumpInfo($(this));
      if(!sq.jump)
        sq.jump={};
      sq.jump[jmp.id] = jmp;
    });    
    sequence[i] = sq;
  });
  return sequence;
}

// Reads information about regular and conditional jumps
// in the JClic sequence of activities
function readJumpInfo($xml) {
  var jmp = new Object;

  // Possible 'id' values:
  // - Regular jumps: 'forward', 'back'
  //  -Conditional jumps: 'upper', 'lower'
  jmp.id = $xml.attr('id');

  // Possible 'action' values: 'JUMP', 'STOP', 'RETURN', 'EXIT'
  jmp.action = $xml.attr('action') | 'JUMP';

  jmp.tag = $xml.attr('tag');
  jmp.project = $xml.attr('project');
  jmp.threshold = $xml.attr('threshold');
  jmp.time = $xml.attr('time');

  // Read conditional jumps
  $xml.children('jump').each(function() {
    var condJmp = readJumpInfo($(this));
    jmp.condjmp[condJmp.id] = condJmp;
  });
  return jmp;
}

// Reads the collection of all media elements used in the activities
// from a JQUery XML element
function readMediaBag($xml) {
  var bag = {};
  $xml.children('media').each(function() {
    var m = {
      name: $(this).attr('name'),
      file: $(this).attr('file')};
    // Attributes not loaded: 'save', 'usage'
    bag[m.name] = m;
  });
  return bag;
}

// Read the set of JClic activities from a JQUery XML element
function readActivities($xml) {
  var activities = {};
  $xml.children('activity').each(function() {
    var act = readActivity($(this));
    activities[act.name] = act;
  });
  return activities;
}

// Read a JClic activity from a JQUery XML element
function readActivity($xml) {
  var act = {name: '', class: 'unknown', cells: [], messages: []};

  // Read attributes
  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (name) {
      // Generic attributes:
      case 'name':
      case 'class':
      case 'code':
      case 'type':
        act[name] = val;
        break;
      case 'inverse':
        // Possible 'type' values: 'orderWords', 'orderParagraphs', 'identifyWords', 'identifyChars'      
      case 'autoJump':
      case 'forceOkToAdvance':
      case 'amongParagraphs':
        act[name] = getBoolean(val);
        break;
        // Attributes not loaded:
        // case 'description':
        // break;
    }
  });

  // Read specific nodes
  $xml.children().each(function() {
    var $node = $(this);
    switch (this.nodeName) {
      case 'settings':
        act.settings = readActivitySettings($node);
        break;

      case 'messages':
        $node.children('cell').each(function() {
          var m = readMessage($(this));
          // Possible types: 'initial', 'final', 'previous', 'finalError'
          act.messages[m.type] = m;
        });
        break;

      case 'automation':
        // Read the automation settings ('Arith' or other automation engines)        
        act.automation = readAutomation($node);
        break;

        // Settings specific to panel-type activities (puzzles, associations...)

      case 'cells':
        // Read the collections of cells
        var cellSet = readCellSet($node);
        // Valid ids:
        // - Panel activities: 'primary', 'secondary', solvedPrimary'
        // - Textpanel activities: 'acrossClues', 'downClues', 'answers'
        act.cells[cellSet.id] = cellSet;
        break;

      case 'scramble':
        // Read the 'scramble' mode
        act.scramble = {
          times: Number($node.attr('times')),
          primary: getBoolean($node.attr('primary')),
          secondary: getBoolean($node.attr('secondary'))
        };
        break;

      case 'layout':
        act.layout = {
          // Possible values: 'AB', 'BA', 'AUB', 'BUA'
          position: $node.attr('position') | 'AB'
        };
        // properties specific of CrossWord activities
        if ($node.attr('wildTransparent'))
          act.layout.wildTransparent = getBoolean($node.attr('wildTransparent'));
        if ($node.attr('upperCase'))
          act.layout.upperCase = getBoolean($node.attr('upperCase'));
        if ($node.attr('checkCase'))
          act.layout.checkCase = getBoolean($node.attr('checkCase'));
        break;

        // Elements specific to TextGrid type activities (scrambled letters and crosswords)

      case 'textGrid':
        // Read the 'textGrid' element
        act.textGrid = readTextGrid($node);
        break;

      case 'clues':
        // Read the array of clues
        act.clues = [];
        $node.children('clue').each(function() {
          act.clues[Number($(this).attr('id'))] = this.textContent;
        });
        break;

        // Elements specific to text activities:

      case 'checkButton':
        act.checkButton = this.textContent;
        break;

      case 'prevScreen':
        act.prevScreen = {style: DEFAULT_STYLE, p: ''};
        $node.children().each(function(){
          switch(this.nodeName){
            case 'style':
              act.prevScreen.style = readStyle($(this));
              break;
            case 'p':
              act.prevScreen.p = this.textContent;
              break;
          }
        });
        break;

      case 'evaluator':
        act.evaluator = readEvaluator($node);
        break;

      case 'document':
        // Read main document of text activities
        act.document = readActivityDocument($node);
        break;
    }
  });

  return act;
}

// Read generic and specific settings of activities from a JQuery XML element
function readActivitySettings($xml) {

  var st = {'margin': 8};

  // Read attributes
  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (name) {
      case 'infoUrl':
      case 'infoCmd':
        st[name] = val;
        break;
      case 'useOrder':
      case 'dragCells':
        st[name] = getBoolean(val);
        break;
      case 'margin':
      case 'maxTime':
      case 'maxActions':
        st[name] = Number(val);
        break;
      case 'countDownTime':
      case 'countDownActions':
      case 'report':
      case 'reportActions':
        st[name] = getBoolean(val);
        break;
    }
  });

  // Read settings elements
  $xml.children().each(function() {
    var $node = $(this);
    switch (this.nodeName) {
      case 'skin':
        st.skin = {
          name: $node.attr('name'),
          file: $node.attr('file')};
        break;

      case 'helpWindow':
        st.helpWindow = {
          p: getXmlText(this),
          showSolution: getBoolean($node.attr('showSolution'), false)};
        break;

      case 'container':
        // Read settings related to the 'container'
        // (the main panel containing the activity and other elements)
        st.container = {
          bgColor: checkColor($node.attr('bgColor'), DEFAULT_COLOR.background)
        };
        $node.children().each(function() {
          var $child = $(this);
          switch (this.nodeName) {
            case 'image':
              st.container.image = {
                name: $child.attr('name'),
                tiled: getBoolean($child.attr('tiled'), false)};
              break;
            case 'counters':
              st.container.counters = {
                time: getBoolean($child.attr('time'), true),
                actions: getBoolean($child.attr('actions'), true),
                score: getBoolean($child.attr('score'), true)};
              break;
            case 'gradient':
              st.container.gradient = readGradient($child);
              break;
          }
        });
        break;

      case 'window':
        // Read settings related to the 'window'
        // (the panel where the activity deploys its content)
        st.window = new Object;
        st.window.bgColor = checkColor($node.attr('bgColor'));
        st.window.transparent = getBoolean($node.attr('transparent'), false);
        st.window.border = getBoolean($node.attr('border'), true);
        $node.children().each(function() {
          var $child = $(this);
          switch (this.nodeName) {
            case 'gradient':
              st.window.gradient = readGradient($child);
              break;
            case 'position':
              st.window.position = readPoint($child);
              break;
            case 'size':
              st.window.size = readSize($child);
              break;
          }
        });
        break;

      case 'eventSounds':
        st.eventSounds = readEventSounds($node);
        break;
    }
  });

  return st;
}

// Read 'textGrid' (object used in crosswords and scrambled letters) from XML
function readTextGrid($xml) {
  var textGrid = {
    style: DEFAULT_STYLE, cellWidth: 20, cellHeight: 20, row: [],
    border: true, wild: '*', randomChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (name) {
      case 'rows':
      case 'columns':
      case 'cellWidth':
      case 'cellHeight':
        textGrid[name] = Number(val);
        break;
      case 'border':
        textGrid[name] = getBoolean(val);
        break;
      case 'wild':
      case 'randomChars':
        textGrid[name] = val;
        break;
    }
  });

  $xml.children('style:first').each(function() {
    textGrid.style = readStyle($(this));
  });

  $xml.find('text:first > row').each(function() {
    textGrid.row.push(this.textContent);
  });

  return textGrid;
}

// Read the main document of text activities from XML
function readActivityDocument($xml) {
  var doc = {style: {'default': DEFAULT_DOC_STYLE}, p: []};

  $xml.children('style').each(function() {
    var attr = readDocAttributes($(this));
    doc.style[attr.name] = attr;
  });

  $xml.find('section > p').each(function() {

    var p = {elements: []};

    $.each(this.attributes, function() {
      var name = this.name;
      var value = this.value;
      switch (this.name) {
        case 'style':
          p[name] = value;
          break;
        case 'bidiLevel':
        case 'Alignment':
          p[name] = Number(value);
          break;
      }
    });

    $(this).children().each(function() {
      var obj;

      var $child = $(this);
      switch (this.nodeName) {
        case 'cell':
          obj = readCell($child);
          break;

        case 'text':
          obj = {text: this.textContent};
          var attr = readDocAttributes($child);
          if (!$.isEmptyObject(attr)){
            obj.attr = attr;
          }
          break;

        case 'target':
          obj = {text: this.textContent};
          $child.children().each(function() {
            var $child = $(this);
            switch (this.nodeName) {
              case 'answer':
                obj.answer = this.textContent;
                break;
              case 'optionList':
                obj.optionList = [];
                $child.children('option').each(function() {
                  obj.optionList.push(this.textContent);
                });
                break;
              case 'response':
                obj.response = new Object;
                $.each(this.attributes, function() {
                  switch (this.name) {
                    case 'fill':
                    case 'show':
                      obj.response[this.name] = this.value;
                      break;
                    case 'length':
                    case 'maxLenght':
                      obj[this.name] = Number(this.value);
                      break;
                  }
                });
                break;
              case 'info':
                obj.info = new Object;
                $child.children('cell:first').each(function() {
                  switch (this.nodeName) {
                    case 'cell':
                      obj.info.cell = readCell($(this));
                      break;
                    case 'media':
                      obj.info.media = readMedia($(this));
                      break;
                  }
                });
                obj.info.mode = $child.attr('mode');
                obj.info.delay = Number($child.attr('delay') | 0);
                obj.info.maxTime = Number($child.attr('maxTime') | 0);
                break;
              case 'text':
                obj.text = this.textContent;
                var attr = readDocAttributes($child);
                if (!$.isEmptyObject(attr))
                  obj.attr = attr;
                break;
            }
          });
          break;

        default:
          console.log('Unknown object in activity document: ' + this.nodeName);
      }
      if (obj) {
        obj.objectType = this.nodeName;
        p.elements.push(obj);
      }
    });
    doc.p.push(p);
  });

  return doc;
}

// Read the 'evaluator' object, responsible for evaluation of text activities
function readEvaluator($xml) {
  var eval = new Object;

  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var value = this.value;
    switch (name) {
      case 'class':
        eval[name] = value;
        break;
      case 'checkCase':
      case 'checkAccents':
      case 'checkPunctuation':
      case 'checkDoubleSpaces':
      case 'detail':
        eval[name] = getBoolean(value);
        break;
      case 'checkSteps':
      case 'checkScope':
        eval[name] = Number(value);
        break;
    }
  });

  return eval;
}

// Read attributes of text styles applied to text activity documents
var DEFAULT_DOC_STYLE = {background: 'white', foreground: 'black', 
  family: 'Arial', size: 17,
  css: {'font-family': 'Arial,Helvetica,sans-serif', 'font-size': '17px',
        'margin': '0px', padding: '0px', 'text-align': 'center', 'vertical-align': 'middle'}
};
function readDocAttributes($xml) {
  var attr = new Object;
  var css = {};
  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (name) {
      case 'background':
        val = checkColor(val);
        attr[name] = val;
        css['background'] = val;
        break;
      case 'foreground':
        val = checkColor(val);
        attr[name] = val;
        css['color'] = val;
        break;
      case 'family':
        css['font-family'] = val;
        // Attributes specific to 'styles':
      case 'name':
      case 'base':
      case 'style':
        attr[name] = val;
        break;
      case 'bold':
        val = getBoolean(val);
        attr[name] = val;
        css['font-weight'] = val ? 'bold' : 'normal';
        break;
      case 'italic':
        val = getBoolean(val);
        attr[name] = val;
        css['font-style'] = val ? 'italic' : 'normal';
        break;
      case 'target':
        attr[name] = getBoolean(val);        
        break;
      case 'size':
        attr[name] = Number(val);
        css['font-size'] = val + 'px';
        break;
      case 'tabWidth':
        attr[name] = Number(val);
        break;
      default:
        console.log('Unknown text attribute: ' + name + ': ' + val);
        attr[name] = val;
        break;
    }
  });
  
  if (!$.isEmptyObject(css))
    attr['css'] = css;
  
  return attr;
}

// TODO: Read and implement 'automation' objects
function readAutomation($xml) {
  var automation = {class: $xml.attr('class')};
  // TODO: Read and implement 'Arith' elements:
  // operand A
  // operand B
  // operations
  // unknown
  // result
  return automation;
}

// Read an activity message
function readMessage($xml) {
  var msg = readCell($xml);
  // Allowed types: 'initial', 'final', 'previous', 'finalError'
  msg.type = $xml.attr('type');
  if (isNullOrUndef(msg.style))
    msg.style = DEFAULT_STYLE;
  return msg;
}

// Read a colection of cells from a JQuery XML element
function readCellSet($xml) {
  var cellSet = {id: 'primary', cells: []};

  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (this.name) {
      case 'id':
      case 'image':
        cellSet[name] = val;
        break;
      case 'rows':
      case 'columns':
      case 'cellWidth':
      case 'cellHeight':
        cellSet [name] = Number(val);
        break;
      case 'border':
        cellSet [name] = getBoolean(val);
        break;
    }
  });

  $xml.children().each(function() {
    var $node = $(this);
    switch (this.nodeName) {
      case 'style':
        cellSet.style = readStyle($node);
        break;
      case 'shaper':
        cellSet.shaper = readShaper($node);
        break;
      case 'ids':
        cellSet.ids = this.textContent.split(' ');
        break;
      case 'cell':
        cellSet.cells.push(readCell($node));
        break;
    }
  });
  return cellSet;
}

// Read a cell content form a JQuery XML element
function readCell($xml) {
  var cell = {p: ''};

  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (this.name) {
      case 'id':
      case 'item':
      case 'width':
      case 'height':
        cell [name] = Number(val);
        break;
      case 'txtAlign':
      case 'imgAlign':
        cell [name] = readAlign(val);
        break;
      case 'border':
      case 'avoidOverlapping':
        cell [name] = getBoolean(val);
        break;
      case 'image':
        cell [name] = val;
        break;
    }
  });

  $xml.children().each(function() {
    var $node = $(this);
    switch (this.nodeName) {
      case 'style':
        cell.style = readStyle($node);
        break;
      case 'media':
        cell.media = readMedia($node);
        break;
      case 'p':
        cell.p += '<p>' + this.textContent + '</p>';
        break;
    }
  });

  return cell;
}

// Decode expressions with combined values of horizontal and vertical alugnments
// in the form: "(left|middle|right),(top|middle|bottom)"
function readAlign(str) {
  var align = {h: 'center', v: 'center'};
  if (!isNullOrUndef(str)) {
    var v = str.split(',');
    align.h = v[0].replace('middle', 'center');
    align.v = v[1].replace('middle', 'center');
  }
  return align;
}

// Read a set of color settings
var DEFAULT_COLOR = {foreground: 'black', background: 'lightgray',
  shadow: 'gray', inactive: 'gray', alternative: 'gray', border: 'black'};
function readColor($xml) {
  var color = new Object;
  color.foreground = checkColor($xml.attr('foreground'), DEFAULT_COLOR.foreground);
  color.background = checkColor($xml.attr('background'), DEFAULT_COLOR.background);
  color.shadow = checkColor($xml.attr('shadow'), DEFAULT_COLOR.shadow);
  color.inactive = checkColor($xml.attr('inactive'), DEFAULT_COLOR.inactive);
  color.alternative = checkColor($xml.attr('alternative'), DEFAULT_COLOR.alternative);
  color.border = checkColor($xml.attr('border'), DEFAULT_COLOR.border);
  return color;
}

// Read font data
var DEFAULT_FONT = {family: 'Arial', size: 17, bold: 0, italic: 0};
function readFont($xml) {
  var font = new Object;
  font.family = $xml.attr('family') | DEFAULT_FONT.family;
  font.size = Number($xml.attr('size') | DEFAULT_FONT.size);
  font.bold = getBoolean($xml.attr('bold'), DEFAULT_FONT.bold);
  font.italic = getBoolean($xml.attr('italic'), DEFAULT_FONT.italic);
  return font;
}

// Reads objects of class 'BoxBase' (styles)
var DEFAULT_STYLE = {font: DEFAULT_FONT, shadow: 0, transparent: 0, margin: 6,
  borderStroke: 0.75, markerStroke: 2.75, color: DEFAULT_COLOR};
function readStyle($xml) {
  var style = new Object;
  $.each($xml.get(0).attributes, function() {
    var name = this.name;
    var val = this.value;
    switch (this.name) {
      case 'shadow':
      case 'transparent':
        style [name] = getBoolean(val, DEFAULT_STYLE [name]);
        break;
      case 'margin':
      case 'borderStroke':
      case 'markerStroke':
        style [name] = Number(val) | DEFAULT_STYLE [name];
        break;
    }
  });

  $xml.children().each(function() {
    var $node = $(this);
    switch (this.nodeName) {
      case 'font':
        style.font = readFont($node);
        break;
      case 'gradient':
        style.gradient = readGradient($node);
        break;
      case 'color':
        style.color = readColor($node);
        break;
    }
  });

  return style;
}

// Read a gradient specifiaction
function readGradient($xml) {
  var gradient = new Object;
  gradient.source = checkColor($xml.attr('source'));
  gradient.dest = checkColor($xml.attr('dest'));
  gradient.angle = Number($xml.attr('angle') || 0);
  gradient.cycles = Number($xml.attr('cycles') || 1);
  return gradient;
}

// Read a 'shaper' specification
function readShaper($xml) {
  var shaper = {class: '@Rectangular', cols: 1, rows: 1};

  // Read attributes
  $.each($xml.get(0).attributes, function() {
    switch (this.name) {
      case 'class':
        shaper [this.name] = this.value;
        break;
      case 'cols':
      case 'rows':
      case 'baseWidthFactor':
      case 'toothHeightFactor':
      case 'scaleX':
      case 'scaleY':
        shaper [this.name] = Number(this.value);
        break;
      case 'randomLines':
      case 'showEnclosure':
        shaper [this.name] = getBoolean(this.value, true);
        break;
    }
  });

  // Reads the 'enclosing'
  // (main shape area where the other shape elements are placed)
  $xml.children('enclosing:first').each(function() {
    $(this).children('shape:first').each(function(data) {
      shaper.enclosing = readShapeData(this)[0];
    });
  });

  // Read the shape elements
  shaper.sh = [];
  $xml.children('shape').each(function(i, data) {
    shaper.sh[i] = readShapeData(data);
  });
  
  // Correction needed for '@Holes' shaper
  if(shaper.sh.length>0){
    shaper.rows = shaper.sh.length;
    shaper.cols = 1;
  }

  return shaper;
}

// Reads shape definitions from xml elements
function readShapeData(xml) {
  var shd = [];
  $.each(xml.textContent.split('|'), function() {
    var stroke = new Object;
    var sd = this.split(':');
    // Possible strokes: 'rectangle', 'ellipse', 'M', 'L', 'Q', 'B', 'X'
    // Also possible, but not currently used in JClic: 'roundRectangle' and 'pie'
    stroke.action = sd[0];
    if (sd.length > 1) {
      stroke.data = sd[1].split(',');
    }
    shd.push(stroke);
  });
  return shd;
}

// Read a 'media' specification (sound, video, MIDI...)
function readMedia($xml) {
  // Available 'type' types: "UNKNOWN", "PLAY_AUDIO", "PLAY_VIDEO", "PLAY_MIDI",
  // "PLAY_CDAUDIO", "RECORD_AUDIO", "PLAY_RECORDED_AUDIO", "RUN_CLIC_ACTIVITY",
  // "RUN_CLIC_PACKAGE", "RUN_EXTERNAL", "URL", "EXIT", "RETURN"
  var media = {type: 'UNKNOWN'};

  $.each($xml.get(0).attributes, function() {
    var val = this.value;
    switch (this.name) {
      case 'type':
      case 'file':
      case 'params':
      case 'pFrom':
        // Available 'pFrom' values: 'BOX', 'WINDOW', 'FRAME'
        media [name] = val;
        break;

      case 'level':
      case 'from':
      case 'to':
      case 'cdFrom':
      case 'cdTo':
      case 'buffer':
      case 'length':
      case 'px':
      case 'py':
        media [name] = Number(val);
        break;

      case 'stretch':
      case 'free':
      case 'catchMouseEvents':
      case 'loop':
      case 'autostart':
        media [name] = getBoolean(val);
        break;
    }
  });
  return media;
}

// Read a set of event sounds
function readEventSounds($xml) {
  var eventSounds = [];
  $xml.children().each(function() {
    eventSounds[this.nodeName] = {
      file: $(this).attr('file'),
      enabled: getTriState($(this).attr('enabled'))};
  });
  return eventSounds;
}
