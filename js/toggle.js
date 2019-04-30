// dataset
var dataset;

function order(data) {
    var types = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    var result = [];
    for (var i = 0; i < types.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (types[i] == data[j]["Enneagram"]) {
                result.push(data[j]);
            }
        }
    }
    return result;
}

var category_details = {
  "Gender": null,
  "Uni": null,
  "Year": null,
  "MB1": null,
  "MB2": null,
  "MB3": null,
  "MB4": null,
  "SG": []
};

var order_stack = [];

// list of options
var genders = ['Male', 'Female'];
var unis = ['CMU', 'Pitt', 'Other'];
var years = [1, 2, 3, 4, 5];
var mbs = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 
            'INFJ', 'INFP', 'ENFJ', 'ENFP', 
            'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 
            'ISTP', 'ISFP', 'ESTP', 'ESFP'];
var sgs = ['Evangelism', 'Prophecy', 'Teaching', 
            'Exhortation', 'Shepherding', 'Showing Mercy',
            'Serving', 'Giving', 'Administration'];


$( document ).ready(function() {
    // toggle buttons
    $('button.gender').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.gender').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('button.year').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.year').removeClass('selected');
            $(this).addClass('selected');
        }
    });  

    $('button.uni').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.uni').removeClass('selected');
            $(this).addClass('selected');
        }
    }); 

    $('button.mb1').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.mb1').removeClass('selected');
            $(this).addClass('selected');
        }
    });  

    $('button.mb2').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.mb2').removeClass('selected');
            $(this).addClass('selected');
        }
    });   

    $('button.mb3').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.mb3').removeClass('selected');
            $(this).addClass('selected');
        }
    }); 

    $('button.mb4').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.mb4').removeClass('selected');
            $(this).addClass('selected');
        }
    });       

    $('button.sg').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }
    });          

});


function allMembers(data) {
    dataset = order(data);
    var result_text = "";
    result_text += addDots("All", "");
    document.getElementById("results").innerHTML = result_text;
}

function removeLastInstance(order_stack, array){
    for (var i = 1; i < order_stack.length + 1; i++) {
        if (!array.includes(order_stack[order_stack.length - i])) {
            order_stack.splice(order_stack.length - i, 1);
            return order_stack;
        }
    }
    return order_stack;
}

function saveCategory(category, detail) {
    if (!quiz && category != "Enneagram") {
        saveCategoryPost(category, detail);
    } else if (quiz) {
        saveCategoryPre(category, detail);
        console.log(personal_details);
    }
}

function saveCategoryPost(category, detail) {
    // keeping track of which categories were selected, list out categories and save them
    if (Array.isArray(category_details[category])) { // specifically for sgs
        if (!category_details[category].includes(detail)) { // select the unselected
            order_stack.push(category);
            category_details[category].push(detail);
            changeDots(category);
        } else if (category_details[category].includes(detail)) { // unselect the selected
            var array = ["Gender", "Uni", "Year", "MB1", "MB2", "MB3", "MB4"];
            order_stack = removeLastInstance(order_stack, array);

            // remove
            category_details[category] = category_details[category].filter(function(value, index, arr){
                return value != detail;
            });

            if (order_stack.length > 0) {
                // go to next non-sg item
                var i = 1;
                while (order_stack.length - i > 0 && !array.includes(order_stack[order_stack.length - i])) {
                    i += 1;
                }
                if ((order_stack.length - i) >= 0) {
                    listResults(order_stack[order_stack.length - i]);
                } else {
                    allMembers();
                }
            } else {
                allMembers();
            }
        }
    } else if (category_details[category] == detail) { // unselect the selected
        order_stack = order_stack.filter(function(value, index, arr){
            return value != category;
        });
        if (order_stack.length > 0) {
            let result = order_stack[order_stack.length - 1];
            listResults(result);
        } else {
            allMembers();
        }

        category_details[category] = null;
    }  else { 
        order_stack.push(category);
        category_details[category] = detail;
        listResults(category);
    }
    // debugging sake
    // document.getElementById("demo").innerHTML = JSON.stringify(category_details);
}

function changeDots(category) {
    var option = category_details[category];
    var spotlight_dots = document.getElementsByClassName("spotlight");
    
    if (spotlight_dots.length == 0) { // is this needed
        
    } else {
        // get the ids of spotlight dots
        var dots = [];
        for (var i = 0; i < spotlight_dots.length; i++) { 
            var id = $(spotlight_dots[i]).attr('id');
            dots.push(id);
        }

        // matching up member ids to spotlight ids
        for (var i = 0; i < dataset.length; i++) {
            var member = dataset[i];
            if (!fulfillAllReqs(member)) {
                $('#' + member["id"]).removeClass('spotlight');
            }
        }
    }
}

function selectOptions(category) {
    // which option - can this be done better?
    var options = '';
    if (category == "Gender") {
        options = genders;
    } else if (category == "Uni") {
        options = unis;
    } else if (category == "Year") {
        options = years;
    } else if (category == "MB") {
        options = mbs;
    } else if (category == "SG") {
        options = sgs;
    }
    return options;
}

function listResults(category) { // if MB1
    var cat = category;
    if (category.slice(0, 2) == "MB") {
        cat = category.slice(0, 2);
    }
    var options = selectOptions(cat);
    var result_text = "";
    for (var i = 0; i < options.length; i++) {
      let option = options[i];
      if (typeof option == "string") {
        option = option.toLowerCase()
      }
      result_text += "<div class='section'><h3>" + option + "</h3>";
      result_text += addDots(cat, options[i]); // ?? originally category
      result_text += "</div>";
    }
    document.getElementById("results").innerHTML = result_text;
}

function addDots(category, option) {
    var dot_text = "";
    for (var i = 0; i < dataset.length; i++) {
        var new_text = "";
        var member = dataset[i];
        if (fulfillReq(member, category, option)) {
            if (fulfillAllReqs(member)) {
                new_text += " spotlight";
            }

            if (member.id == dataset.length) {
                new_text += " you";
            }
            console.log(dataset.length);
            console.log(member.id);
            dot_text += '<div class="circle ' + member["Enneagram"] + new_text + '"' + ' id="' + member.id + '"></div>';
        }
        
    }
    return dot_text;
}

function fulfillAllReqs(member) {
    for (var i = 0; i < order_stack.length; i++) {
        let cat = order_stack[i];
        console.log(cat);
        console.log(category_details[cat]);
        if (!fulfillReq(member, cat, category_details[cat])) {
            return false;
        }
    }
    return true;
}

function fulfillReq(member, category, option) {
    if (category == "All") {
        return true
    } else if (category == "SG") {
        let member_options = new Set([member["SG1"], member["SG2"], member["SG3"]]);
        for (var i = 0; i < option.length; i++) {
            if (!member_options.has(option[i])) {
                return false
            }
        }
        return true;
    } else if (category.slice(0, 2) == "MB") {
        let cat = category.slice(0, 2);
        return (member[cat].includes(option));
    }
    return (member[category] == option);
}