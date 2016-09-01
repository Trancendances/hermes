function sendMail() {
    $.ajax({
        method: "POST",
        url: "newsletter/send",
        data: {
            subject: $("#subject").val(),
            content: $("#content").val()
        },
        success: () => {
            $("#sendmail").removeClass("btn-info");
            $("#sendmail").addClass("btn-success");
            $("#sendmail").val("All sent!");
        },
        error: () => {
            $("#sendmail").removeClass("btn-info");
            $("#sendmail").addClass("btn-danger");
            $("#sendmail").val("An error occured, sending aborted.");
        }
    });
}

$(document).ready(() => {
    $("#sendmail").on("click", () => {
        // Checking if fields are filled
        if($("#subject").val() && $("#content").val()) {
            // Changing the button style
            $("#sendmail").removeClass("btn-primary");
            $("#sendmail").addClass("btn-info");
            $("#sendmail").val("Sending...");
            // Send mail
            sendMail();
        } else {
            $("#sendmail").removeClass("btn-info");
            $("#sendmail").addClass("btn-warning");
            $("#sendmail").val("Please fill all the fields.");
        }
    });
});