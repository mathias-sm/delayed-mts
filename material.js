var task = [];

var rawFileExp = new XMLHttpRequest();
var allStimuli;
rawFileExp.open("GET", "./stimuli.csv", false);
rawFileExp.onreadystatechange = function ()
{
  if(rawFileExp.readyState === 4)
  {
    if(rawFileExp.status === 200 || rawFileExp.status == 0 || rawFileExp.status === 304)
    {
      allStimuli = Papa.parse(rawFileExp.responseText, {delimiter: ",", header: true}).data
      allStimuli = allStimuli.filter(function(e) { return e.reference !== "" });
    }
  }
}
rawFileExp.send(null);


for (i = 0 ; i < allStimuli.length ; i++) {
  reference = allStimuli[i].reference;
  distractors = [reference]

  // Sample five random letters without replacement
  var letters = "abcdefghijklmnopqrstuvwxyz".split('');
  letters = jsPsych.randomization.sampleWithoutReplacement(letters, 26);
  var idx_letter = 0;

  for (j = 0 ; j < 5 ; j++) {
    //Split, replace a random position with a sampled letter , join, push
    var distractor = reference.split('');
    var pos = Math.floor(Math.random() * distractor.length);
    // Ensures that we replace a letter with an actually different one
    while (distractor[pos] == letters[idx_letter]) {
      idx_letter = idx_letter + 1;
    }
    distractor[pos] = letters[idx_letter];
    distractors.push(distractor.join(""));
    idx_letter = idx_letter + 1;
  }

  distractors = jsPsych.randomization.shuffle(distractors);

  allStimuli[i].distractors = distractors;
  allStimuli[i].type = 'delayed-mts';
  task.push(allStimuli[i]);
}

task = jsPsych.randomization.shuffle(task);
