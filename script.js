$(function () {
	var base, counter = 0, answers = [];
	$("#progressbar").progressbar({value: 0});
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
		$(".testBox").hide(1, function() {
			answers[counter] = $(clickedLi).prop("id");
			counter++;
			$("#progressbar").progressbar({value: (counter/30)*100});
			$( ".progress-label" ).text( Math.round((counter/30)*100) + "%" );
			$(".testBox p").empty();
			$(".testBox span").empty();
			if (counter === 30) {
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
				$(".a").text("Wyrażenia afrmatywne: " + anwersScore["A"]);
				$(".b").text("Dobry czas: " + anwersScore["B"]);
				$(".c").text("Przyjmowanie podarunków: " + anwersScore["C"]);
				$(".d").text("Drobne przysługi: " + anwersScore["D"]);
				$(".e").text("Dotyk: " + anwersScore["E"]);
				$(".scoreBox").show();
			}
			else {
				changeQuestion();
				$("input[type=checkbox]").prop('checked', false);
				$(".testBox").show();
			}
		});
	});
	
	$(".start").click(function() {
		$(".titleBox").hide(1, function() {
			$(".testBox").show();
		});
	});
	
	$(".return").click(function() {
		$(".scoreBox").hide(1, function() {
			$(".progress-label").text("0%");
			$("#progressbar").progressbar({value: 0});
			counter = 0;
			answers = [];
			changeQuestion();
			$(".titleBox").show();
		});
	});	
});