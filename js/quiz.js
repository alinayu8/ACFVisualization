// personal quiz
var quiz = true;

var personal_details = {
  "Enneagram": null,
  "Gender": null,
  "Uni": null,
  "Year": null,
  "MB1": null,
  "MB2": null,
  "MB3": null,
  "MB4": null,
  "SG": []
};

$( document ).ready(function() {
   $('button').on('click', function(){
    if (quiz && personal_details["Enneagram"] != null && personal_details["Gender"] != null &&
      personal_details["Uni"] != null && personal_details["Year"] != null &&
      personal_details["MB1"] != null && personal_details["MB2"] != null &&
      personal_details["MB3"] != null && personal_details["MB4"] != null &&
      personal_details["SG"].length == 3) {
      $(".submit").fadeIn();
    } else {
      $(".submit").fadeOut();
    }
  });

  $('button.submit').on('click', function(){
      quiz = false;
      $('#toggle-data, .submit').fadeOut();
  });  

});

function savePerson() {
    var data = JSON.parse(text);
    var personal_object = {"id": data.length + 2, //ratchet af
                            "Gender": personal_details["Gender"],
                            "Uni": personal_details["Uni"],
                            "Year": personal_details["Year"],
                            "MB": personal_details["MB1"] + personal_details["MB2"] + personal_details["MB3"] + personal_details["MB4"],
                            "Enneagram": personal_details["Enneagram"],
                            "SG1": personal_details["SG"][0],
                            "SG2": personal_details["SG"][1],
                            "SG3": personal_details["SG"][2]}
    new_data = editedData(personal_object, data);
    new_data.push(personal_object);
    unselectAllButtons();
    narrativeDots(new_data);
    // allMembers(new_data);
}

function editedData(person, data) {
  if ($("input[type='checkbox']").is(":checked")) {
    for (var i = 0; i < data.length; i++) {
      var member = data[i];
      let member_options = new Set([member["SG1"], member["SG2"], member["SG3"]]);
      if (member["Gender"] == person["Gender"] && 
        member["Uni"] == person["Uni"] &&
        member["Year"] == person["Year"] &&
        member["MB"] == person["MB"] &&
        member["Enneagram"] == person["Enneagram"] &&
        member_options.has(person["SG1"]) &&
        member_options.has(person["SG2"]) &&
        member_options.has(person["SG3"])) {
        data.splice(i, 1);
        return data;
      }
    }
  }
  return data;
}

function unselectAllButtons() {
    $("button").removeClass("selected");
}

function saveCategoryPre(category, detail) {
    if (personal_details[category] == detail) { // unselect the selected that's not SG
        personal_details[category] = null;
    } else if (Array.isArray(personal_details[category])){ // SG
        if (personal_details[category].includes(detail)) { // unselect
            personal_details[category] = personal_details[category].filter(function(value, index, arr){
                    return value != detail;
                });
        } else { // select
            if (personal_details[category].length == 3) {
              personal_details[category].pop();
            }
            personal_details[category].push(detail);
        } 
    } else { // select the unselected SG
        personal_details[category] = detail;
    }
}