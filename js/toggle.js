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
var years = ['1', '2', '3', '4/5', '+'];
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

    $('button.enneagram-button').on('click', function(){
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $('button.enneagram-button').removeClass('selected');
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

    var last_sg_buttons = [];

    $('button.sg').on('click', function(){
        if (!quiz && last_sg_buttons.length == 3) {
            last_sg_buttons = [];
        }
        if ($(this).hasClass('selected')) {
            let button = this;
            last_sg_buttons = last_sg_buttons.filter(function(value, index, arr){
                return value != button;
            });
            $(this).removeClass('selected');
        } else {
            if (last_sg_buttons.length == 3) {
                let button = last_sg_buttons.pop();
                $(button).removeClass('selected');
            }
            $(this).addClass('selected');
            last_sg_buttons.push(this);
        }
    });        

});


function allMembers() {
    $(".dot-grid-container").remove();
    var wholeWidth = $(".cluster").width();
    var wholeHeight = $(".cluster").height();
    var coordinates = [[wholeWidth/2, wholeHeight/2]];
    var x;
    var y;

    for (var i = 0; i < dataset.length; i++) {
        var member = dataset[i];
          var spacing = 5;
          var eg = member["Enneagram"];
          // var dot_text = '<div class="circle ' + eg + '"' + ' id="' + member.id + 100'"></div>';

          

          if (member.id == dataset.length + 1) {
            x = Math.floor(wholeWidth / 2);
            y = Math.floor(wholeHeight / 2);
          } else {
            var coordinate = randomCoordinate(eg, member.id);
            x = coordinate[0];
            y = coordinate[1];
            var app = appropriateSpacing(x, y, coordinates);

            while (app[0] != "ok") {
              if (app[0] == "left") {
                x -= spacing;
              } else if (app[0] == "right") {
                x += spacing;
              }
              if (app[1] == "up") {
                y -= spacing;
              } else if (app[1] == "down") {
                y += spacing;
              }

              app = appropriateSpacing(x, y, coordinates);
              spacing += 0.5;
            } 

            coordinates.push([x, y]);
          }

          var resultsWidth = 0;
          // var resultsWidth = $("#results").width() / 3;
            // var windowRem = $(window).width() / parseFloat($("body").css("font-size"));
            // var resultsRatio = resultsWidth / $(window).width();
            // var resultsRem = resultsRatio * windowRem;
            // var width = resultsRem / 2 - 4;
            // var width = resultsRatio / 2;

          $("#" + member.id).animate({"left": x + resultsWidth}, "slow").animate({"top": y}, "slow").animate({"opacity": 1 }, "slow");

          // $(dot_text).hide().appendTo(".cluster").css('left', x).css('top', y);
          // $("#" + member.id).delay(4500).fadeIn("slow");

    }               
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
    // get the ids of spotlight dots
    // var dots = [];
    // for (var i = 0; i < spotlight_dots.length; i++) { 
    //     var id = $(spotlight_dots[i]).attr('id');
    //     dots.push(id);
    // }

    // console.log(dots);

    // matching up member ids to spotlight ids
    for (var i = 0; i < dataset.length; i++) {
        var member = dataset[i];
        if (!fulfillAllReqs(member)) {
            $("#" + member.id).animate({"opacity": 0.2}, "slow");
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

function listResults(category) {
    var cat = category;
    if (category.slice(0, 2) == "MB") {
        cat = category.slice(0, 2);
    }
    var options = selectOptions(cat);
    var result_text = "";
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (typeof option == "string") {
        option = option.toLowerCase()
      }

      if (cat == "MB") {
        result_text += "<div class='mb-dot-grid'>";
        result_text += "<div class='grid-item'><h3>" + option + "</h3></div>";
        result_text += "<div class='grid-item'>";
        result_text += addDots(cat, options[i]); // ?? originally category
        result_text += "</div></div>";
      } else {
        result_text += "<div class='dot-grid-container'>";
        result_text += "<div class='grid-item'><h3>" + option + "</h3></div>";
        result_text += "<div class='grid-item'>";
        result_text += addDots(cat, options[i]); // ?? originally category
        result_text += "</div></div>";
      }
    }

    // PREP
    // YOU dot prep
    $('.you').css("margin-top", "-0.375rem");
    $('.you').css("margin-left", "-0.375rem");
    $('.you').removeClass('center'); // tryna adjust for the not exact placement

    // reset cluster stuff
    $('.cluster').prepend( $('.you') ); // making multiple copies rn
    $(".dot-grid-container").remove();
    $(".mb-dot-grid").remove();

    if (cat == "MB") { // so many conditionals rip
        result_text = "<div class='mb-dot-grid-container'>" + result_text + "</div>";
    }

    result_text = "<div class='center'>" + result_text + "</div>";
    $(".cluster").prepend(result_text); // making multiple copies rn
    // $('.center').remove(); // difficult removing this rn


    if (cat == "MB") {
        // somehow it works when i use dot-grid now
        var topOffset = $('.mb-dot-grid-container').offset().top - $('.cluster').offset().top;
        var leftOffset = $('.mb-dot-grid-container').offset().left - $('.cluster').offset().left;
    } else {
        // somehow it works when i use dot-grid now
        var topOffset = $('.dot-grid-container').offset().top - $('.cluster').offset().top;
        var leftOffset = $('.dot-grid-container').offset().left - $('.cluster').offset().left;
    }
    

    // ANIMATION - still glitchy
    var time = 0;
    // moving dot
    for (var i = 0; i < dataset.length + 1; i++) {
        if (i != dataset.length) {
            var member = dataset[i];
            var number = member.id + 100; // the placeholder circle
            var position = $("#" + number).position();
            if (position.left != $("#" + member.id).position().left) { // speed up opacity animation
                time = 1500;
            } // JANK AF POSITIONING
            $("#" + member.id).animate({"left": position.left + leftOffset }, "slow").animate({"top": position.top + topOffset}, "slow"); // the moving circle
        }
    }

    // animating opacity
    setTimeout(function(){
        for (var i = 0; i < dataset.length + 1; i++) {
            if (i != dataset.length) {
                var member = dataset[i];
                if (!fulfillAllReqs(member)) {
                    $("#" + member.id).animate({"opacity": 0.1}, "slow"); // the moving circle
                } else {
                    $("#" + member.id).animate({"opacity": 1}, "slow");
                }
            }
        }
    }, time);
}

function addDots(category, option) {
    var dot_text = "";
    for (var i = 0; i < dataset.length; i++) {
        var new_text = "";
        var member = dataset[i];
        if (fulfillReq(member, category, option)) {
            if (member.id > dataset.length) {
                new_text += " you";
            }
            var number = member.id + 100;
            dot_text += '<div class="circle ' + member["Enneagram"] + new_text + '"' + ' id="' + number + '"></div>';
        }
    }
    return dot_text;
}

function fulfillAllReqs(member) {
    for (var i = 0; i < order_stack.length; i++) {
        let cat = order_stack[i];
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