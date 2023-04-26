// Generate a random subject ID and add it to jsPsych's data to be saved
var subjectID = jsPsych.randomization.randomID(10);
jsPsych.data.addProperties({'ID': subjectID});

// The consent block, which points to the consent PAGE
var consent = {
  type:'external-html',
  url: "external-consent.html",
  cont_btn: "start"
};

// TODO change this Instructions --- text declared in another file
var instructions = {
  type:'instructions',
  show_clickable_nav: true,
  pages: ["<h1>Instructions</h1><div id='instructions'><p>In this experiment, you need to memorize a string of letters and then identify it among other similar strings. For this :</p><ol><li>Press '"+same_key+"' to indicate that the words are the same</li></ol><p>Thank you for your participation and please remain concentrated!</p></div>"]
};

// Declare the demographic questionaire block. If this gets too long one could
// put the data into yet another file.
var survey = {
  type: "survey-dropdown",
  preamble: "A questionnaire",
  questions: [
    { prompt: "Age", htmlType: "number" },
    {
      prompt: "Highest level of education",
      options: [ "Primary school", "Middle school", "High school", "B.A.", "Master", "Doctorat", ],
      labels: [ "PrimarySchool", "MiddleSchool", "HighSchool", "Ba", "Ms", "PhD", ],
    },
  ],
  button_label: "Continuer",
};

var resize = {
  type: 'resize',
  item_width: 3 + 3/8,
  item_height: 2 + 1/8,
  prompt: "<p>Click and drag the lower right corner of the box until the box is the same size as a credit card held up to the screen.</p>",
};

var freeform_answer = {
  type: 'survey-text',
  questions: [{prompt: "<p>You can write any comment regarding the experiment in the field below, but make sure not to reveal your identity.</p>", rows: 3}],
};

function SaveData(project, filename, filedata) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/msm/save-data.php');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.responseText !== "GOT IT") {
        // document.body.innerHTML += xhr.responseText;
    }
    else if (xhr.status !== 200) {
        //alert('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send(encodeURI('project=' + project+'&filename=' + filename+'&filedata=' + filedata));
}

wait_load = function() {
  if (finished_loading) {
    jsPsych.init({
      timeline: (debug ? [].concat(resize, task) : [].concat(consent, survey, resize, instructions, task, freeform_answer)),
      show_progress_bar: false,
      show_preload_progress_bar: !debug,
      on_finish: function() {
        display_element = document.getElementById("jspsych-content");
        if (debug) {
          display_element.innerHTML = "<pre>" + jsPsych.data.get().csv() + "</pre>";
        } else {
          display_element.innerHTML = "Thank you for your participation.";
        }
        SaveData("pilot_delayed_mts_"+condition, subjectID, jsPsych.data.get().csv());
      }
    });
  } else {
    setTimeout(wait_load, 50);
  }
}

setTimeout(wait_load, 50);
