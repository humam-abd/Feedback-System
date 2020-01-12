var questions;
function myFunction() {
	var x = document.getElementById("snackbar");
	x.className = "show";
	setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
$('#feedsub').click(function () {
	$.each($('[id^=feeds]'), function (i, item) {
		var feed = $(this).val();
		$.ajax({
			url: "/posted",
			data: {
				fds: feed,
				qIDs: questions[i]._id
			},
			error: function (err) {
				console.log("Error");
			},
			success: function (data) {
				$("#posts").html("<h3 id='thanks'>Your feedback has been successfully saved</h3>");
				$("#feedsub").hide();
				console.log("Success");
			},
			type: "post"
		})
	});
});

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
			if (ses.login == 2) {
				$("#logout").show();
				$("#login").hide();
				$("#addquest").hide();
				$("#posts").html("");
				$("#logmssg").hide();
				$("#feedsub").show();
				questions = data.quests;
				for (var i = 0; i < data.quests.length; i++) {
					$("#posts").append(
						'<div class="col-lg-12" id=feedDiv> ' +
						'<div class="col-lg-12" id="quests" style="margin-top:10px">' +
						'<p>' + data.quests[i].questn + '</p>' +
						'</div>' +
						'<input type="text" class="form__field"  id="feeds" name="feedb" style="text-align:center;color:black;">' +
						'</div>');
				}

			}
			else if (ses.login == 1) {
				$("#logout").show();
				$("#login").hide();
				$("#addquest").show();
				$("#posts").html("");
				for (var i = 0; i < data.quests.length; i++) {
					$("#posts").append(
						'<div class="col-lg-12" id="quests" style="margin-top:10px">' +
						'<p>' + data.quests[i].questn + '</p>' +
						'</div>'
					);
				}
			}
			else {
				$("#logout").hide();
				$("#login").show();
				$("#addquest").hide();
				for (var i = 0; i < data.quests.length; i++) {
					$("#posts").append(
						'<div class="col-lg-12" id="quests" style="margin-top:10px">' +
						'<p>' + data.quests[i].questn + '</p>' +
						'</div>'
					);
				}
			}

		},
		type: 'get'
	})

});



































