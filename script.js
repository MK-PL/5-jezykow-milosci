$(function () {
	var base, counter = 0, answers = [];
	$("#progressBar").progressbar({value: 0});
	var changeQuestion = function() {
		$(".testBox p").prepend("Większe znaczenie dla mnie ma, gdy... ");
		$(".type1").attr("id",base[counter]["Type1"]);
		$(".type2").attr("id",base[counter]["Type2"]);
		$(".answer1").prepend(base[counter]["Answer1"]);
		$(".answer2").prepend(base[counter]["Answer2"]);
	};

	$.ajax({
		url: 'base.csv',
		success: function(data) {
			base = $.csv.toObjects(data);
			console.log(base);
			changeQuestion();
		}
	});
	
	$(".testUl li").on( "click", function(){
		var clickedLi = this;
		$(".fadeBox").fadeOut(200, function() {
			answers[counter] = $(clickedLi).prop("id");
			counter++;
			$("#progressBar").progressbar({value: (counter/30)*100});
			$( ".progressLabel" ).text( Math.round((counter/30)*100) + "%" );
			$(".testBox p").empty();
			$(".testBox span").empty();
			if (counter === 30) {
				$(".testBox").fadeOut(200, function() {
					var anwersScore = {A: 0, B: 0, C: 0, D: 0, E: 0};
					for (var i = 0; i < answers.length; i++) {
						switch(answers[i]) {
							case "A":
								anwersScore["A"]++;
								break;
							case "B":
								anwersScore["B"]++;
								break;
							case "C":
								anwersScore["C"]++;
								break;
							case "D":
								anwersScore["D"]++;
								break;
							case "E":
								anwersScore["E"]++;
								break;
						} 
					}
					$(".a").html("<span class='bold'>Wyrażenia afirmatywne: </span>" + anwersScore["A"] + " punktów");
					$(".b").html("<span class='bold'>Dobry czas: </span>" + anwersScore["B"] + " punktów");
					$(".c").html("<span class='bold'>Przyjmowanie podarunków: </span>" + anwersScore["C"] + " punktów");
					$(".d").html("<span class='bold'>Drobne przysługi: </span>" + anwersScore["D"] + " punktów");
					$(".e").html("<span class='bold'>Dotyk: </span>" + anwersScore["E"] + " punktów");
					$(".scoreBox").fadeIn(200);
				});
			}
			else {
				changeQuestion();
				$("input[type=checkbox]").prop('checked', false);
				$(".fadeBox").fadeIn(200);
			}
		});
	});
	
	$(".goToInfo").click(function() {
		$(".titleBox").fadeOut(400, function() {
			$(".fadeBox").show(1);
			$(".infoBox").fadeIn(400);
		});
	});
	
	$(".goToTest").click(function() {
		$(".infoBox").fadeOut(400, function() {
			$(".fadeBox").show(1);
			$(".testBox").fadeIn(400);
		});
	});	
	
	$(".goToStart").click(function() {
		$(".scoreBox").fadeOut(400, function() {
			$(".progressLabel").text("0%");
			$("#progressBar").progressbar({value: 0});
			counter = 0;
			answers = [];
			changeQuestion();
			$(".titleBox").fadeIn(400);
		});
	});	
});