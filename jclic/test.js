// Proves

$(document).ready(function() {

  $.get('demo.jclic', function(data) {

    var jclic = getJClic($(data).find('JClicProject'));    
    //$('#debug').html(JSON.stringify(jclic, false, true));
    
    var player = getJClicPlayer(jclic, $('#main'), $('#initial'));
    $('#nextBtn').click(player.nextActivity);
    $('#prevBtn').click(player.prevActivity);

    $('#prjSettings #name').html(jclic.project.name);
    $('#prjSettings #version').html(jclic.project.version);
    $('#prjSettings #type').html(jclic.project.type);
    $('#prjSettings #code').html(jclic.project.code);

    $.each(jclic.project.activities, function(name, act) {
      $('#selector')
              .append('<option value="' + name + '">' + name + ' (' + act.class + ')</option>');
    });

    $('#selector').change(function() {
      var act = jclic.project.activities[$('#selector option:selected').val()];
      $('#prjSettings #actName').html(act.name);
      player.playActivity(act);
    });
  });
});
