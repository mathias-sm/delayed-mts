raw_stims = ["kag", "rekag", "erkag", "unkag", "nukag", "diskag", "sidkag", "kager", "kagre", "kagly", "kagyl", "kagable", "kagelba", "unrekag", "ernukag", "undiskag", "nusidkag", "rekagly", "erkagyl", "rekagable", "erkagelba", "unkagly", "nukagyl", "unkagable", "nukagelba", "diskagly", "sidkagyl", "diskagable", "sidkagelba", "unrekager", "ernukagre", "unrekagly", "ernukagyl", "unrekagable", "ernukagelba", "undiskager", "nusidkagre", "undiskagly", "nusidkagyl", "undiskagable", "nusidkagelba", "tis", "retis", "ertis", "untis", "nutis", "distis", "sidtis", "tiser", "tisre", "tisly", "tisyl", "tisable", "tiselba", "unretis", "ernutis", "undistis", "nusidtis", "retisly", "ertisyl", "retisable", "ertiselba", "untisly", "nutisyl", "untisable", "nutiselba", "distisly", "sidtisyl", "distisable", "sidtiselba", "unretiser", "ernutisre", "unretisly", "ernutisyl", "unretisable", "ernutiselba", "undistiser", "nusidtisre", "undistisly", "nusidtisyl", "undistisable", "nusidtiselba", "viv", "reviv", "erviv", "unviv", "nuviv", "disviv", "sidviv", "viver", "vivre", "vivly", "vivyl", "vivable", "vivelba", "unreviv", "ernuviv", "undisviv", "nusidviv", "revivly", "ervivyl", "revivable", "ervivelba", "unvivly", "nuvivyl", "unvivable", "nuvivelba", "disvivly", "sidvivyl", "disvivable", "sidvivelba", "unreviver", "ernuvivre", "unrevivly", "ernuvivyl", "unrevivable", "ernuvivelba", "undisviver", "nusidvivre", "undisvivly", "nusidvivyl", "undisvivable", "nusidvivelba"]

allStimuli = []

for (i = 0 ; i < raw_stims.length ; i++) {
  item = {};
  item.target_word = raw_stims[i];
  allStimuli.push(item);
}
