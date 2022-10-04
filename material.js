var task = [];
var max_N_files = 0;
// Number of trials
var N = 100;
var gap_duration = 1000;
var second_stim_duration = 2000;
var fKeyMeansCorrect = Math.random() < 0.5;
var same_key = fKeyMeansCorrect ? "f" : "j";
var different_key = fKeyMeansCorrect ? "j" : "f";
var post_trial_gap = 500;
var finished_loading = false;

var file_id = "stimuli/" + (Math.floor(Math.random()*max_N_files)) + ".csv";

jsPsych.data.addProperties({'file_id': file_id});
jsPsych.data.addProperties({'fKeyMeansCorrect': fKeyMeansCorrect});

train_1 = {
  "type": "same-different-html",
  "stimuli": ["decra", "debra"],
  "same_key": same_key,
  "different_key": different_key,
  "answer": "different",
  "gap_duration": gap_duration,
  "second_stim_duration": second_stim_duration,
  "post_trial_gap": post_trial_gap
}

// TODO: ADD SOME more training
task.push(train_1);
// task.push(train_2);
// task.push(train_3);


Papa.parse(file_id,
  {
    download: true,
    header: true,
    complete: function(results) {
      allStimuli = results.data;
      for (i = 0 ; i < allStimuli.length - 1; i++) {
        trial = allStimuli[i];
        trial.type = "same-different-html"
        trial.stimuli = [trial.first, trial.second];
        trial.answer = (trial.first === trial.second ? "same" : "different");
        trial.same_key = same_key;
        trial.different_key = different_key;
        trial.gap_duration = gap_duration;
        trial.second_stim_duration = second_stim_duration;
        trial.post_trial_gap = post_trial_gap;
        task.push(trial);
      }
      finished_loading = true;
    }
  }
);

