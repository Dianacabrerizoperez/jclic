/* 
 * Copyright (C) 2014 fbusquet
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

// The 'player' object takes a 'jclic' object as a main component and provides 
// methods to put the content of activities on stage and interact with it.
// jclic: A "jclic" object created by the getJClic() function
// $mainArea: The JQuery DOM object where the activities will be shown
// $msgBox: The JQuery DOM object where messages will be shown
function getJClicPlayer(JClic, $mainArea, $msgBox) {

  var player = {
    jclic: JClic,
    mainArea: $mainArea.addClass('jclic-main-area'),
    msgBox: $msgBox.addClass('jclic-msg-area'),
    playArea: null
  };
  
  var seqStack = [];
  var seqPointer = -1;

  // Puts a JClic activity on stage
  player.playActivity = function(act) {

    // Clear current content
    player.mainArea.empty().removeAttr('style');
    player.msgBox.empty().removeAttr('style');
    player.playArea = $('<div/>');
    player.playArea.appendTo(player.mainArea);

    // Set main area background
    var bgImageUrl = '';
    if (act.settings.container) {
      var css = {'background-color': act.settings.container.bgColor};
      if(act.settings.container.gradient){
        css['background-image'] = getGradientCSS(act.settings.container.gradient);
      }
      if (act.settings.container.image) {
        bgImageUrl = player.jclic.project.mediaBag[act.settings.container.image.name].file;
        var repeat = act.settings.container.image.tiled ? 'repeat' : 'no-repeat';
        css['background-image'] = 'url(\'' + bgImageUrl + '\')';
        css['background-repeat'] = repeat;
        if (repeat === 'no-repeat')
          css['background-position'] = 'center center';
        else
          bgImageUrl = ''; // clear bgImageUrl to avoid relative positioning
      }
      player.mainArea.css(css);
    }

    // Set play area settings
    if (act.settings.window) {
      var css = {display: 'block', 'background-color': act.settings.window.transparent
                ? 'transparent'
                : act.settings.window.bgColor};
      css['border'] = act.settings.window.border ? 'solid' : 'none';

      if(act.settings.window.gradient){
        css['background-image'] = getGradientCSS(act.settings.window.gradient);
      }

      // Compute position of player window
      if (act.settings.window.position) {
        var x = act.settings.window.position.x;
        var y = act.settings.window.position.y;

        // If mainArea has a background image not tiled,
        // this image will be centered on mainArea, and playArea position
        // will be relative to it
        if (bgImageUrl !== '') {
          var mainWidth = player.mainArea.innerWidth();
          var mainHeight = player.mainArea.innerHeight();

          //create image to preload:
          var imgPreload = new Image();
          $(imgPreload).attr({src: bgImageUrl});

          //check if the image is already loaded (cached):
          if (imgPreload.complete || imgPreload.readyState === 4) {
            x += Math.max((mainWidth - imgPreload.width) / 2, 0);
            y += Math.max((mainHeight - imgPreload.height) / 2, 0);
          } else {
            //go fetch the image:
            $(imgPreload).load(function(response, status, xhr) {
              if (status === 'error') {
                //image could not be loaded:
              } else {
                x += Math.max((mainWidth - imgPreload.width) / 2, 0);
                y += Math.max((mainHeight - imgPreload.height) / 2, 0);
                player.playArea.css({left: x, top: y});
              }
            });
          }
        }

        css['position'] = 'relative';
        css['left'] = x;
        css['top'] = y;
      }

      if (act.settings.window.size) {
        css['width'] = act.settings.window.size.width + 16;
        css['height'] = act.settings.window.size.height + 16;
      }

      player.playArea.css(css);
    }

    // Places the activity elements inside playArea    
    switch (act.class) {
      case '@associations.ComplexAssociation':
      case '@associations.SimpleAssociation':
      case '@memory.MemoryGame':
      case '@panels.Explore':
      case '@panels.Identify':
      case '@panels.InformationScreen':
      case '@puzzles.DoublePuzzle':
      case '@puzzles.ExchangePuzzle':
      case '@puzzles.HolePuzzle':
      case '@text.Complete':
      case '@text.FillInBlanks':
      case '@text.Identify':
      case '@text.Order':
      case '@text.WrittenAnswer':
      case '@textGrid.CrossWord':
      case '@textGrid.WordSearch':
        break;
    }

    var $primaryPanel, $secondaryPanel, $solvedPrimaryPanel, $docPanel, $textGridPanel;

    if (act.cells['primary']) {
      $primaryPanel = $('<div/>');
      $primaryPanel.appendTo(player.playArea);
      player.jclic.setGridContent($primaryPanel, act.cells['primary'], DEFAULT_STYLE);
    }

    if (act.cells['secondary']) {
      $secondaryPanel = $('<div/>');
      $secondaryPanel.appendTo(player.playArea);
      player.jclic.setGridContent($secondaryPanel, act.cells['secondary'], DEFAULT_STYLE);
    }

    if (act.cells['solvedPrimary']) {
      $solvedPrimaryPanel = $('<div/>');
      $solvedPrimaryPanel.appendTo(player.playArea);
      player.jclic.setGridContent($solvedPrimaryPanel, act.cells['solvedPrimary'], DEFAULT_STYLE);
    }

    if (act.document) {
      $docPanel = $('<div/>');
      $docPanel.appendTo(player.playArea);
      player.jclic.setDocContent($docPanel, act.document);
    }
    
    if(act.textGrid) {
      $textGridPanel = $('<div/>');
      $textGridPanel.appendTo(player.playArea);
      player.jclic.setTextGridContent($textGridPanel, act.textGrid);
    }

    player.jclic.setCellContent(player.msgBox, act.messages['initial'], DEFAULT_STYLE);

  };
    
  // TODO: read seq properties!
  player.getJumpActivity = function(forward) {
    var activity = null;    
    var seq = player.jclic.project.sequence[seqPointer>=0 ? seqPointer : 0];
    
    if(seqPointer<0) {
      seqPointer=0;
    } else {
      
      if(seq.jump) {
        var jumpInfo = seq.jump[forward ? 'forward' : 'back'];
        if(jumpInfo===null)
          seqPointer += (forward ? 1 : -1);
        else{
          // TODO: Implement jump commands
          switch(jumpInfo.action){
            case 'STOP':
              return null;            
              
            case 'JUMP':
              break;
            
            case 'RETURN':
              break;
            
            case 'EXIT':
              return null;
            
            default:
              seqPointer += (forward ? 1 : -1);              
              break;
          }
        }
      }
      else
        seqPointer += (forward ? 1 : -1);
      
      seqPointer = Math.max(0, Math.min(player.jclic.project.sequence.length-1, seqPointer));
      seq = player.jclic.project.sequence[seqPointer];
    }
        
    return player.jclic.project.activities[seq.name];
  };

  player.nextActivity = function() {
    var act = player.getJumpActivity(true);
    if(act!==null){
      player.playActivity(act);
    }
  };
  
  player.prevActivity = function() {
    var act = player.getJumpActivity(false);
    if(act!==null){
      player.playActivity(act);
    }
  };
  
  JClic.initMedia();
  return player;
}