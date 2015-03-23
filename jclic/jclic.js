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

// Global var used to make unique ids
var IDCounter=0;

function getJClic($xml) {

  var jclic = {
    project: readJClicProject($xml)
  };

  // Applies the settings defined in 'cell' to a specific JQuery object
  jclic.setCellContent = function($domObject, cell, defaultStyle) {

    var html = '';
    var css = {display: 'block'};

    if (cell) {
      if (cell.p) {
        html = cell.p;
      }
      if (cell.image) {

        // Read image filename from mediaBag
        var imgFile = jclic.project.mediaBag[cell.image].file;

        if (cell.avoidOverlapping) {
          // TODO: scale and place the image inside the cell
          html += '<img src="' + imgFile + '" style="margin: 0; display: block;">';
        }
        else {
          css['background-image'] = 'url(' + imgFile + ')';
          css['background-repeat'] = 'no-repeat';
          css['background-size'] = 'contain';
          var h = 'center', v = 'center';
          if (cell.imgAlign) {
            h = cell.imgAlign.h;
            v = cell.imgAlign.v;
          }
          css['background-position'] = h + ' ' + v;
        }

      }

      // TODO: Move conditionals to 'readCell' and 'readStyle' functions

      if (cell.style) {
        jclic.setStyle($domObject, cell.style, defaultStyle);
      }
      else if (defaultStyle) {
        $domObject.removeAttr('style');
        jclic.setStyle($domObject, defaultStyle);
      }

      css['text-align'] = cell.txtAlign ? cell.txtAlign.h : 'center';
      if (cell.txtAlign && cell.txtAlign.v !== 'middle') {
        $domObject.removeClass('vCentered');
        // Other aligns
      } else {
        $domObject.addClass('vCentered');
      }


      if (cell.border) {
        css['border'] = cell.border + 'px solid ' + css['color'] ? cell.style.color.border : 'black';
      }
      if (cell.width) {
        css['width'] = cell.width + 'px';
      }
      if (cell.height) {
        css['height'] = cell.height + 'px';
      }
    }

    $domObject.html(html).css(css);
    //$domObject.data(cell);

    return $domObject;

  };

  // Fills the DOM object with the content of the JClic document 'doc'
  jclic.setDocContent = function($domObject, doc) {

    $domObject.empty();

    var $html = $('<div/>');

    $html.css(doc.style['default'].css);

    $.each(doc.p, function() {
      var $p = $('<p/>');
      var empty = true;
      if (this.style)
        $p.css(doc.style[this.style].css);
      if (this.Alignment) {
        var al = Number(this.Alignment);
        $p.css({'text-align': al === 1 ? 'center' : al === 2 ? 'right' : 'left'});
      }

      $.each(this.elements, function() {
        var $span = $('<span/>');
        switch (this.objectType) {
          case 'text':
            if (this.attr) {
              $span.html(this.text);
              if (this.attr.style)
                $span.css(doc.style[this.attr.style].css);
              if (this.attr.css)
                $span.css(this.attr.css);
              $p.append($span);
            } else {
              $p.append(this.text);
            }
            break;
          case 'cell':
            jclic.setCellContent($span, this);
            $span.css({'display': 'inline-block', 'vertical-align': 'middle'});
            $p.append($span);
            break;
          case 'target':
            $span.html(this.text);
            if (this.attr) {
              if (isNullOrUndef(this.attr.style))
                this.attr.style = 'target';
              $span.css(doc.style[this.attr.style].css);
              if (this.attr.css)
                $span.css(this.attr.css);
            }
            $p.append($span);
            break;
        }
        empty = false;
      });

      if (empty)
        $p.html('&nbsp;');

      $html.append($p);
    });

    $domObject.append($html);
    return $domObject;
  };

  // Applies a specific 'style' to a DOM object
  jclic.setStyle = function($domObject, style, defaultStyle) {

    var css = {};

    if (defaultStyle) {
      $domObject.removeAttr('style');
      jclic.setStyle($domObject, defaultStyle);
    }

    if (style.font) {
      if (style.font.family)
        css['font-family'] = style.font.family;
      if (style.font.size)
        css['font-size'] = style.font.size + 'px';
      if (style.font.bold)
        css['font-weight'] = style.font.bold ? 'bold' : 'normal';
      if (style.font.italic)
        css['font-style'] = style.font.italic ? 'italic' : 'normal';
    }
    if (style.color) {
      if (style.color.foreground)
        css['color'] = style.color.foreground;
      if (style.color.background && !style.transparent)
        css['background-color'] = style.color.background;      
    }
    if(style.transparent){
      css['background-color']='transparent';
    }      
    if (style.gradient && !style.transparent) {
      css['background-image'] = getGradientCSS(style.gradient);
    }
    if (style.shadow === 1) {
      var delta = Math.max(1, Math.round(style.font.size / 10));
      var color = style.color ? style.color.shadow : DEFAULT_COLOR.shadow;
      css['text-shadow'] = delta + 'px ' + delta + 'px 3px ' + color;
    }


    $domObject.css(css);
    return $domObject;
  };

  // Fills a grid with the cells defined in 'cellSet'
  jclic.setGridContent = function($domObject, cellSet, defaultStyle) {
    if (cellSet.image) {
      var img = new Image();
      img.onload = function() {
        jclic.setGridContent2($domObject, cellSet, defaultStyle, this.width, this.height);
      };
      img.src = jclic.project.mediaBag[cellSet.image].file;
    } else {
      jclic.setGridContent2($domObject, cellSet, defaultStyle);
    }
    return $domObject;
  };

  // Main function, called when the background image is loaded
  jclic.setGridContent2 = function($domObject, cellSet, defaultStyle, imgW, imgH) {

    $domObject.empty();
    $domObject.removeAttr('style');

    if (cellSet.style)
      jclic.setStyle($domObject, cellSet.style, defaultStyle);
    else if (defaultStyle) {
      jclic.setStyle($domObject, defaultStyle);
    }

    var styleBase = cellSet.style ? cellSet.style : defaultStyle;

    var img = cellSet.image ? 'url(' + jclic.project.mediaBag[cellSet.image].file + ')' : null;
    // TODO: read width and height of image!!
    var cw = cellSet.cellWidth ? cellSet.cellWidth : imgW / cellSet.shaper.cols;
    var ch = cellSet.cellHeight ? cellSet.cellHeight : imgH / cellSet.shaper.rows;
    
    var width=cw * cellSet.shaper.cols;
    var height=ch * cellSet.shaper.rows;
    
    $domObject.css({
      'position': 'relative',
      'width': width,
      'height': height
    });
    
    var baseID=IDCounter++;
    $domObject.append(getSVGshapes(cellSet.shaper, width, height, baseID));    

    var isHoles = (cellSet.shaper.class === '@Holes');
    if(isHoles && img!== null){
      cw=imgW;
      ch=imgH;
    }
    var i = 0;
    for (var y = 0; y < cellSet.shaper.rows; y++) {
      for (var x = 0; x < cellSet.shaper.cols; x++, i++) {
        var cell = i < cellSet.cells.length ? cellSet.cells[i] : null;
        var px = isHoles ? 0 : x * cw;
        var py = isHoles ? 0 : y * ch;
        var $cell = $('<span/>');
        //var $cell = $(SVG('span'));
        if (cell !== null)
          jclic.setCellContent($cell, cell, styleBase);
        var css = {
          display: 'block',
          position: 'absolute',
          left: px,
          top: py,
          width: cw,
          height: ch,
          'clip-path': 'url(#'+baseID+'_'+i+')',
          '-webkit-clip-path': 'url(#'+baseID+'_'+i+')'
        };
        if (img !== null) {
          css['background-image'] = img;
          css['background-repeat'] = 'no-repeat';
          css['background-origin'] = 'border-box';
          css['background-position'] = -px + 'px ' + -py + 'px';
        }
        $cell.css(css).appendTo($domObject);
        $cell.draggable();
        //var rect=$cell[0].getBoundingClientRect();
        //console.log("RECT: "+rect.left+", "+rect.top+", "+rect.right+", "+rect.bottom);
        var rect=$('#'+baseID+'_'+i)[0].getBBox();
        console.log("RECT: "+rect.x+", "+rect.y+", "+rect.width+", "+rect.height);
      }
    }
    return $domObject;
  };


  jclic.setTextGridContent = function($domObject, textGrid, style) {
    
    $domObject.empty();
    $domObject.removeAttr('style');
    
    var $table=$('<table/>');
    $table.attr('border', textGrid.border ? 0 : textGrid.border);
    $.each(textGrid.row, function(index, row){
      var $row=$('<tr/>');
      for(i=0; i<row.length;i++){
        $('<td>'+row.charAt(i)+'</td>').appendTo($row);
      };
      $row.appendTo($table);
    });
    $table.appendTo($domObject);
    
    return $domObject;    
  };



  // Initialises the media files used in the project
  jclic.initMedia = function() {

    $.each(this.project.mediaBag, function() {

      var name = this.name;
      var file = this.file;
      var ext = file.toLowerCase().split('.').pop();

      switch (ext) {
        case 'ttf':
          // Preload truetype fonts
          $('head').prepend(
                  '<style type="text/css">' +
                  '@font-face{font-family:"' + name + '";src:url(' + file + ') format("truetype");}' +
                  '</style>');
          break;
      }
    });
  };

  return jclic;
}