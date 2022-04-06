// Generate a random subject ID and add it to jsPsych's data to be saved
var subjectID = jsPsych.randomization.randomID(10);
jsPsych.data.addProperties({'ID': subjectID});

// The consent block, which points to the consent PAGE
var consent = {
  type:'external-html',
  url: "external-consent.html",
  cont_btn: "start"
};

// Instructions --- text declared in another file
var instructions = {
  type:'instructions',
  show_clickable_nav: true,
  button_label_next: "Suite",
  button_label_previous: "Précédent",
  pages: [instruction_text_p1]
};

// Declare the demographic questionaire block. If this gets too long one could
// put the data into yet another file.
var survey = {
  type: "survey-dropdown",
  preamble: "Un petit questionnaire pour commencer",
  questions: [
    {
      prompt: "Genre",
      options: [ "Homme", "Femme", "Non binaire", "Autre", "Préfère ne pas répondre", ],
      labels: ["M", "F", "NB", "O", "NoAnswer"],
    },
    { prompt: "Age", htmlType: "number" },
    {
      prompt: "Plus haut niveau de scolarité atteint",
      options: [ "Ecole primaire", "Collège", "Lycée", "Licence", "Master", "Doctorat", ],
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
  questions: [{prompt: "<p>Vous pouvez indiquer toute remarque à propos de cette expérience dans le champ ci-dessous. Veuillez ne pas y entrer d'information permettant de vous identifier ici.</p>", rows: 3}],
};

//sendData(subjectID, "test", "test", "ping");
jsPsych.init({
  timeline: (debug ? [].concat(resize, task) : [].concat(consent, survey, resize, instructions, task, freeform_answer)),
  show_progress_bar: false,
  show_preload_progress_bar: !debug,
  on_finish: function() {
    display_element = document.getElementById("jspsych-content");
    csv_data = jsPsych.data.get().csv();
    display_element.innerHTML += "<pre>"+csv_data+"</pre>";
    //sendData(subjectID, "test", "test", csv_data);
  }
});
