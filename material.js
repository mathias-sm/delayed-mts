var task = [];
// Number of trials
var N = 100;
var first_stim_duration = 1000;
var gap_duration = 1000;
var second_stim_duration = 2000;
var same_key = "f"
var different_key = "j"
var post_trial_gap = 500

train_1 = {
  "type": "same-different-html",
  "stimuli": ["decra", "debra"],
  "same_key": same_key,
  "different_key": different_key,
  "answer": "different",
  "first_stim_duration": first_stim_duration,
  "gap_duration": gap_duration,
  "second_stim_duration": second_stim_duration,
  "post_trial_gap": post_trial_gap
}

// TODO: ADD SOME more training
task.push(train_1);

allStimuli = jsPsych.randomization.shuffle(allStimuli);

// Randomize exactly 50/50 correct
var trial_correctness_array = [];
for (var i = 0 ; i < N/2 ; i++) {
  trial_correctness_array.push(true);
  trial_correctness_array.push(false);
}
trial_correctness_array = jsPsych.randomization.shuffle(trial_correctness_array);

for (i = 0 ; i < allStimuli.length; i++) {
  stimuli = [allStimuli[i].target_word];
  if (trial_correctness_array[i]) {
    stimuli.push(allStimuli[i].target_word);
  } else {
    var distractor = allStimuli[i].target_word.split('');
    var letters = "abcdefghijklmnopqrstuvwxyz".split('');
    var pos = Math.floor(Math.random()*distractor.length);
    var letters = jsPsych.randomization.sampleWithoutReplacement(letters, 26);
    var idx_letter = 0;
    while (distractor[pos] == letters[idx_letter]) {
      idx_letter = idx_letter + 1;
    }
    distractor[pos] = letters[idx_letter];
    stimuli.push(distractor.join(""));
  }

  trial = {
    "type": "same-different-html",
    "stimuli": stimuli,
    "answer": (trial_correctness_array[i] ? "same" : "different"),
    "same_key": same_key,
    "different_key": different_key,
    "first_stim_duration": first_stim_duration,
    "gap_duration": gap_duration,
    "second_stim_duration": second_stim_duration,
    "post_trial_gap": post_trial_gap
  }
  task.push(trial);
}
