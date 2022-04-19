raw_stims = [["rekagable",91], ["tisable",92], ["undistiser",93], ["diskag",94], ["sidtiselba",95], ["kager",96], ["ernutisyl",97], ["unkag",98], ["undistisable",99], ["ertis",100], ["unrekag",101], ["unrevivly",102], ["nusidtisre",103], ["unretis",104], ["sidkag",105], ["nuviv",106], ["unrekagable",107], ["ertisyl",108], ["untis",109], ["kagable",110], ["nukag",111], ["unreviv",112], ["revivly",113], ["sidtisyl",114], ["unrekagly",115], ["distis",116], ["erkagelba",117], ["kag",118], ["nusidvivyl",119], ["ernuvivyl",120], ["sidvivyl",121], ["undiskag",122], ["ervivyl",0], ["diskagable",1], ["viv",2], ["rekag",3], ["nusidkagyl",4], ["tisly",5], ["nusidvivelba",6], ["unrekager",7], ["nusidtiselba",8], ["unkagable",9], ["nusidkag",10], ["sidviv",11], ["retis",12], ["ernutisre",13], ["ernutis",14], ["ernukagre",15], ["kagly",16], ["disvivly",17], ["undiskagly",18], ["vivre",19], ["distisable",20], ["unkagly",21], ["kagyl",22], ["unretisable",23], ["undiskagable",24], ["sidtis",25], ["sidkagyl",26], ["nukagyl",27], ["nuvivelba",28], ["undistisly",29], ["undisviv",30], ["disvivable",31], ["ernukag",32], ["unvivable",33], ["kagelba",34], ["revivable",35], ["undisvivly",36], ["ernuviv",37], ["erkag",38], ["diskagly",39], ["ernukagelba",40], ["erviv",41], ["nusidviv",42], ["unrevivable",43], ["unvivly",44], ["vivable",45], ["unretiser",46], ["undiskager",47], ["tisre",48], ["tiser",49], ["ernukagyl",50], ["unreviver",51], ["tiselba",52], ["tisyl",53], ["vivyl",54], ["untisable",55], ["nutisyl",56], ["retisly",57], ["nusidtis",58], ["ernutiselba",59], ["vivly",60], ["nusidkagelba",61], ["sidkagelba",62], ["ertiselba",63], ["unviv",64], ["undistis",65], ["distisly",66], ["retisable",67], ["erkagyl",68], ["nusidkagre",69], ["nuvivyl",70], ["rekagly",71], ["ernuvivre",72], ["nutiselba",73], ["undisviver",74], ["disviv",75], ["nusidvivre",76], ["sidvivelba",77], ["undisvivable",78], ["reviv",79], ["unretisly",80], ["ervivelba",81], ["nusidtisyl",82], ["nukagelba",83], ["vivelba",84], ["viver",85], ["untisly",86], ["tis",87], ["kagre",88], ["ernuvivelba",89], ["nutis",90]]

allStimuli = []

for (i = 0 ; i < raw_stims.length ; i++) {
  item = {};
  item.target_word = raw_stims[i][0];
  item.meta_1 = raw_stims[i][1];
  allStimuli.push(item);
}
var repeat = function(array, repetitions, unpack) {

  var arr_isArray = Array.isArray(array);
  var rep_isArray = Array.isArray(repetitions);

  // if array is not an array, then we just repeat the item
  if (!arr_isArray) {
    if (!rep_isArray) {
      array = [array];
      repetitions = [repetitions];
    } else {
      repetitions = [repetitions[0]];
      console.log('Unclear parameters given to randomization.repeat. Multiple set sizes specified, but only one item exists to sample. Proceeding using the first set size.');
    }
  } else {
    if (!rep_isArray) {
      var reps = [];
      for (var i = 0; i < array.length; i++) {
        reps.push(repetitions);
      }
      repetitions = reps;
    } else {
      if (array.length != repetitions.length) {
        console.warning('Unclear parameters given to randomization.repeat. Items and repetitions are unequal lengths. Behavior may not be as expected.');
        // throw warning if repetitions is too short, use first rep ONLY.
        if (repetitions.length < array.length) {
          var reps = [];
          for (var i = 0; i < array.length; i++) {
            reps.push(repetitions);
          }
          repetitions = reps;
        } else {
          // throw warning if too long, and then use the first N
          repetitions = repetitions.slice(0, array.length);
        }
      }
    }
  }

  // should be clear at this point to assume that array and repetitions are arrays with == length
  var allsamples = [];
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < repetitions[i]; j++) {
      if(array[i] == null || typeof array[i] != 'object'){
        allsamples.push(array[i]);
      } else {
        allsamples.push(Object.assign({}, array[i]));
      }

    }
  }

  var out = shuffle(allsamples);

  if (unpack) {
    out = unpackArray(out);
  }

  return out;
}

var shuffleNoRepeats = function(arr, equalityTest) {
  if(!Array.isArray(arr)){
    console.error('First argument to shuffleNoRepeats() must be an array.')
  }
  if(typeof equalityTest !== 'undefined' && typeof equalityTest !== 'function'){
    console.error('Second argument to shuffleNoRepeats() must be a function.')
  }
  // define a default equalityTest
  if (typeof equalityTest == 'undefined') {
    equalityTest = function(a, b) {
      if (a === b) {
        return true;
      } else {
        return false;
      }
    }
  }

  var random_shuffle = shuffle(arr);
  for (var i = 0; i < random_shuffle.length - 1; i++) {
    if (equalityTest(random_shuffle[i], random_shuffle[i + 1])) {
      // neighbors are equal, pick a new random neighbor to swap (not the first or last element, to avoid edge cases)
      var random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      // test to make sure the new neighbor isn't equal to the old one
      while (
        equalityTest(random_shuffle[i + 1], random_shuffle[random_pick]) ||
        (equalityTest(random_shuffle[i + 1], random_shuffle[random_pick + 1]) || equalityTest(random_shuffle[i + 1], random_shuffle[random_pick - 1]))
      ) {
        random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      }
      var new_neighbor = random_shuffle[random_pick];
      random_shuffle[random_pick] = random_shuffle[i + 1];
      random_shuffle[i + 1] = new_neighbor;
    }
  }

  return random_shuffle;
}

var shuffleAlternateGroups = function(arr_groups, random_group_order){
  if(typeof random_group_order == 'undefined'){
    random_group_order = false;
  }

  var n_groups = arr_groups.length;
  if(n_groups == 1){
    console.warn('shuffleAlternateGroups was called with only one group. Defaulting to simple shuffle.');
    return(shuffle(arr_groups[0]));
  }

  var group_order = [];
  for(var i=0; i<n_groups; i++){
    group_order.push(i);
  }
  if(random_group_order){
    group_order = shuffle(group_order);
  }

  var randomized_groups = [];
  var min_length = null;
  for(var i=0; i<n_groups; i++){
    min_length = min_length === null ? arr_groups[i].length : Math.min(min_length, arr_groups[i].length);
    randomized_groups.push(shuffle(arr_groups[i]));
  }

  var out = [];
  for(var i=0; i<min_length; i++){
    for(var j=0; j<group_order.length; j++){
      out.push(randomized_groups[group_order[j]][i])
    }
  }

  return out;
}

var sampleWithoutReplacement = function(arr, size){
  if(!Array.isArray(arr)){
    console.error("First argument to sampleWithoutReplacement() must be an array")
  }
  
  if (size > arr.length) {
    console.error("Cannot take a sample " +
      "larger than the size of the set of items to sample.");
  }
  return shuffle(arr).slice(0,size);
}

sampleWithReplacement = function(arr, size, weights) {
  if(!Array.isArray(arr)){
    console.error("First argument to sampleWithReplacement() must be an array")
  }

  var normalized_weights = [];
  if(typeof weights !== 'undefined'){
    if(weights.length !== arr.length){
      console.error('The length of the weights array must equal the length of the array '+
      'to be sampled from.');
    }
    var weight_sum = 0;
    for(var i=0; i<weights.length; i++){
      weight_sum += weights[i];
    }
    for(var i=0; i<weights.length; i++){
      normalized_weights.push( weights[i] / weight_sum );
    }
  } else {
    for(var i=0; i<arr.length; i++){
      normalized_weights.push( 1 / arr.length );
    }
  }

  var cumulative_weights = [normalized_weights[0]];
  for(var i=1; i<normalized_weights.length; i++){
    cumulative_weights.push(normalized_weights[i] + cumulative_weights[i-1]);
  }

  var samp = [];
  for (var i = 0; i < size; i++) {
    var rnd = Math.random();
    var index = 0;
    while(rnd > cumulative_weights[index]) { index++; }
    samp.push(arr[index]);
  }
  return samp;
}

var factorial = function(factors, repetitions, unpack) {

  var factorNames = Object.keys(factors);

  var factor_combinations = [];

  for (var i = 0; i < factors[factorNames[0]].length; i++) {
    factor_combinations.push({});
    factor_combinations[i][factorNames[0]] = factors[factorNames[0]][i];
  }

  for (var i = 1; i < factorNames.length; i++) {
    var toAdd = factors[factorNames[i]];
    var n = factor_combinations.length;
    for (var j = 0; j < n; j++) {
      var base = factor_combinations[j];
      for (var k = 0; k < toAdd.length; k++) {
        var newpiece = {};
        newpiece[factorNames[i]] = toAdd[k];
        factor_combinations.push(Object.assign({}, base, newpiece));
      }
    }
    factor_combinations.splice(0, n);
  }

  repetitions = (typeof repetitions === 'undefined') ? 1 : repetitions;
  var with_repetitions = repeat(factor_combinations, repetitions, unpack);

  return with_repetitions;
}

var randomID = function(length){
  var result = '';
  var length = (typeof length == 'undefined') ? 32 : length;
  var chars = '0123456789abcdefghjklmnopqrstuvwxyz';
  for(var i = 0; i<length; i++){
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function unpackArray(array) {

  var out = {};

  for (var i = 0; i < array.length; i++) {
    var keys = Object.keys(array[i]);
    for (var k = 0; k < keys.length; k++) {
      if (typeof out[keys[k]] === 'undefined') {
        out[keys[k]] = [];
      }
      out[keys[k]].push(array[i][keys[k]]);
    }
  }

  return out;
}

var shuffle = function(array) {
  var copy_array = array.slice(0);
  var m = copy_array.length,
    t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = copy_array[m];
    copy_array[m] = copy_array[i];
    copy_array[i] = t;
  }

  return copy_array;
}
var task = [];

allStimuli = shuffle(allStimuli);

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
  positions = shuffle(positions_base);
  while (positions.length < 5) {
    new_pos = shuffle(positions_base);
    positions = positions.concat(new_pos);
  }

  var replaced_tuples = [];
  for (j = 0 ; j < 5 ; j++) {
    //Split, replace a random position with a sampled letter , join, push
    var distractor = reference.split('');
    var pos = positions[j];

    // Shuffles letters to go through
    var letters = "abcdefghijklmnopqrstuvwxyz".split('');
    letters = sampleWithoutReplacement(letters, 26);
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

  distractors = shuffle(distractors);

  allStimuli[i].distractor_list = distractors;
  allStimuli[i].type = 'delayed-mts';
  allStimuli[i].blank_delay = 500;
  task.push(allStimuli[i]);
}

console.log("target_word,meta_1,distractor_list,type,blank_delay")
for (i = 0 ; i < task.length ; i++) {
  console.log([task[i].target_word,
    task[i].meta_1,
    '"'+task[i].distractor_list.join(",")+'"',
    task[i].type,
    task[i].blank_delay].join(","))
}
