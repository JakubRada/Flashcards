// all divs to hide on the beggining
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

// basic url where django database is running
var database_path = "http://127.0.0.1:8000/cards/";

// hides everything
function hideAll() {
    for (var i = 0; i < controlButtons.length; i += 1) {
        $('#' + controlButtons[i]).hide();
    }
}

// showing title page
function reset() {
    hideAll();
    $('#title_page').show();
}

// showing one item based on passed argument
function showOneItem(item) {
    hideAll();
    $('#' + item).show();
}

// highlighting selected choice in choice-based test
function oneChoice(choice_num) {
    for (var i = 1; i <= 4; i += 1) {
        if (i == choice_num) {
            $('#option_' + i).addClass('active');
        } else {
            $('#option_' + i).removeClass('active');
        }
    }
}

// loading JSONs from django
function load_information(suffix) {
    return $.ajax({
        url: database_path + suffix,
        type: 'GET',
        dataType: 'json',
    });
}

// creates JSON card object for sending to database
function create_card_object(id, card_front, card_back, tags) {
    return {
        "id" : id,
        "card_front": card_front,
        "card_back": card_back,
        "tag_count": tags.length,
        "tags": tags
    };
}

// creates JSON tag object for sending to database
function create_tag_object(id, tag_name, success_rate, card_count, cards) {
    return {
        "id": id,
        "tag_name": tag_name,
        "success_rate": success_rate,
        "card_count": card_count,
        "cards": cards
    };
}

// content of browse test
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
}

// content of choices test
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
}

// content of write test
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
}

// listing and editing/deleting cards
function list_cards_to_edit() {
    $("#table_of_cards tbody").empty();
    load_information("cards").done(function(card_list) {
        for (var index in card_list) {
            load_information("cards/" + card_list[index].id).done(function(card_info) {
                $(
                    '<tr><th scope="row">' + card_info.id + '</th><td>' + card_info.card_front + '</td><td>' + card_info.card_back + '</td><td><span class="badge badge-dark">' + card_info.tag_count + '</span></td><td><button type="button" class="btn btn-warning" id="edit_card_' + card_info.id + '">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_cards tbody");
                $("#edit_card_" + card_info.id).click(function() {
                    edit_card(card_info);
                });
            });
        }
    });
    showOneItem('card_list');
}

// handles edit of a card
function edit_card(card) {
    $("#card_list").hide();
    $("#front_side_edit").attr("placeholder", card.card_front);
    $("#back_side_edit").attr("placeholder", card.card_back);
    $("#edit_card_tags").empty();
    // prepares html div for selected card
    load_information("tags").done(function(all_tags) {
        var tag;
        all_tags_list = all_tags;
        for (var index in all_tags) {
            tag = all_tags[index];
            $(
                '<div class="col"><div class="form-check form-check-inline ml-5"><input class="custom-control-input" type="checkbox" id="' + tag.id + '_edit"><label class="custom-control-label" for="' + tag.id + '_edit">' + tag.tag_name + '</label></div></div>'
            ).appendTo("#edit_card_tags");
            if (card.tags.includes(tag.id)) {
                $("#" + tag.id + "_edit").prop("checked", true);
            }
        }
    });
    $("#edit_card").show();
    // gets input information
    $("#save_card_changes").click(function(event) {
        var front_input = $("#front_side_edit").val();
        var back_input = $("#back_side_edit").val();
        var checked = new Array();
        var count = 0;
        // inputs cannot be blank
        if (front_input !== "" && back_input !== "") {
            event.preventDefault();
            // gets which checkboxes are checked when pressing the button
            $("#edit_card_tags input:checkbox:checked").each(function() {
                checked[count] = $(this).attr("id").split("_")[0];
                count += 1;
            });
            // creates JSON object
            var card_object = create_card_object(card.id, front_input, back_input, checked);
            console.log(card_object);
        }
    });
}

// handles edit of a tag
function edit_tag(tag) {
    $("#tag_list").hide();
    $("#tag_name_edit").attr("placeholder", tag.tag_name);
    $("#edit_tag").show();
    $("#save_tag_changes").click(function(event) {
        var name_input = $("#tag_name_edit").val();
        var all_tags_names = new Array();
        var count = 0;
        if (name_input !== "") {
            event.preventDefault();
            load_information("tags/").done(function(all_tags) {
                for (var i in all_tags) {
                    if (tag.tag_name !== all_tags[i].tag_name) {
                        all_tags_names[count] = all_tags[i].tag_name;
                        count += 1;
                    }
                }
                if (all_tags_names.includes(name_input)) {
                    $("#wrong_tag_edit").modal("toggle");
                } else {
                    var tag_object = create_tag_object(tag.id, name_input, tag.success_rate, tag.card_count, tag.cards);
                    console.log(tag_object);
                }
            });
        }
    });
}

// listing and editing/deleting tags
function list_tags_to_edit() {
    $("#table_of_tags tbody").empty();
    load_information("tags").done(function(tag_list) {
        for (var index in tag_list) {
            load_information("tags/" + tag_list[index].id).done(function(tag_info) {
                $(
                    '<tr><th scope="row">' + tag_info.id + '</th><td>' + tag_info.tag_name + '</td><td><span class="badge badge-dark">' + tag_info.card_count + '</span></td><td>' + tag_info.success_rate + '%</td><td><button type="button" class="btn btn-warning" id="edit_tag_' + tag_info.id + '">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_tags tbody");
                $("#edit_tag_" + tag_info.id).click(function() {
                    edit_tag(tag_info);
                });
            });
        }
    });
    showOneItem('tag_list');
}


// main
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
        list_cards_to_edit();
    });
    $('#create_tag_button').click( function(event) {
        event.preventDefault();
        showOneItem('create_tag');
        $('#tag_created').hide();
    });
    $('#edit_tag_button').click( function(event) {
        event.preventDefault();
        list_tags_to_edit();
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