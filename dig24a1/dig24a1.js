$(function() {

    $('button.go-section').on('click', function (e) {
        const targetId = $(this).data('target-id');
        const target = $('#' + targetId);
        $('html').animate(
            {scrollTop: $('#' + targetId).offset().top}, 1000
        );
    });

});