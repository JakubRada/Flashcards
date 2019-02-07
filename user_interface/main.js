// all divs to hide on the beggining
const controlButtons = [
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
    'tag_summary',
    'loading',
];

// basic url where django database is running
const database_path = "http://127.0.0.1:8000/cards/";

// hides everything
function hide_all() {
    for (let i = 0; i < controlButtons.length; i += 1) {
        $('#' + controlButtons[i]).hide();
    }
}

// showing title page
function reset() {
    hide_all();
    $('#title_page').show();
}

// showing one item based on passed argument
function show_one_item(item) {
    hide_all();
    $('#' + item).show();
}

// highlighting selected choice in choice-based test
function one_choice(choice_num) {
    for (let i = 1; i <= 4; i += 1) {
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

// choose tag to test
function test_main() {
    $("#test_tags_buttons").empty();
    load_information("tags").done(function(all_tags) {
        for (let tag of all_tags) {
            $(
                '<button type="button" class="btn btn-dark btn-lg btn-block">' + tag.tag_name + '</button>'
            ).unbind().click(tag.id, function(event) {
                test_type(event.data);
            }).appendTo("#test_tags_buttons");
        }
    });
    show_one_item("test_main");
}

// handles the reversed card switch
function is_reversed() {
    if ($("#reversed input:checkbox:checked").length == 1) {
        return true;
    } else {
        return false;
    }
}

// choose type of test
function test_type(tag_id) {
    show_one_item("test_type");
    $("#browse_button").unbind().click(function() {
        load_cards("browse", tag_id, is_reversed());
    });
    $("#choices_button").unbind().click(function() {
        load_cards("choices", tag_id, is_reversed());
    });
    $("#write_button").unbind().click(function() {
        load_cards("write", tag_id, is_reversed());
    });
}

// updates progress bar for browse test type
function update_browse_progress_bar(current, max) {
    current += 1;
    max += 1;
    let perc = Number(Math.round((current / max) * 100));
    $("#positive_progress").attr("style", "width: " + perc + "%");
    $("#positive_progress").text(current + " / " + max);
}

// flips card back before changing words
function change_flipcard(front, back) {
    var delay = 0;
    if ($("#is_flipped").hasClass("hover")) {
        $("#is_flipped").toggleClass("hover");
        delay = 400;
    }
    setTimeout(function () {
        $("#front_text").text(front);
        $("#back_text").text(back);
    }, delay);
}

// handles visibility of next and previous button in browse test type
function show_next_previous(current_index, max) {
    if (current_index == 0) {
        $("#browse_previous").hide();
        $("#browse_next").show();
    } else if (current_index + 1 == max) {
        $("#browse_next").hide();
        $("#browse_previous").show();
    } else {
        $("#browse_next").show();
        $("#browse_previous").show();
    }
}

// handles browse test type
function browse(all_cards) {
    var count = all_cards.length;
    var current_index = 0;
    $("#positive_progress").attr("aria-valuemax", count);
    update_browse_progress_bar(current_index ,count);
    change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
    show_one_item("test_browse");
    $("#browse_next").show();
    $("#browse_previous").hide();
    $("#progress_bar").show();
    $("#browse_next").unbind().click(function() {
        if (current_index < count){
            current_index += 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
            update_browse_progress_bar(current_index, count);
        }
        show_next_previous(current_index, count);
    });
    $("#browse_previous").unbind().click(function() {
        if (current_index > 0) {
            current_index -= 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
            update_browse_progress_bar(current_index, count);
        }
        show_next_previous(current_index, count);
    });
    $("#browse_back").unbind().click(function() {
        test_main();
    });
    $('.flip-card .flip-card-inner').unbind().click( function() {
        $(this).closest('.flip-card').toggleClass('hover');
    });
}

// loads all cards from specified tag
function load_cards(type, tag_id, is_reversed) {
    var all_cards = new Array();
    var index = 0;
    var meta;
    load_information("tags/" + tag_id).done(function(tag_info) {
        var all_card_ids = tag_info.cards;
        for (let card_id of all_card_ids) {
            load_information("cards/" + card_id).done(function(card_info) {
                if (is_reversed) {
                    meta = card_info.card_front;
                    card_info.card_front = card_info.card_back;
                    card_info.card_back = meta;
                }
                all_cards[index] = card_info;
                index += 1;
                if (index == all_card_ids.length) {
                    if (type == "browse"){
                        browse(all_cards);
                    } else if (type == "choices") {
                        choices(all_cards.length, 0, 0, [], 0, all_cards, tag_info);
                    } else {
                        write(all_cards.length, 0, 0, [], 0, all_cards, tag_info);
                    }
                }
            });
        }
    });
}

// updates progress bars in write and choices test types
function update_write_choices_progress_bar(type, correct, wrong, max) {
    $("#" + type + "_correct").attr("style", "width: " + (correct / max) * 100 + "%;");
    $("#" + type + "_wrong").attr("style", "width: " + (wrong / max) * 100 + "%;");
    $("#" + type + "_count").attr("style", "width: " + (1 - (correct + wrong) / max) * 100 + "%;");
    $("#" + type + "_correct").text(correct);
    $("#" + type + "_wrong").text(wrong);
    $("#" + type + "_count").text(max - (correct + wrong));
}

// change items to active if selected
function choose() {
    $('#option_1').unbind().click( function() {
        one_choice(1);
    });
    $('#option_2').unbind().click( function() {
        one_choice(2);
    });
    $('#option_3').unbind().click( function() {
        one_choice(3);
    });
    $('#option_4').unbind().click( function() {
        one_choice(4);
    });
}

// random selection of answers for choose test type
function get_random_choices(max, without, all_cards) {
    var value;
    var impossible = [without];
    var return_list = [null, null, null];
    var cycles = 3;
    if (max < 4) {
        cycles = max - 1;
    }
    for (let i = 0; i < cycles; i += 1) {
        value = without;
        while (impossible.includes(value)) {
            value = Math.floor(Math.random() * Math.floor(max));
        }
        return_list[i] = value;
        impossible[i + 1] = value;
    }
    return return_list;
}

// random placement of answers for choose test type
function get_random_index() {
    var return_list = new Array(4);
    var used = [null];
    var value = null;
    for (let i = 0; i < 4; i += 1) {
        while (used.includes(value)) {
            value = Math.floor(Math.random() * Math.floor(4));
        }
        return_list[i] = value;
        used[i] = value;
    }
    return return_list;
}

// show all choices if there are less than 4 cards
function show_all_choices() {
    for (let i = 1; i <= 4; i += 1) {
        $("#option_" + i).show();
    }
}

// activates one on the beggining
function activate_one() {
    for (let i = 1; i < 5; i += 1) {
        $("#option_" + i).removeClass("active");
    }
    for (let i = 1; i < 5; i += 1) {
        if ($("#option_" + i).is(":visible")) {
            $("#option_" + i).addClass("active");
            return;
        }
    }
}

// handles change of choices in choose test type
function choices(count, correct, wrong, answers, current_word_index, all_cards, tag_info) {
    update_write_choices_progress_bar("choices", correct, wrong, count);
    var current_card = all_cards[current_word_index];
    $("#choices_headline").text(current_card.card_front)
    show_all_choices();
    show_one_item('test_choices');
    var other_choices_indexes = get_random_choices(count, current_word_index, all_cards);
    var options = get_random_index();
    var selected;
    for (let i = 0; i < 4; i += 1) {
        if (options[i] == 0) {
            $("#option_" + (i + 1)).text(current_card.card_back);
        } else {
            if (other_choices_indexes[options[i] - 1] == null) {
                $("#option_" + (i + 1)).hide();
            } else {
                $("#option_" + (i + 1)).text(all_cards[other_choices_indexes[options[i] - 1]].card_back);
            }
        }
    }
    activate_one();
    choose();
    $("#choices_check_answer").unbind().click(function() {
        selected = selected_choice();
        $("#test_choices").hide();
        if (selected == options.indexOf(0)) {
            correct += 1;
            $("#correct_headline").text(current_card.card_front);
            $("#correct_correct_answer").text(current_card.card_back);
            $("#correct_answer").show();
            answers.push([
                true,
                current_card.card_front,
                current_card.card_back,
                current_card.card_back
            ]);
        } else {
            wrong += 1;
            $("#wrong_headline").text(current_card.card_front);
            $("#wrong_correct_answer").text(current_card.card_back);
            $("#wrong_wrong_answer").text(all_cards[other_choices_indexes[options[selected] - 1]].card_back);
            $("#wrong_answer").show();
            answers.push([
                false,
                current_card.card_front,
                all_cards[other_choices_indexes[options[selected] - 1]].card_back,
                current_card.card_back
            ]);
        }
        current_word_index += 1;
        $(".dismiss").unbind().click(function() {
            if (current_word_index == count) {
                summary(tag_info, correct, count, answers);
            } else {
                choices(count, correct, wrong, answers, current_word_index, all_cards, tag_info);
            }
        });
    });
}

// show summary of tested  tag
function summary(tag_info, correct, count, answers) {
    var success_rate = Math.round((correct / count) * 100);
    show_one_item("tag_summary");
    $("#tag_summary_headline").text(tag_info.tag_name);
    $("#success_rate").text(success_rate + "%");
    $("#total_summary").text(count);
    $("#correct_summary").text(correct);
    var difference = success_rate - tag_info.success_rate;
    if (difference < 0) {
        $("#improvement").hide();
        $("#impairment").text(difference + "%");
        $("#impairment").show();
    } else {
        $("#impairment").hide();
        $("#improvement").text("+" + difference + "%");
        $("#improvement").show();
    }
    $("#answers_button").unbind().click(function() {
        let color;
        $("#answers_table tbody").empty();
        console.log(answers);
        for (let answer of answers) {
            if (answer[0]) {
                color = "table-success";
            } else {
                color = "table-danger";
            }
            $(
                '<tr class="' + color + '"><td>' + answer[1] + '</td><td>' + answer[2] + '</td><td>' + answer[3] + '</td></tr>'
            ).appendTo("#answers_table tbody");
        }
    });
    console.log(create_tag_object(tag_info.id, tag_info.tag_name, success_rate, tag_info.card_count, tag_info.cards));
    $("#summary_back").unbind().click(function() {
        show_one_item("test_main");
    });
}

// finds what item was selected last
function selected_choice() {
    for (let i = 1; i < 5; i += 1) {
        if ($("#option_" + i).hasClass("active")) {
            return i - 1;
        }
    }
    return null;
}

// content of write test
function write(count, correct, wrong, answers, current_word_index, all_cards, tag_info) {
    update_write_choices_progress_bar("write", correct, wrong, count);
    var current_card = all_cards[current_word_index];
    $("#write_headline").text(current_card.card_front);
    $("#write_answer").val("");
    show_one_item('test_write');
    $("#check_write_answer").unbind().click(function(event) {
        event.preventDefault();
        var raw_answer = $("#write_answer").val().trim();
        current_word_index += 1;
        $("#test_write").hide();
        if (check_magic(raw_answer, current_card.card_back)) {
            correct += 1;
            $("#correct_headline").text(current_card.card_front);
            $("#correct_correct_answer").text(current_card.card_back);
            $("#correct_answer").show();
            answers.push([
                true,
                current_card.card_front,
                raw_answer,
                current_card.card_back
            ]);
        } else {
            wrong += 1;
            $("#wrong_headline").text(current_card.card_front);
            $("#wrong_wrong_answer").text(raw_answer);
            $("#wrong_correct_answer").text(current_card.card_back);
            $("#wrong_answer").show();
            answers.push([
                false,
                current_card.card_front,
                raw_answer,
                current_card.card_back
            ]);
        }
        $(".dismiss").unbind().click(function() {
            if (current_word_index == count) {
                summary(tag_info, correct, count, answers);
            } else {
                write(count, correct, wrong, answers, current_word_index, all_cards, tag_info);
            }
        });
    });
}

function check_magic(raw_input, correct_answer) {
    if (raw_input == correct_answer) {
        return true;
    } else {
        return false;
    }
}

// listing and editing/deleting cards
function list_cards_to_edit() {
    $("#table_of_cards tbody").empty();
    show_one_item("card_list");
    load_information("cards").done(function(card_list) {
        for (let card of card_list) {
            load_information("cards/" + card.id).done(function(card_info) {
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
        for (let tag of all_tags) {
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
            var front_input = $("#front_side_edit").val().trim();
            var back_input = $("#back_side_edit").val().trim();
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
                show_one_item("card_list");
            }
        });
    });
}

// listing and editing/deleting tags
function list_tags_to_edit() {
    $("#table_of_tags tbody").empty();
    show_one_item('tag_list');
    load_information("tags").done(function(tag_list) {
        for (let tag of tag_list) {
            load_information("tags/" + tag.id).done(function(tag_info) {
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
        var name_input = $("#tag_name_edit").val().trim();
        var all_tags_names = new Array();
        var index = 0;
        if (name_input !== "") {
            event.preventDefault();
            load_information("tags/").done(function(all_tags) {
                for (let tagg of all_tags) {
                    if (tag.tag_name !== tagg.tag_name) {
                        all_tags_names[index] = tagg.tag_name;
                        index += 1;
                    }
                }
                if (all_tags_names.includes(name_input)) {
                    $("#wrong_tag").modal("toggle");
                    $("#tag_name_create").val("");
                } else {
                    var tag_object = create_tag_object(tag.id, name_input, tag.success_rate, tag.card_count, tag.cards);
                    console.log(tag_object);
                    show_one_item("tag_list");
                    $("#created").modal("toggle");
                }
            });
        }
    });
}

// handles create card function
function create_card() {
    $("#create_card_tags").empty();
    $("#front_side_create").val("");
    $("#back_side_create").val("");
    show_one_item('create_card');
    // prepares html div for selected card
    load_information("tags").done(function(all_tags) {
        for (let tag of all_tags) {
            $(
                '<div class="col"><div class="form-check form-check-inline ml-5"><input class="custom-control-input" type="checkbox" id="' + tag.id + '_create"><label class="custom-control-label" for="' + tag.id + '_create">' + tag.tag_name + '</label></div></div>'
            ).appendTo("#create_card_tags");
        }
    });
    $("#create_card").show();
    // gets input information
    $("#save_new_card").unbind().click(function(event) {
        var front_input = $("#front_side_create").val().trim();
        var back_input = $("#back_side_create").val().trim();
        var checked = new Array();
        var index = 0;
        // inputs cannot be blank
        if (front_input !== "" && back_input !== "") {
            event.preventDefault();
            load_information("cards").done(function(all_cards) {
                if (card_is_unique(front_input, back_input, all_cards)) {
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
                } else {
                    $("#wrong_card").modal("toggle");
                    $("#front_side_create").val("");
                    $("#back_side_create").val("");
                }
            });
        }
    });
}

function card_is_unique(new_front, new_back, all_cards) {
    for (let card of all_cards) {
        if ((new_front == card.card_front) && (new_back == card.card_back)) {
            return false;
        }
    }
    return true;
}

// handles create tag function
function create_tag() {
    $("#tag_name_create").val("");
    show_one_item('create_tag');
    $("#save_new_tag").unbind().click(function(event) {
        var name_input = $("#tag_name_create").val().trim();
        var all_tags_names = new Array();
        var index = 0;
        if (name_input !== "") {
            event.preventDefault();
            load_information("tags/").done(function(all_tags) {
                for (let tag of all_tags) {
                    all_tags_names[index] = tag.tag_name;
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

// handles import of data into the application
function import_data() {
    show_one_item('import');
}

// handles export of data from the database
function export_data() {
    $("#export_input").val("");
    show_one_item('export');
    $("#confirm_export").unbind().click(function() {
        $("#loading").show();
        var filename = $("#export_input").val().trim();
        if (filename == "") {
            wrong_export_format("Filename cannot be an empty string!");
        } else if (filename.includes(" ")) {
            wrong_export_format("Filename cannot contain spaces!");
        } else if (contains_special_symbols(filename)) {
            wrong_export_format("Filename cannot contain special symbols");
        } else {
            console.log(filename + ".yml");
            $("#loading").hide();
        }
    });
}

function contains_special_symbols(string) {
    var charlist = '1234567890!@#$%^&*()=+[{}];:\'"\\|,<.>/?'.split("");
    console.log(charlist);
    for (let char of charlist) {
        if (string.includes(char)) {
            return true;
        }
    }
    return false;
}

function wrong_export_format(string) {
    $("#wrong_export_modal_content").text(string);
    $("#wrong_export_modal").modal("toggle");
    export_data();
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
        import_data();
    });
    $('#export_button').unbind().click( function(event) {
        event.preventDefault();
        export_data();
    });
});