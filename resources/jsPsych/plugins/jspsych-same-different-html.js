/**
 * jspsych-same-different
 * Josh de Leeuw modified by Mathias Sablé-Meyer
 *
 * plugin for showing two stimuli sequentially and getting a same / different judgment
 * Free viewing duration for stim1
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['same-different-html'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'same-different-html',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The HTML content to be displayed.'
      },
      answer: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Answer',
        options: ['same', 'different'],
        default: undefined,
        description: 'Either "same" or "different".'
      },
      same_key: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Same key',
        default: 'q',
        description: ''
      },
      different_key: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Different key',
        default: 'p',
        description: 'The key that subjects should press to indicate that the two stimuli are the same.'
      },
      first_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'First stimulus duration',
        default: 300,
        description: 'How long to show the first stimulus for in milliseconds. If null, then the stimulus will remain on the screen until any keypress is made.'
      },
      gap_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Gap duration',
        default: 500,
        description: 'How long to show a blank screen in between the two stimuli.'
      },
      mask_string: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Mask string',
        default: "xxxxxxxx",
        description: 'A string used to mask the first word'
      },
      second_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Second stimulus duration',
        default: null,
        description: 'How long to show the second stimulus for in milliseconds. If null, then the stimulus will remain on the screen until a valid response is made.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    if (self_paced) {
      trial.first_stim_duration = null;
    }
    if (!masked) {
      trial.mask_string = null;
    }

    display_element.innerHTML = '<div class="jspsych-same-different-stimulus">Press <strong class="second">spacebar</strong> to start</div>';

    var first_stim_info = {};
    function handle_kb_down(event) {
      if (event.keyCode == 32) {
        display_element.innerHTML = '<div class="jspsych-same-different-stimulus">'+trial.stimuli[0]+'</div>';

        if (first_stim_info.rt === undefined) {
          first_stim_info.rt = performance.now();
        }

        if (!self_paced) {
          jsPsych.pluginAPI.setTimeout(function() {
            end_first_stim();
          }, trial.first_stim_duration);
        }
      }
    }

    function handle_kb_up(event) {
      if (event.keyCode == 32 && first_stim_info.rt != undefined) {
        end_first_stim();
      }
    }

    function end_first_stim() {
        first_stim_info.rt = performance.now() - first_stim_info.rt;
        if (masked) {
          display_element.innerHTML = trial.mask_string;
        } else {
          display_element.innerHTML = '';
        }

        jsPsych.pluginAPI.setTimeout(function() {
          showSecondStim();
        }, trial.gap_duration);

        document.removeEventListener("keydown", handle_kb_down);
        if (self_paced) {
          document.removeEventListener("keyup", handle_kb_up);
        }
    }

    function showSecondStim() {

      var html = '<div class="jspsych-same-different-stimulus">'+trial.stimuli[1]+'</div>';
      //show prompt here
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;

      if (trial.second_stim_duration > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('.jspsych-same-different-stimulus').style.visibility = 'hidden';
        }, trial.second_stim_duration);
      }



      var after_response = function(info) {

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        var correct = false;

        var skey = trial.same_key;
        var dkey = trial.different_key;

        if (jsPsych.pluginAPI.compareKeys(info.key, skey) && trial.answer == 'same') {
          correct = true;
        }

        if (jsPsych.pluginAPI.compareKeys(info.key, dkey) && trial.answer == 'different') {
          correct = true;
        }

        var trial_data = trial;
        trial_data.rt = info.rt;
        trial_data.answer = trial.answer;
        trial_data.correct = correct;
        trial_data.response = info.key;
        trial_data.encoding_time = first_stim_info.rt;

        delete trial_data.stimuli;

        display_element.innerHTML = '';

        jsPsych.finishTrial(trial_data);
      }

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.same_key, trial.different_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

    }

    document.addEventListener("keydown", handle_kb_down);
    if (self_paced) {
      document.addEventListener("keyup", handle_kb_up);
    }

  };

  return plugin;
})();
