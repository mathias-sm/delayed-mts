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

var file_id = "stimuli"+(condition === "" ? "" : "_" + condition)+"/" + (Math.floor(Math.random()*max_N_files)) + ".csv";

jsPsych.data.addProperties({'file_id': file_id});
jsPsych.data.addProperties({'fKeyMeansCorrect': fKeyMeansCorrect});

trains =
  [
    ["decra", "debra"],
  ]

for (var i = 0 ; i < trains.length ; i++) {
    classed_first = "<span class='first'>" + trains[i][0] + "</span>";
    classed_second = "<span class='second'>" + trains[i][1] + "</span>";
    task.push({
      "type": "same-different-html",
      "stimuli": [classed_first, classed_second],
      "first": trains[i][0],
      "second": trains[i][1],
      "same_key": same_key,
      "different_key": different_key,
      "answer": (trains[i][0] === trains[i][1] ? "same" : "different"),
      "gap_duration": gap_duration,
      "second_stim_duration": second_stim_duration,
      "post_trial_gap": post_trial_gap
    })
}


Papa.parse(file_id,
  {
    download: true,
    header: true,
    complete: function(results) {
      allStimuli = results.data;
      for (i = 0 ; i < allStimuli.length - 1; i++) {
        trial = allStimuli[i];
        classed_first = "<span class='first'>" + trial.first + "</span>";
        classed_second = "<span class='second'>" + trial.second + "</span>";
        trial.type = "same-different-html"
        trial.stimuli = [classed_first, classed_second];
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

