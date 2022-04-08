/* delayed-mts
 * Mathias Sablé-Meyer
 *
 * delayed-mts
 * documentation: docs.jspsych.org and mathias.sable-meyer@ens-cachan.fr
 *
 *
 */

jsPsych.plugins['delayed-mts'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'delayed-mts',
    description: '',
    parameters: {
      reference: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'reference',
        default: undefined,
        array: true,
        description: 'The reference image to be revealed.'
      },
      distractors: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Distractors',
        default: undefined,
        array: true,
        description: 'The images to be displayed.'
      },
      delay: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Delay",
        default: 200,
        array: true,
        description: 'Delay between presentation and choice'
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    var response = {
      encoding_time: null,
      choice_time: null,
      response: null
    };
    var rt_ref, ref;
    var lt = null;

    function clean_screen() {
      display_element.innerHTML = '';
      try {
        document.removeEventListener("keydown", handle_kb_down);
        document.removeEventListener("keyup", handle_kb_up);
      }
      catch (e) {
        console.log(e);
      }
    }

    function choice_made(n, tbl) {
      var tbody =  tbl.tBodies[0];
      for (var j = 0; j < tbody.rows.length; j++) {
        var row = tbody.rows[j];
        for (var k = 0; k < row.cells.length; k++) {
          var cell = row.cells[k];
          cell.style.opacity = "0.25";
          cell.onclick = function() { };
        }
      }
      n.style.opacity = "1";
      n.style.boxShadow = "inset 0px 0px 0px 5px black";
      setTimeout(end_trial, 500);
    }

    function record_choice(n, tbl) {
      var choice_time = (performance.now()) - rt_ref;
      if (choice_time > 200) {
        response.choice_time = choice_time;
        response.response = n.childNodes[0].innerHTML;
        choice_made(n, tbl)
      }
    }

    function handle_kb_down(event) {
      if (event.keyCode == 32) {
        frame.innerHTML = trial.reference;

        if (lt === null) {
          lt = performance.now();
        }
      }
    }

    function handle_kb_up(event) {
      if (event.keyCode == 32 && lt != null) {
        response.encoding_time = performance.now() - lt;
        clean_screen();
        screen_choice();
      }
    }

    function screen_reveal() {

      frame = document.createElement('div');
      frame.id = "reveal_div";
      frame.style.fontSize = "24px";

      frame.innerHTML = "Gardez la barre d’<strong>espace</strong> appuyée <strong>aussi longtemps que nécessaire</strong> pour mémoriser la forme";

      display_element.appendChild(frame);

      document.addEventListener("keydown", handle_kb_down);
      document.addEventListener("keyup", handle_kb_up);
    }

    function screen_choice() {
      var tbl = document.createElement('table');
      var tbdy = document.createElement('tbody');
      tbdy.style.opacity = "0.001";
      var tr;
      for (var row = 0; row < 2 ; row++) {
        tr = document.createElement('tr');
        for (var col = 0; col < 3 ; col++) {
          td = document.createElement('td');
          td.draggable = false;
          td.innerHTML = trial.distractors[row*3+col];
          //td.style.padding = "20px";
          td.style.fontSize = "24px";
          td.style.height = "200px";
          td.style.width = "200px";
          td.style.cursor = "default";
          td.onclick = function(id) {
            return function() { record_choice(id, tbl); };
          }(td, tbl);
          tr.appendChild(td);
        }
        tbdy.appendChild(tr);
      }
      tbl.appendChild(tbdy);


      display_element.appendChild(tbl);

      setTimeout(function() {
        tbdy.style.opacity = "1";
        rt_ref = performance.now();
      }, trial.delay);
    }

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();
      var trialdata = Object.assign({}, trial);

      trialdata.encoding_time = response.encoding_time;
      trialdata.responses = response.response,
      trialdata.choice_time = response.choice_time;

      display_element.innerHTML = '';

      jsPsych.finishTrial(trialdata);
    }

    screen_reveal();

  };

  return plugin;

})();
