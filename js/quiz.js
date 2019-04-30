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

function savePerson() {
    var data = JSON.parse(text);
    var personal_object = {"id": data.length + 1,
                            "Gender": personal_details["Gender"],
                            "Uni": personal_details["Uni"],
                            "Year": personal_details["Year"],
                            "MB": personal_details["MB1"] + personal_details["MB2"] + personal_details["MB3"] + personal_details["MB4"],
                            "Enneagram": personal_details["Enneagram"],
                            "SG1": personal_details["SG"][0],
                            "SG2": personal_details["SG"][1],
                            "SG3": personal_details["SG"][2]}
    if (uniquePerson(personal_object, data)) {
      data.push(personal_object);
    }
    unselectAllButtons();
    allMembers(data);
}

function uniquePerson(person, data) {
  if ($("input[type='checkbox']").is(":checked")) {
    for (var i = 0; i < data.length; i++) {
      var member = data[i];
      if (member["Gender"] == personal_object["Gender"] && 
        member["Uni"] == personal_object["Uni"] &&
        member["Year"] == personal_object["Year"] &&
        member["MB"] == personal_object["MB"] &&
        member["Enneagram"] == personal_object["Enneagram"] &&
        member["SG1"] == personal_object["SG1"] &&
        member["SG2"] == personal_object["SG2"] &&
        member["SG3"] == personal_object["SG3"]) {
        return true;
      }
    }
  }
  return false;
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
            personal_details[category].push(detail);
        } 
    } else { // select the unselected SG
        personal_details[category] = detail;
    }
}

$( document ).ready(function() {
    // toggle buttons
    $('button.submit').on('click', function(){
        quiz = false;
        $('.submit').hide();
    });        

});