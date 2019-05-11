function narrativeDots(dataset) {
  // remove hover
  $('span').text('');

  for (var i = 0; i < dataset.length; i++) {
    var member = dataset[i];
    if (member.id > dataset.length) {
      var word_text = "<div class='center-text'>This is you.</div>"
      var dot_text = '<div class="center fadingCircle you ' + member["Enneagram"] + '"' + ' id="' + member.id + '"></div>';
      var text = "<div class='cluster center'><div id='this-is-you-dot' class='center'>" + word_text + dot_text + "</div></div>";
      $(text).hide().appendTo(".grid-container").delay(1000).fadeIn();
      $('.center-text').delay(3000).fadeOut();
    }
  }
  clusterDots(dataset);

  // move dots to the right and display toggle-sidebar
  setTimeout(function(){
    var resultsWidth = $("#results").width() / 2;
    var windowRem = $(window).width() / parseFloat($("body").css("font-size"));
    var resultsRatio = resultsWidth / $(window).width();
    var resultsRem = resultsRatio * windowRem;
    // var width = resultsRem / 2 - 4;
    var width = resultsRem / 2;
    $(".cluster").animate({"left":"+=" + width + "rem"}, "slow");
    // $(".fadingCircle").animate({"left":"+=" + width + "rem"}, "slow");

    // re-arrange toggle data buttons
    var eg_pic = '<img id="enneagram-pic" src="images/enneagram.png"></img>'
    $("h4, #check-dataset, #question, #enneagram .button-grid-item").remove();
    $(eg_pic).appendTo("#enneagram .buttons-grid-container");
    $('#toggle-data').prepend( $('#enneagram') );
    $("#enneagram").css("margin-bottom", "3rem").css("margin-top", "2rem");
    $("#toggle-data").fadeIn();

    // re-add span element
    $('#enneagram span').html("1 - Idealist<br>2 - Helper<br>3 - Achiever<br>4 - Individualist<br>5 - Investigator<br>6 - Loyalist<br>7 - Enthusaist<br>8 - Challenger<br>9 - Peacemaker");
    $('#sg span').remove();
    $('#mb span').html("E - Extrovert<br>I - Introvert<br>N - Intuitive<br>S - Sensing<br>T - Thinking<br>F - Feeling<br>P - Perceiving<br>J - Judging");

    // introduction
    var explanation = "<div id='explain' class='center'>Explore the community by using the filter on the left.</div>"
    $(explanation).hide().appendTo("#results");
    $("#explain").fadeIn();
    $("#explain").delay(3000).fadeOut();
  }, 6000);
}

function clusterDots(data) {
  dataset = order(data);
  var wholeWidth = $(".cluster").width();
  var wholeHeight = $(".cluster").height();
  var coordinates = [[wholeWidth/2, wholeHeight/2]];
  var x;
  var y;

  for (var i = 0; i < dataset.length; i++) {
    var member = dataset[i];
    if (member.id <= dataset.length) {

      var spacing = 5;
      var eg = member["Enneagram"];
      var dot_text = '<div class="fadingCircle ' + eg + '"' + ' id="' + member.id + '"></div>';

      var coordinate = randomCoordinate(eg);
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

      $(dot_text).hide().appendTo(".cluster").css('left', x).css('top', y);
      $("#" + member.id).delay(4500).fadeIn("slow");
    }
  }
}

function appropriateSpacing(x0, y0, coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    var x1 = coordinates[i][0];
    var y1 = coordinates[i][1];
    var spacing = 20;
    var direction = ["", ""];

    if (x1 - x0 < spacing && x1 - x0 >= 0) {
      direction[0] = "left";
    } else if (x1 - x0 <= 0 && x1 - x0 > -spacing) {
      direction[0] = "right";
    }

    if (y1 - y0 < spacing && y1 - y0 >= 0) {
      direction[1] = "up";
    } else if (y1 - y0 <= 0 && y1 - y0 > -spacing) {
      direction[1] = "down";
    }

    if (direction[0] != "" && direction[1] != "") {
      return direction;
    }

  }
  return ["ok", ""];
}

function randomCoordinate(eg, id) { // currently fixed cluster
  var wholeWidth = $(".cluster").width();
  var wholeHeight = $(".cluster").height();

  var xPart = wholeWidth*1/3;
  var yPart = wholeHeight*1/3;
  var randPosX = (Math.random()*xPart);
  var randPosY = (Math.random()*yPart);

  var x;
  var y;

  if (eg == "One") {
    x = Math.floor(randPosX + wholeWidth * 2/3);
    y = Math.floor(randPosY);
  } else if (eg == "Two") {
    x = Math.floor(randPosX + wholeWidth * 2/3);
    y = Math.floor(randPosY + wholeHeight * 1/3);
  } else if (eg == "Three") {
    x = Math.floor(randPosX + wholeWidth * 2/3);
    y = Math.floor(randPosY + wholeHeight * 2/3);
  } else if (eg == "Four") {
    x = Math.floor(randPosX + wholeWidth * 1/3);
    y = Math.floor(randPosY + wholeHeight * 2/3);
  } else if (eg == "Five") {
    x = Math.floor(randPosX);
    y = Math.floor(randPosY + wholeHeight * 2/3);
  } else if (eg == "Six") {
    x = Math.floor(randPosX);
    y = Math.floor(randPosY + wholeHeight * 1/3);
  } else if (eg == "Seven") {
    x = Math.floor(randPosX);
    y = Math.floor(randPosY + wholeHeight/2 * 1/6);
  } else if (eg == "Eight") {
    x = Math.floor(randPosX);
    y = Math.floor(randPosY);
  } else {
    x = Math.floor(randPosX + wholeWidth * 1/3);
    y = Math.floor(randPosY);
  }

  return [x, y];
}