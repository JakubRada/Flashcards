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

function browse() {
    showOneItem('test_browse');
    $('#browse_window').hide();
    $('#start_browse_button').click( function(event) {
        event.preventDefault();
        $('#start_browse').hide();
        $('#progress_bar').show();
        $('#browse_window').show();
        // fliping card on click
        $('.flip-card .flip-card-inner').click( function() {
            $(this).closest('.flip-card').toggleClass('hover');
            $(this).css('transform, rotateX(180deg)');
        });
    });
    $('#start_browse').show();
};

function choices() {
    showOneItem('test_choices');
    $('#choices_window').hide();
    $('#start_choices_button').click( function(event) {
        event.preventDefault();
        $('#start_choices').hide();
        $('#progress_bar').show();
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
};

function write() {
    showOneItem('test_write');
    $('#write_window').hide();
    $('#start_write_button').click( function(event) {
        event.preventDefault();
        $('#start_write').hide();
        $('#progress_bar').show();
        $('#write_window').show();
    });
    $('#start_write').show();
};

function edit_cards() {
    $("#table_of_cards tbody").empty();
    load_information("cards").done(function(card_list) {
        for (var index in card_list) {
            load_information("cards/" + card_list[index].id).done(function(card_info){
                $(
                    '<tr><th scope="row">' + card_info.id + '</th><td>' + card_info.card_front + '</td><td>' + card_info.card_back + '</td><td><span class="badge badge-dark">' + card_info.tag_count + '</span></td><td><button type="button" class="btn btn-warning">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_cards tbody");
            });
        };
    });
    showOneItem('card_list');
};

function edit_tags() {
    $("#table_of_tags tbody").empty();
    load_information("tags").done(function(tag_list) {
        for (var index in tag_list) {
            load_information("tags/" + tag_list[index].id).done(function(tag_info) {
                $(
                    '<tr><th scope="row">' + tag_info.id + '</th><td>' + tag_info.tag_name + '</td><td><span class="badge badge-dark">' + tag_info.card_count + '</span></td><td>' + tag_info.success_rate + '</td><td><button type="button" class="btn btn-warning">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_tags tbody");
            });
        };
    });
    showOneItem('tag_list');
};

function load_information(suffix) {
    return $.ajax({
        url: "http://127.0.0.1:8000/cards/" + suffix,
    });
};

$(document).ready(function() {
    reset();
    // clicks on navigation bar
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
        edit_cards();
    });
    $('#create_tag_button').click( function(event) {
        event.preventDefault();
        showOneItem('create_tag');
        $('#tag_created').hide();
    });
    $('#edit_tag_button').click( function(event) {
        event.preventDefault();
        edit_tags();
    });
    $('#test_browse_button').click( function(event) {
        event.preventDefault();
        browse();
    });
    $('#test_choices_button').click( function(event) {
        event.preventDefault();
        choices();
    });
    $('#test_write_button').click( function(event) {
        event.preventDefault();
        write();
    });
    $('#import_button').click( function(event) {
        event.preventDefault();
        showOneItem('import');
    });
    $('#export_button').click( function(event) {
        event.preventDefault();
        showOneItem('export');
    });
});