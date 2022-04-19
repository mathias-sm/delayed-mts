var task = [];

allStimuli = jsPsych.randomization.shuffle(allStimuli);

test_includes = function(arr, elem) {
  for (j = 0 ; j < arr.length ; j++) {
    e = arr[j];
    if (e[0] == elem[0] && e[1] == elem[1]) {
      return true;
    }
  }
  return false;
}

for (i = 0 ; i < allStimuli.length / 2; i++) {
  reference = allStimuli[i].target_word;
  distractors = [reference]

  // Prepapre substitution positions by shuffling to ensure coverage
  positions_base = []
  for (j = 0 ; j < reference.length ; j++) {
    positions_base.push(j);
  }
  positions = jsPsych.randomization.shuffle(positions_base);
  while (positions.length < 5) {
    new_pos = jsPsych.randomization.shuffle(positions_base);
    positions = positions.concat(new_pos);
  }

  var replaced_tuples = [];
  for (j = 0 ; j < 5 ; j++) {
    //Split, replace a random position with a sampled letter , join, push
    var distractor = reference.split('');
    var pos = positions[j];

    // Shuffles letters to go through
    var letters = "abcdefghijklmnopqrstuvwxyz".split('');
    letters = jsPsych.randomization.sampleWithoutReplacement(letters, 26);
    var idx_letter = 0;

    // Ensures that we replace a letter with an actually different one, which we
    // haven't used yet
    while (distractor[pos] == letters[idx_letter] ||
           test_includes(replaced_tuples, [pos, letters[idx_letter]])
           ) {
      idx_letter = idx_letter + 1;
    }

    replaced_tuples.push([pos, letters[idx_letter]]);
    distractor[pos] = letters[idx_letter];
    distractors.push(distractor.join(""));
  }

  distractors = jsPsych.randomization.shuffle(distractors);

  allStimuli[i].distractor_list = distractors;
  allStimuli[i].type = 'delayed-mts';
  allStimuli[i].blank_delay = 500;
  task.push(allStimuli[i]);
}

console.log(task);
