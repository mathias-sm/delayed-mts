function show_stats(data) {
  geom_data = data.filter({trial_type: "delayed-mts"});
  r1 = geom_data.select("reference").values;
  r2 = geom_data.select("responses").values;
  total =
    r1.reduce(
      function(accumulateur, valeurCourante, index, array){
        return accumulateur + (r2[index] === valeurCourante ? 1 : 0);
      },
      0);

  stat = Math.round(100*total/(r1.length));

  if (debug) {
    document.getElementById("jspsych-content").innerHTML = "<pre>" + data.csv() + "</pre>"
  } else {
    document.getElementById("jspsych-content").innerHTML = "<p id='thanks'>Merci de votre participation !<br/>Vous avez <strong>"+stat+"%</strong> réponses correctes.</p>";
  }
}

sendData = function(uuid, user, project, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://neurospin-data.cea.fr/experiments", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("uuid="+uuid+"&user="+user+"&project="+project+"&data="+data);
}
