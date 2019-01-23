var controlButtons = new Array(
    'progress_bar',
    'title_page',
    'card_list',
    'tag_list',
    'create_card',
    'create_tag',
    'edit_card',
    'edit_tag',
    'test_browse',
    'test_choices',
    'test_write',
    'import',
    'export',
    'correct_answer',
    'wrong_answer',
);

function reset() {
    for (var i = 0; i < controlButtons.length; i += 1) {
        if (controlButtons[i] == 'title_page') {
            $('#' + controlButtons[i]).show();
            console.log("shown");
        } else {
            $('#' + controlButtons[i]).hide();
            console.log('hidden');
        }
    }
}


$(document).ready(function() {
    reset();
    $('#create_card_button').click(function( event ) {
        event.preventDefault();
        console.log(123);
    });
});