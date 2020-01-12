function printDiv(divName) {
	var printContents = document.getElementById(divName).innerHTML;
	window.print(divName);
}

var feedbacks;
var questions;

function showfeed(j) {
	$("#report").html("");
	$("#reporthead").html("");
	$("#reporthead").html(questions[j].questn);
	for (var i = 0; i < feedbacks.length; i++) {
		if (feedbacks[i].questID == questions[j]._id) {
			$("#report").append(
				'<div class="card-body col-lg-4 crdnew">' +
				'<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">' +
				'<div class="card-header userID">User ID : <span>' + feedbacks[i].userID + '</span></div>' +
				'<div class="card-body">' +
				'<p class="card-text cardtext">Feedback : <span>' + feedbacks[i].feedb + '</span><p>' +
				'</div>' +
				'</div>' +
				'</div>'
			);

			$("#print").show();
		}
		$("#back").show();

	}
}
$(document).ready(function () {
	$.ajax({
		url: "http://localhost:8081/allq",
		data: {
			format: 'json'
		},
		error: function () {
			console.log("Invalid")
		},
		success: function (data) {
			ses = data.adSession;
			if (ses.login == 1) {
				$("#logout").show();
				$("#login").hide();
				$("#addquest").show();
			}
			else {
				$("#logout").hide();
				$("#login").show();
				$("#addquest").hide();
			}

			questions = data.quests;

			$("#report").html("");
			for (var j = 0; j < questions.length; j++) {
				console.log(questions[j].questn)
				$("#report").append(
					'<div class="col-lg-12" id="quests" style="margin-top:10px">' +
					'<button class="btn btn-outline-dark" onclick=showfeed(' + j + ') style="font-weight:bold"><a>' + questions[j].questn + '</a></button>' +
					'</div>' +
					'<div class="col-lg-12" id=feedDiv> ' +
					'</div>'
				);

			}
		},
		type: 'get'
	})


	$.ajax({
		url: "http://localhost:8081/allf",
		data: {
			format: 'json'
		},
		error: function () {
			console.log("Invalid")
		},
		success: function (result) {
			feedbacks = result.feeds;
			ses = result.usSession;
			if (ses.login == 1 || ses.login == 2) {
				$("#logout").show();
				$("#login").hide();
			}
			else {
				$("#logout").hide();
				$("#login").show();
			}

		},
		type: 'get'
	})
});