$(function() {

    // Handle button navigation
    // When buttons are clicked, they will look for the target 
    // element ID in a data attribute and animate to it. 
    // When the animation is finished, the section location is 
    // pushed onto into the address bar.
    const sectionButtons = $('button.go-section');
    sectionButtons.on('click', function (e) {
        const targetId = $(this).data('target-id');
        const target = $('#' + targetId);
        $('html,body')
            .animate(
                {scrollTop: $('#' + targetId).offset().top}, 1000
            )
            .promise()
            .done(function () {
                window.location.hash = '#' + targetId;
            });
    });


    // Handle image mouse over, fill and caption animation
    // When the image is moused over, the animation of the
    // fill and caption will begin. Once it's complete, clicking
    // will restore the state of original image.
    // While the image is being reset, the mouseover is unbound to 
    // ensure it doesn't fire again until the user mouses out of the image.

    const section2ImageToFill = $('#section2ImageToFill');
    const section2Image = $('#section2Image');
    const section2Overlay = $('#section2Overlay');
    const section2Caption = $('#section2Caption');

    // Will fill the section 2 image with an overlay box
    // which animates height and opacity over the top
    // of the image and a caption which co-animates down
    // at the same time.
    function handleFillSection2WithCaption(e) {
        section2Overlay
            .css({display: 'inline-block'})
            .animate({height: '512px', opacity: 1}, 500);
        section2Caption
            .css({display: 'inline-block'})
            .animate({top: '240px', opacity: 1}, 500);
    };

    // Restores the section 2 overlay and caption to it's original state
    // and unbinds the original mouseover until the user mouses out
    // and can safely restart the animation.
    function handleRestoreSection2(e) {
        section2Overlay.css({height: 0, opacity: 0, display: 'none'});
        section2Caption.css({top: 0, opacity: 0, display: 'none'});
        unbindSection2Mouseover();
    };

    // Binds the mouseover event to fill and animate the caption
    function bindSection2Mouseover() {
        section2Image.on('mouseover', handleFillSection2WithCaption);
    };

    // Unbinds the mouseover event to stop it firing when it shouldn't
    function unbindSection2Mouseover() {
        section2Image.off('mouseover', handleFillSection2WithCaption);
    };

    // Binds the original mouseover event again whenever the user
    // mouses out of the image.
    function bindSection2Mouseout() {
        section2Image.on('mouseout', bindSection2Mouseover);
    };

    // Binds the click event on the overlay to restore the section
    function bindSection2ClickRestore() {
        section2Overlay.on('click', handleRestoreSection2);
    };

    // Execute initial bindings
    bindSection2Mouseover();
    bindSection2Mouseout();
    bindSection2ClickRestore();


    // Will hide and show the final image based on the user triggering
    // by clicking the button. Button text should reflect the state of the 
    // image e.g. if it's hidden, the button says show, if it's shown, the
    // button says hide.
    // Uses the standard jQuery show/hide to handle the fade in as well as the
    // animate.
    const section3TriggerButton = $('#section3TriggerButton');
    const section3Image = $('#section3Image');

    // Sets the text of the button based on the current state of the image
    function setSection3TriggerButtonText() {
        const text = (
            section3TriggerButton.data('state') === 'hidden' 
                ? section3TriggerButton.data('hidden-text') 
                : section3TriggerButton.data('show-text')
        );
        section3TriggerButton.text(text);
    }

    // Handles the fade in or out based on the current state and
    // resets the text after successful animate.
    function handleFadeInSection3Image(e) {
        if (section3TriggerButton.data('state') === 'hidden') {
            section3Image.show('slow', function() {
                section3TriggerButton.data('state', 'visible');
                setSection3TriggerButtonText();
            });
        }
        else {
            section3Image.hide('slow', function() {
                section3TriggerButton.data('state', 'hidden');
                setSection3TriggerButtonText();
            });
        }
    };

    // Binds the button click event to trigger the fade in animation.
    function bindSection3TriggerButton() {
        section3TriggerButton.on('click', handleFadeInSection3Image);
    };

    // Execute initial bindings
    setSection3TriggerButtonText();
    bindSection3TriggerButton();

});