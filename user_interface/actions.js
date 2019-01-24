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

function hideAll() {
    for (var i = 0; i < controlButtons.length; i += 1) {
        $('#' + controlButtons[i]).hide();
    };
};

function reset() {
    hideAll();
    $('#title_page').show();
};

function showOneItem(item) {
    hideAll();
    $('#' + item).show();
};

function oneChoice(choice_num) {
    for (var i = 1; i <= 4; i += 1) {
        if (i == choice_num) {
            $('#option_' + i).addClass('active');
        } else {
            $('#option_' + i).removeClass('active');
        };
    };
};

$(document).ready(function() {
    reset();
    // initializing clicks on navigation bar
    $('#home_button').click( function(event) {
        event.preventDefault();
        reset();
    });
    $('#create_card_button').click( function(event) {
        event.preventDefault();
        showOneItem('create_card');
        $('#card_created').hide();
    });
    $('#edit_card_button').click( function(event) {
        event.preventDefault();
        showOneItem('card_list');
    });
    $('#create_tag_button').click( function(event) {
        event.preventDefault();
        showOneItem('create_tag');
        $('#tag_created').hide();
    });
    $('#edit_tag_button').click( function(event) {
        event.preventDefault();
        showOneItem('tag_list');
    });
    $('#test_browse_button').click( function(event) {
        event.preventDefault();
        showOneItem('test_browse');
        $('#browse_window').hide();
        $('#start_browse_button').click( function(event) {
            event.preventDefault();
            $('#start_browse').hide();
            $('#browse_window').show();
        });
        $('#start_browse').show();
    });
    $('#test_choices_button').click( function(event) {
        event.preventDefault();
        showOneItem('test_choices');
        $('#choices_window').hide();
        $('#start_choices_button').click( function(event) {
            event.preventDefault();
            $('#start_choices').hide();
            $('#choices_window').show();
            $('#option_1').click( function() {
                oneChoice(1);
            });
            $('#option_2').click( function() {
                oneChoice(2);
            });
            $('#option_3').click( function() {
                oneChoice(3);
            });
            $('#option_4').click( function() {
                oneChoice(4);
            });
        });
        $('#start_choices').show();
    });
    $('#test_write_button').click( function(event) {
        event.preventDefault();
        showOneItem('test_write');
        $('#write_window').hide();
        $('#start_write_button').click( function(event) {
            event.preventDefault();
            $('#start_write').hide();
            $('#write_window').show();
        });
        $('#start_write').show();
    });
    $('#import_button').click( function(event) {
        event.preventDefault();
        showOneItem('import');
    });
    $('#export_button').click( function(event) {
        event.preventDefault();
        showOneItem('export');
    });
    // fliping card on click
    $('.flip-card .flip-card-inner').click( function() {
        $(this).closest('.flip-card').toggleClass('hover');
        $(this).css('transform, rotateX(180deg)');
    });
});