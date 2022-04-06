/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

// MS: added validation based on SM's survey-multi-choice modifications

jsPsych.plugins['survey-likert'] = (function() {

    var plugin = {};
    var trial_data = {};

    plugin.trial = function(display_element, trial) {

        // default parameters for the trial
        trial.preamble = typeof trial.preamble === 'undefined' ? "" : trial.preamble;
        trial.button_text = typeof trial.button_text === 'undefined' ? "Submit answers" : trial.button_text;

        // if any trial variables are functions
        // this evaluates the function and replaces
        // it with the output of the function
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // show preamble text
        display_element.append($('<div>', {
            "id": 'jspsych-survey-likert-preamble',
            "class": 'jspsych-survey-likert-preamble'
        }));

        $('#jspsych-survey-likert-preamble').html(trial.preamble);

        display_element.append('<form id="jspsych-survey-likert-form">');
        // add likert scale questions
        for (var i = 0; i < trial.questions.length; i++) {
            form_element = $('#jspsych-survey-likert-form');
            // add question
            form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>');
            // add options
            var width = 100 / trial.labels[i].length;
            options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
            for (var j = 0; j < trial.labels[i].length; j++) {
                options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
            }
            options_string += '</ul>';
            form_element.append(options_string);
        }

        // SM: prepare validation dialog box
        display_element.append($('<div>', {
            "id": 'jspsych-validation-dialog-multi-choice',
            "class" : 'jspsych-validation-dialog'
        }))

        var theDialog = 
            $('#jspsych-validation-dialog-multi-choice').dialog({
                autoOpen: false,
                buttons: [
                    { text: "Continue without answering",
                        click: function() {
                            $(this).dialog("close");
                            display_element.html('');
                            jsPsych.finishTrial(trial_data);
                        }
                    },
                    { text: "Answer the question",
                        click: function(){
                            $(this).dialog("close");
                        }
                    }
                ],
                closeOnEscape: false,
                modal: true,
                dialogClass: "jspsych-validation-dialog-ui",
                resizable: false,
                minWidth: 500,
                title: "Incomplete page"
            });


        // add submit button
        display_element.append($('<input>', {
            'type': 'submit',
            'id': 'jspsych-survey-likert-next',
            'class': 'jspsych-survey-likert jspsych-btn',
            'value': trial.button_text
        }));

        $("#jspsych-survey-likert-next").html(trial.button_text);
        $("#jspsych-survey-likert-next").click(function() {

            toContinue = true

            // measure response time
            var endTime = (new Date()).getTime();
            var response_time = endTime - startTime;

            // create object to hold responses
            var question_data = {};
            $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
                var id = $(this).data('radio-group');
                var response = $('input[name="' + id + '"]:checked').val();
                if (typeof response == 'undefined') {
                    response = -1;
                    toContinue = false
                }
                var obje = {};
                obje[id] = response;
                $.extend(question_data, obje);
            });

            // save data
            trial_data = {
                "rt": response_time,
                "responses": JSON.stringify(question_data)
            };

            if (toContinue) {

                display_element.html('');

                // next trial
                jsPsych.finishTrial(trial_data);
            }
            else {
                theDialog.html("<p>You haven't answered every question on this page.</p>")
                theDialog.dialog("open");
            }
        });

        var startTime = (new Date()).getTime();
    };

    return plugin;
})();
