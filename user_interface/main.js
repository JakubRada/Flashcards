// all divs to hide on the beggining
var controlButtons = [
    'progress_bar',
    'title_page',
    'card_list',
    'tag_list',
    'create_card',
    'create_tag',
    'edit_card',
    'edit_tag',
    'test_main',
    'test_type',
    'test_browse',
    'test_choices',
    'test_write',
    'import',
    'export',
    'correct_answer',
    'wrong_answer',
];

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

function test_main() {
    $("#test_tags_buttons").empty();
    load_information("tags").done(function(all_tags) {
        for (var i in all_tags) {
            $(
                '<button type="button" class="btn btn-dark btn-lg btn-block">' + all_tags[i].tag_name + '</button>'
            ).unbind().click(all_tags[i].id, function(event) {
                test_type(event.data);
            }).appendTo("#test_tags_buttons");
        }
    });
    showOneItem("test_main");
}

function is_reversed() {
    if ($("#reversed input:checkbox:checked").length == 1) {
        return true;
    } else {
        return false;
    }
}

function test_type(tag_id) {
    showOneItem("test_type");
    $("#browse_button").unbind().click(function() {
        load_browse(tag_id, is_reversed());
    });
    $("#choices_button").unbind().click(function() {
        choices(tag_id, is_reversed());
    });
    $("#write_button").unbind().click(function() {
        write(tag_id, is_reversed());
    });
}

function update_progress_bar(current, max) {
    current += 1;
    max += 1;
    var perc = Number(Math.round((current / max) * 100));
    $("#positive_progress").attr("style", "width: " + perc + "%");
    $("#positive_progress").attr("aria-valuenow", current);
    $("#positive_progress").text(current + " / " + max);
}

function change_flipcard(front, back, is_reversed) {
    var delay = 0;
    if ($("#is_flipped").hasClass("hover")) {
        $("#is_flipped").toggleClass("hover");
        delay = 400;
    }
    setTimeout(function () {
        if (is_reversed) {
            $("#front_text").text(back);
            $("#back_text").text(front);
        } else {
            $("#front_text").text(front);
            $("#back_text").text(back);
        }
    }, delay);
}

function showNextPrevious(type, current_index, max) {
    if (current_index == 0) {
        $("#" + type + "_previous").hide();
        $("#" + type + "_next").show();
    } else if (current_index == max) {
        $("#" + type + "_next").hide();
        $("#" + type + "_previous").show();
    } else {
        $("#" + type + "_next").show();
        $("#" + type + "_previous").show();
    }
}

function browse(all_cards, is_reversed) {
    var count = all_cards.length;
    var current_index = 0;
    $("#positive_progress").attr("aria-valuemax", count);
    update_progress_bar(current_index ,count);
    change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back, is_reversed);
    showOneItem("test_browse");
    $("#browse_next").show();
    $("#browse_previous").hide();
    $("#progress_bar").show();
    $("#browse_next").unbind().click(function() {
        if (current_index < count){
            current_index += 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back, is_reversed);
            update_progress_bar(current_index, count);
        }
        showNextPrevious("browse", current_index, count);
    });
    $("#browse_previous").unbind().click(function() {
        if (current_index > 0) {
            current_index -= 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back, is_reversed);
            update_progress_bar(current_index, count);
        }
        showNextPrevious("browse", current_index, count);
    });
    $("#browse_back").unbind().click(function() {
        test_main();
    });
    $('.flip-card .flip-card-inner').unbind().click( function() {
        $(this).closest('.flip-card').toggleClass('hover');

    });
}

function load_browse(tag_id, is_reversed) {
    var all_cards = new Array();
    var index = 0;
    load_information("tags/" + tag_id).done(function(tag_info) {
        var all_card_ids = tag_info.cards;
        for (var i in all_card_ids) {
            load_information("cards/" + all_card_ids[i]).done(function(card_info) {
                all_cards[index] = card_info;
                index += 1;
                if ((index + 1) == all_card_ids.length) {
                    browse(all_cards, is_reversed);
                }
            });
        }
    });
}

// content of choices test
function choices(tag_id) {
    showOneItem('test_choices');
    $('#start_choices_button').unbind().click( function(event) {
        event.preventDefault();
        $('#start_choices').hide();
        $('#progress_bar').show();
        $('#choices_window').show();
        $('#option_1').unbind().click( function() {
            oneChoice(1);
        });
        $('#option_2').unbind().click( function() {
            oneChoice(2);
        });
        $('#option_3').unbind().click( function() {
            oneChoice(3);
        });
        $('#option_4').unbind().click( function() {
            oneChoice(4);
        });
    });
    $('#start_choices').show();
}

// content of write test
function write(tag_id) {
    showOneItem('test_write');
    $('#write_window').hide();
    $('#start_write_button').unbind().click( function(event) {
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
    showOneItem("card_list");
    load_information("cards").done(function(card_list) {
        for (var i in card_list) {
            load_information("cards/" + card_list[i].id).done(function(card_info) {
                $(
                    '<tr><th scope="row">' + card_info.id + '</th><td>' + card_info.card_front + '</td><td>' + card_info.card_back + '</td><td><span class="badge badge-dark">' + card_info.tag_count + '</span></td><td><button type="button" class="btn btn-warning" id="edit_card_' + card_info.id + '">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_cards tbody");
                $("#edit_card_" + card_info.id).unbind().click(function() {
                    edit_card(card_info);
                });
            });
        }
    });
}

// handles edit of a card
function edit_card(card) {
    $("#card_list").hide();
    $("#front_side_edit").val("");
    $("#back_side_edit").val("");
    $("#front_side_edit").attr("placeholder", card.card_front);
    $("#back_side_edit").attr("placeholder", card.card_back);
    $("#edit_card_tags").empty();
    // prepares html div for selected card
    load_information("tags").done(function(all_tags) {
        var tag;
        for (var i in all_tags) {
            tag = all_tags[i];
            $(
                '<div class="col"><div class="form-check form-check-inline ml-5"><input class="custom-control-input" type="checkbox" id="' + tag.id + '_edit"><label class="custom-control-label" for="' + tag.id + '_edit">' + tag.tag_name + '</label></div></div>'
            ).appendTo("#edit_card_tags");
            if (card.tags.includes(tag.id)) {
                $("#" + tag.id + "_edit").prop("checked", true);
            }
        }
        $("#edit_card").show();
        // gets input information
        $("#save_card_changes").unbind().click(function(event) {
            var front_input = $("#front_side_edit").val();
            var back_input = $("#back_side_edit").val();
            var checked = new Array();
            var index = 0;
            // inputs cannot be blank
            if (front_input !== "" && back_input !== "") {
                event.preventDefault();
                // gets which checkboxes are checked when pressing the button
                $("#edit_card_tags input:checkbox:checked").each(function() {
                    checked[index] = $(this).attr("id").split("_")[0];
                    index += 1;
                });
                // creates JSON object
                var card_object = create_card_object(card.id, front_input, back_input, checked);
                console.log(card_object);
                $("#created").modal("toggle");
                showOneItem("card_list");
            }
        });
    });
}

// listing and editing/deleting tags
function list_tags_to_edit() {
    $("#table_of_tags tbody").empty();
    showOneItem('tag_list');
    load_information("tags").done(function(tag_list) {
        for (var i in tag_list) {
            load_information("tags/" + tag_list[i].id).done(function(tag_info) {
                $(
                    '<tr><th scope="row">' + tag_info.id + '</th><td>' + tag_info.tag_name + '</td><td><span class="badge badge-dark">' + tag_info.card_count + '</span></td><td>' + tag_info.success_rate + '%</td><td><button type="button" class="btn btn-warning" id="edit_tag_' + tag_info.id + '">Edit</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete_conf">Delete</button></td></tr>'
                ).appendTo("#table_of_tags tbody");
                $("#edit_tag_" + tag_info.id).unbind().click(function() {
                    edit_tag(tag_info);
                });
            });
        }
    });
}

// handles edit of a tag
function edit_tag(tag) {
    $("#tag_list").hide();
    $("#tag_name_edit").val("");
    $("#tag_name_edit").attr("placeholder", tag.tag_name);
    $("#edit_tag").show();
    $("#save_tag_changes").unbind().click(function(event) {
        var name_input = $("#tag_name_edit").val();
        var all_tags_names = new Array();
        var index = 0;
        if (name_input !== "") {
            event.preventDefault();
            load_information("tags/").done(function(all_tags) {
                for (var i in all_tags) {
                    if (tag.tag_name !== all_tags[i].tag_name) {
                        all_tags_names[index] = all_tags[i].tag_name;
                        index += 1;
                    }
                }
                if (all_tags_names.includes(name_input)) {
                    $("#wrong_tag").modal("toggle");
                    $("#tag_name_create").val("");
                } else {
                    var tag_object = create_tag_object(tag.id, name_input, tag.success_rate, tag.card_count, tag.cards);
                    console.log(tag_object);
                    showOneItem("tag_list");
                    $("#created").modal("toggle");
                }
            });
        }
    });
}

function create_card() {
    $("#create_card_tags").empty();
    $("#front_side_create").val("");
    $("#back_side_create").val("");
    showOneItem('create_card');
    // prepares html div for selected card
    load_information("tags").done(function(all_tags) {
        var tag;
        for (var i in all_tags) {
            tag = all_tags[i];
            $(
                '<div class="col"><div class="form-check form-check-inline ml-5"><input class="custom-control-input" type="checkbox" id="' + tag.id + '_create"><label class="custom-control-label" for="' + tag.id + '_create">' + tag.tag_name + '</label></div></div>'
            ).appendTo("#create_card_tags");
        }
    });
    $("#create_card").show();
    // gets input information
    $("#save_new_card").unbind().click(function(event) {
        var front_input = $("#front_side_create").val();
        var back_input = $("#back_side_create").val();
        var checked = new Array();
        var index = 0;
        // inputs cannot be blank
        if (front_input !== "" && back_input !== "") {
            event.preventDefault();
            // gets which checkboxes are checked when pressing the button
            $("#create_card_tags input:checkbox:checked").each(function() {
                checked[index] = $(this).attr("id").split("_")[0];
                index += 1;
            });
            // creates JSON object
            var card_object = create_card_object("new", front_input, back_input, checked);
            console.log(card_object);
            card_object = null;
            reset();
            $("#created").modal("toggle");
        }
    });
}

function create_tag() {
    $("#tag_name_create").val("");
    showOneItem('create_tag');
    $("#save_new_tag").unbind().click(function(event) {
        var name_input = $("#tag_name_create").val();
        var all_tags_names = new Array();
        var index = 0;
        if (name_input !== "") {
            event.preventDefault();
            load_information("tags/").done(function(all_tags) {
                for (var i in all_tags) {
                    all_tags_names[index] = all_tags[i].tag_name;
                    index += 1;
                }
                if (all_tags_names.includes(name_input)) {
                    $("#wrong_tag").modal("toggle");
                    $("#tag_name_create").val("");
                } else {
                    var tag_object = create_tag_object("new", name_input, 0, 0, []);
                    console.log(tag_object);
                    reset();
                    $("#created").modal("toggle");
                }
            });
        }
    });
}

// main
$(document).ready(function() {
    reset();
    // clicks on navigation bar
    $('#home_button').unbind().click( function(event) {
        event.preventDefault();
        reset();
    });
    $('#create_card_button').unbind().click( function(event) {
        event.preventDefault();
        create_card();
    });
    $('#edit_card_button').unbind().click( function(event) {
        event.preventDefault();
        list_cards_to_edit();
    });
    $('#create_tag_button').unbind().click( function(event) {
        event.preventDefault();
        create_tag();
    });
    $('#edit_tag_button').unbind().click( function(event) {
        event.preventDefault();
        list_tags_to_edit();
    });
    $('#test_button').unbind().click( function(event) {
        event.preventDefault();
        test_main();
    });
    $('#import_button').unbind().click( function(event) {
        event.preventDefault();
        showOneItem('import');
    });
    $('#export_button').unbind().click( function(event) {
        event.preventDefault();
        showOneItem('export');
    });
});