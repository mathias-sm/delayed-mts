/**
 * jspsych-survey-slider
 * a jspsych plugin for measuring items on a slider scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['jspsych-survey-slider'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-slider',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {type: jsPsych.plugins.parameterType.STRING,
                     pretty_name: 'Prompt',
                     default: undefined,
                     description: 'Questions that are associated with the slider.'},
          labels: {type: jsPsych.plugins.parameterType.STRING,
                   array: true,
                   pretty_name: 'Labels',
                   default: undefined,
                   description: 'Labels to display for individual question.'},
          required: {type: jsPsych.plugins.parameterType.BOOL,
                     pretty_name: 'Required',
                     default: false,
                     description: 'Makes answering questions required.'}
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'String to display at top of the page.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {


    var html = "";

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-slider-preamble" class="jspsych-survey-slider-preamble">'+trial.preamble+'</div>';
    }

    html += "<div id='no-more-than-400'>";

    // add slider scale questions
    for (var i = 0; i < trial.questions.length; i++) {
      // add question
      html += '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
      html += '<label class="jspsych-survey-slider-statement">' + trial.questions[i].prompt + '</label>';
      html += '<div class="jspsych-html-slider-response-container" style="position:relative;">';
      //html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-html-slider-response-response"></input>';
      html += "<div class='slider' id='slider-" + i + "'></div>";
      html += '<div>'
      for(var j=0; j < trial.questions[i].labels.length; j++){
        var width = 100/(trial.questions[i].labels.length-1);
        var left_offset = (j * (100 /(trial.questions[i].labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">'+trial.questions[i].labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }

    html += "</div>";


    // add submit button
    html += '<form id="jspsych-survey-slider-form">';
    html += '<input type="submit" id="jspsych-survey-slider-next" class="jspsych-survey-slider jspsych-btn" value="'+trial.button_label+'"></input>';
    html += '</form>'

    display_element.innerHTML = html;
    //$(".slider").slider()
    for (var i = 0; i < trial.questions.length; i++) {
      $("#slider-"+i).slider()
      $("#slider-"+i).find('.ui-slider').click(function() {
        alert("toto");
      });
      //$("#slider-"+i).find('.ui-slider-handle').hide();
    }

    window.scrollTo(0,0);

    display_element.querySelector('#jspsych-survey-slider-form').addEventListener('submit', function(e){
      e.preventDefault();
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var answers = new Array;
      var matches = display_element.querySelectorAll('#jspsych-html-slider-response-response');
      for(var index = 0; index < matches.length; index++){
        answers.push(matches[index].value)
      }
      Object.assign(question_data, answers);

      // save data
      var trial_data = {
        "rt": response_time,
        "responses": answers
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
