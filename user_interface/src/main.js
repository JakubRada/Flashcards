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
const database_path = "http://localhost:8000/cards/";

// hides everything
function hide_all() {
    let length = controlButtons.length
    for (let i = 0; i < length; i += 1) {
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

// sends post request into django database
function post_information(suffix, data) {
    $.ajax({
        type: 'POST',
        url: database_path + suffix,
        dataType: 'json',
        data: data,
        processData: false,
    });
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
function create_card_object(type, id, card_front, card_back, tags) {
    return JSON.stringify({
        "type": type,
        "id": id,
        "card_front": card_front,
        "card_back": card_back,
        "tag_count": tags.length,
        "tags": tags
    });
}

// creates JSON tag object for sending to database
function create_tag_object(type, id, tag_name, success_rate, card_count, cards) {
    return JSON.stringify({
        "type": type,
        "id": id,
        "tag_name": tag_name,
        "success_rate": success_rate,
        "card_count": card_count,
        "cards": cards
    });
}

// choose tag to test
function test_main() {
    $("#test_tags_buttons").empty();
    load_information("tags").done(function(all_tags) {
        for (let tag of all_tags) {
            $(
                '<button type="button" class="btn btn-dark btn-lg btn-block">' + tag.tag_name + '</button>'
            ).unbind().click([tag.id, tag.tag_name], function(event) {
                test_type(event.data[0], event.data[1]);
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
function test_type(tag_id, tag_name) {
    $("#tag_test").text(tag_name);
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
    $("#test_type_back").unbind().click(function() {
        test_main();
    });
}

// updates progress bar for browse test type
function update_browse_progress_bar(current, max) {
    current += 1;
    let perc = Number(Math.round((current / max) * 100));
    $("#positive_progress").attr("style", "width: " + perc + "%");
    $("#positive_progress").text(current + " / " + max);
}

// flips card back before changing words
function change_flipcard(front, back) {
    var delay = 0;
    if ($("#is_flipped").hasClass("hover")) {
        $("#is_flipped").toggleClass("hover");
        delay = 400; // change of words delayed so user cannot see a glimpse of the next card
    }
    setTimeout(function () {
        $("#front_text").text(front);
        $("#back_text").text(back);
    }, delay);
}

// handles visibility of next and previous button in browse test type
function show_next_previous(current_index, max) {
    if (max == 1) {
        $("#browse_previous").hide();
        $("#browse_next").hide()
    } else {
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
}

// handles browse test type
function browse(all_cards, tag_id) {
    // set initial values; reset flipcard and progressbar
    var count = all_cards.length;
    var current_index = 0;
    update_browse_progress_bar(current_index ,count);
    change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
    show_one_item("test_browse");
    $("#browse_previous").hide();
    if (count > 1) {
        $("#browse_next").show();
    } else {
        $("#browse_next").hide();
    }
    $("#progress_bar").show();
    // next card
    $("#browse_next").unbind().click(function() {
        if (current_index < count){
            current_index += 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
            update_browse_progress_bar(current_index, count);
        }
        show_next_previous(current_index, count);
    });
    // previous card
    $("#browse_previous").unbind().click(function() {
        if (current_index > 0) {
            current_index -= 1;
            change_flipcard(all_cards[current_index].card_front, all_cards[current_index].card_back);
            update_browse_progress_bar(current_index, count);
        }
        show_next_previous(current_index, count);
    });
    $("#browse_back").unbind().click(function() {
        test_type(tag_id);
    });
    // flips card on click
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
                // if is reversed, switch front and back (only in frontend, not in databse)
                if (is_reversed) {
                    meta = card_info.card_front;
                    card_info.card_front = card_info.card_back;
                    card_info.card_back = meta;
                }
                all_cards[index] = card_info;
                index += 1;
                if (index == all_card_ids.length) {
                    // if all cards loaded, start selected test type
                    all_cards = group_similar_cards(all_cards);
                    if (type == "browse"){
                        browse(all_cards, tag_id);
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

// unites cards with similar card fronts OR card backs into one element
function group_similar_cards(all_cards) {
    var return_card_list = [];
    for (let card of all_cards) {
        let contains_front = contains_similar_front(return_card_list, card.card_front);
        if(contains_front[0]) {
            // if they have same front, it groups their backs
            return_card_list[contains_front[1]].card_back += (", " + card.card_back);
        } else {
            return_card_list.push(card);
        }
    }
    return return_card_list;
}

// checks if list of cards contains card with same front as second argument
function contains_similar_front(card_list, card_front) {
    var i = 0;
    for (let card of card_list) {
        if (card.card_front == card_front) {
            return [true, i];
        }
        i += 1;
    }
    return [false, null];
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

// random set of answers for choose test type
function get_random_choices(max, without, all_cards) {
    var value;
    var impossible = [without];
    var return_list = [null, null, null];
    var same_back = count_same_backs(all_cards);
    var cycles = 3;
    if ((max - same_back) < 4) {
        cycles = max - 1;
        cycles -= same_back;
    }
    for (let i = 0; i < cycles; i += 1) {
        value = without;
        while (impossible.includes(value)) {
            value = Math.floor(Math.random() * Math.floor(max));
            if (is_in_generated_list(impossible, value, all_cards)) {
                value = without;
            } else {
                break;
            }
        }
        return_list[i] = value;
        impossible[i + 1] = value;
    }
    return return_list;
}

// if new randomly generated word has been aleready chosen -> there should not be any duplicate answers in choices
function is_in_generated_list(index_list, new_word_index, all_cards) {
    for (let index of index_list) {
        if (all_cards[index].card_back == all_cards[new_word_index].card_back) {
            return true;
        }
    }
    return false;
}

// counts cards with same backs as current_card
function count_same_backs(all_cards) {
    var same = 0;
    let length = all_cards.length;
    for (let i = 0; i < length; i += 1) {
        for (let n = 0; n < length; n += 1) {
            if (n != i) {
                if (all_cards[i].card_back == all_cards[n].card_back) {
                    same += 1;
                }
            }
        }
    }
    if (same == 0) {
        return 0;
    } else if (same == 2) {
        return 1;
    } else {
        return same / 2 - 1;
    }
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
    // deactivates previous choices
    for (let i = 1; i < 5; i += 1) {
        $("#option_" + i).removeClass("active");
    }
    // activating first choice from visible items
    for (let i = 1; i < 5; i += 1) {
        if ($("#option_" + i).is(":visible")) {
            $("#option_" + i).addClass("active");
            return;
        }
    }
}

// handles change of choices in choose test type
function choices(count, correct, wrong, answers, current_word_index, all_cards, tag_info) {
    // update progress bars and reset window
    update_write_choices_progress_bar("choices", correct, wrong, count);
    var current_card = all_cards[current_word_index];
    $("#choices_headline").text(current_card.card_front)
    show_all_choices();
    show_one_item('test_choices');
    // randomly choose other choices and place them in random order
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
    // selection
    activate_one();
    choose();
    // evaluating answer and printing result
    $("#choices_check_answer").unbind().click(function() {
        selected = selected_choice();
        $("#test_choices").hide();
        if (selected == current_card.card_back) {
            // correct choice
            correct += 1;
            $("#correct_headline").text(current_card.card_front);
            $("#correct_correct_answer").text(current_card.card_back);
            $("#correct_wrong_answer").empty();
            $("#correct_wrong_answer").text(current_card.card_back);
            $("#correct_answer").show();
            answers.push([
                true,
                current_card.card_front,
                current_card.card_back,
                current_card.card_back
            ]);
        } else {
            // wrong choice
            wrong += 1;
            $("#wrong_headline").text(current_card.card_front);
            $("#wrong_wrong_answer").empty();
            $("#wrong_correct_answer").text(current_card.card_back);
            $("#wrong_wrong_answer").text(selected);
            $("#wrong_answer").show();
            answers.push([
                false,
                current_card.card_front,
                selected,
                current_card.card_back
            ]);
        }
        current_word_index += 1;
        $(".dismiss").unbind().click(function() {
            if (current_word_index == count) {
                // if last question, show summary of the test
                summary(tag_info, correct, count, answers);
            } else {
                // else start choices with next word
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
    post_information("add_tag/", create_tag_object("test", tag_info.id, tag_info.tag_name, success_rate, tag_info.card_count, tag_info.cards));
    $("#summary_back").unbind().click(function() {
        $("#answers").collapse("hide");
        show_one_item("test_main");
    });
}

// finds what item was selected last
function selected_choice() {
    for (let i = 1; i < 5; i += 1) {
        if ($("#option_" + i).hasClass("active")) {
            return $("#option_" + i).text();
        }
    }
}

// content of write test
function write(count, correct, wrong, answers, current_word_index, all_cards, tag_info) {
    // set progress bars and reset window
    update_write_choices_progress_bar("write", correct, wrong, count);
    var current_card = all_cards[current_word_index];
    $("#write_headline").text(current_card.card_front);
    $("#write_answer").val("");
    show_one_item('test_write');
    $("#check_write_answer").unbind().click(function(event) {
        // evaluating answer
        event.preventDefault();
        var raw_answer = $("#write_answer").val().trim().toLowerCase();
        current_word_index += 1;
        $("#test_write").hide();
        var checked = check_magic(raw_answer, current_card.card_back.toLowerCase());
        if (checked[0]) {
            // correct answer
            correct += 1;
            $("#correct_headline").text(current_card.card_front);
            $("#correct_wrong_answer").empty();
            $("#correct_wrong_answer").append(checked[1]);
            $("#correct_correct_answer").text(current_card.card_back);
            $("#correct_answer").show();
            answers.push([
                true,
                current_card.card_front,
                checked[1],
                current_card.card_back
            ]);
        } else {
            // wrong answer
            wrong += 1;
            $("#wrong_headline").text(current_card.card_front);
            $("#wrong_wrong_answer").empty();
            $("#wrong_wrong_answer").append(checked[1]);
            $("#wrong_correct_answer").text(current_card.card_back);
            $("#wrong_answer").show();
            answers.push([
                false,
                current_card.card_front,
                checked[1],
                current_card.card_back
            ]);
        }
        $(".dismiss").unbind().click(function() {
            if (current_word_index == count) {
                // if last word, show summary of test
                summary(tag_info, correct, count, answers);
            } else {
                // else start write with next word
                write(count, correct, wrong, answers, current_word_index, all_cards, tag_info);
            }
        });
    });
}

// determines whether
function check_magic(raw_input, correct_answer) {
    var possible_answers = correct_answer.split(", ");
    var dist;
    // for multiple answer question, if user enters one of possibilities
    for (let answer of possible_answers) {
        dist = levenshtein_distance(raw_input, answer);
        if (dist[0]) {
            return [true, dist[1]];
        }
    }
    // if user tries to answer with all answers
    dist = levenshtein_distance(raw_input, correct_answer);
    if (dist[0]) {
        return [true, dist[1]]
    }
    return [false, dist[1]];
}

// calculates levenshtein distance between two strings and returns correct answer or answer with corrected mistakes
function levenshtein_distance(string_1, string_2) {
    // set up variables
    var str_1_len = string_1.length;
    var str_2_len = string_2.length;
    var cost;
    var matrix = new Array();
    var changes = [0];
    var return_str = "";
    var correct_span = "<span class='text-success'>";
    var wrong_span = "<span class='text-danger'>";
    var end_span = "</span>";
    // fill matrix with values for substitution, deletion, insertion
    matrix[0] = new Array();
    for (let i = 0; i < str_2_len + 1; i += 1) {
        matrix[0][i] = i;
    }
    for (let i = 1; i < str_1_len + 1; i += 1) {
        matrix[i] = new Array();
        matrix[i][0] = i;
        for (let j = 1; j < str_2_len + 1; j += 1) {
            cost = (string_1.charAt(i - 1) == string_2.charAt(j - 1)) ? 0: 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                Math.min(
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                )
            );
        }
    }
    console.table(matrix);
    // highlight wrong answer or typos in partly correct answer
    var ratio = (matrix[str_1_len][str_2_len]) / str_2_len;
    console.log(ratio);
    if (ratio < 0.3) {
        var x = 0;
        var y = 0;
        var x_increment = 1;
        var y_increment = 1;
        let max = Math.max(str_1_len, str_2_len)
        for (let i = 0; i < max; i += 1) {
            if (i >= str_1_len) {
                y_increment = 0;
                x += 1;
            } else if (i >= str_2_len) {
                x_increment = 0;
                y += 1;
            } else {
                x += 1;
                y += 1;
            }
            changes.push(matrix[y][x]);
            if (str_1_len == str_2_len) {
                if (matrix[y][x] <= matrix[y - y_increment][x - x_increment]) {
                    return_str += (correct_span + string_2[x - 1] + end_span);
                } else {
                    return_str += (wrong_span + string_1[y - 1] + end_span);
                }
            }
        }
        changes.push(matrix[y][x]);
        var longer;
        if (str_1_len < str_2_len) {
            longer = string_2;
        } else if (str_1_len > str_2_len) {
            longer = string_1;
        }
        if (str_1_len != str_2_len) {
            for (let i = 1; i <= max; i += 1) {
                if (changes[i] <= changes[i - 1]) {
                    return_str += (correct_span + longer[i - 1] + end_span);
                } else {
                    if (lower_after(changes, i, changes[i])) {
                        return_str += (correct_span + longer[i - 1] + end_span);
                    } else {
                        return_str += (wrong_span + longer[i - 1] + end_span);
                    }
                }
            }
        }
        return [true, return_str];
    } else {
        return [false, wrong_span + string_1 + end_span];
    }
}

// checks if error was addition of character
function lower_after(changes, index_from, value) {
    for (let i = index_from; i < changes.length - 1; i += 1) {
        if (changes[i] < value) {
            return true;
        }
    }
    return false;
}

// sorts list of cards by alphabetical order (front)
function sort_card_list(list) {
    return list.sort(function(a, b) {
        var x = a.card_front.toLowerCase();
        var y = b.card_front.toLowerCase();
        return x.localeCompare(y);
    });
}

// sorts list of tags by alphabetical order (name)
function sort_tag_list(list) {
    return list.sort(function(a, b) {
        var x = a.tag_name.toLowerCase();
        var y = b.tag_name.toLowerCase();
        return x.localeCompare(y);
    });
}

// listing and editing/deleting cards
function list_cards_to_edit() {
    $("#table_of_cards tbody").empty();
    show_one_item("card_list");
    load_information("cards").done(function(card_list) {
        card_list = sort_card_list(card_list);
        for (let i = 0; i < card_list.length; i += 1) {
            let card = card_list[i];
            $(
                '<tr id=c' + i + '></tr>'
            ).appendTo("#table_of_cards tbody");
            // for each card in database create line in table
            load_information("cards/" + card.id).done(function(card_info) {
                $(
                    '<th scope="row">' + (i + 1) + '</th><td>' + card_info.card_front + '</td><td>' + card_info.card_back + '</td><td><span class="badge badge-dark">' + card_info.tag_count + '</span></td><td><button type="button" class="btn btn-warning" id="edit_card_' + card_info.id + '">Edit</button> <button type="button" class="btn btn-danger" id="delete_card_' + card_info.id + '">Delete</button></td>'
                ).appendTo("#c" + i);
                $("#edit_card_" + card_info.id).unbind().click(function() {
                    edit_card(card_info);
                });
                $("#delete_card_" + card_info.id).unbind().click(function() {
                    $("#delete_conf").modal("toggle");
                    $("#yes").unbind().click(function() {
                        $("#delete_conf").modal("toggle");
                        post_information("add_card/", create_card_object("delete", card_info.id, card_info.card_front, card_info.card_back, card_info.tags));
                        list_cards_to_edit();
                    });
                });
            });
        }
    });
}

// handles edit of a card
function edit_card(card) {
    $("#card_list").hide();
    $("#front_side_edit").val(card.card_front);
    $("#back_side_edit").val(card.card_back);
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
        $("#cancel_card").unbind().click(function(event) {
            event.preventDefault();
            list_cards_to_edit();
        });
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
                post_information("add_card/", create_card_object("update", card.id, front_input, back_input, checked));
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
        tag_list = sort_tag_list(tag_list);
        for (let i = 0; i < tag_list.length; i += 1) {
            var tag = tag_list[i];
            $('<tr id=t' + i + '></tr>').appendTo("#table_of_tags tbody");
            load_information("tags/" + tag.id).done(function(tag_info) {
                $(
                    '<th scope="row">' + (i + 1) + '</th><td>' + tag_info.tag_name + '</td><td><span class="badge badge-dark">' + tag_info.card_count + '</span></td><td>' + tag_info.success_rate + '%</td><td><button type="button" class="btn btn-warning" id="edit_tag_' + tag_info.id + '">Edit</button> <button type="button" class="btn btn-danger" id="delete_tag_' + tag_info.id + '">Delete</button></td>'
                ).appendTo("#t" + i);
                $("#edit_tag_" + tag_info.id).unbind().click(function() {
                    edit_tag(tag_info);
                });
                $("#delete_tag_" + tag_info.id).unbind().click(function() {
                    $("#delete_conf").modal("toggle");
                    $("#yes").unbind().click(function() {
                        $("#delete_conf").modal("toggle");
                        post_information("add_tag/", create_tag_object("delete", tag_info.id, tag_info.tag_name, tag_info.success_rate, tag_info.card_count, tag_info.cards));
                        list_tags_to_edit();
                    });
                });
            });
        }
    });
}

// handles edit of a tag
function edit_tag(tag) {
    $("#tag_list").hide();
    $("#tag_name_edit").val(tag.tag_name);
    $("#edit_tag").show();
    $("#cancel_tag").unbind().click(function(event) {
        event.preventDefault();
        list_tags_to_edit();
    });
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
                    post_information("add_tag/", create_tag_object("update", tag.id, name_input, tag.success_rate, tag.card_count, tag.cards));
                    $("#created").modal("toggle");
                    list_tags_to_edit();
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
    $("#cancel").unbind().click(function(event) {
        event.preventDefault();
        reset();
    });
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
                    post_information("add_card/", create_card_object("new", "", front_input, back_input, checked));
                    create_card();
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

// determine if card already exists in database
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
    $("#cancel").unbind().click(function(event) {
        event.preventDefault();
        reset();
    });
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
                    var tag_object = create_tag_object("new", "", name_input, 0, 0, []);
                    post_information("add_tag/", tag_object);
                    create_tag();
                    $("#created").modal("toggle");
                }
            });
        }
    });
}

// handles import of data into the application
function import_data() {
    show_one_item('import');
    $("#confirm_import").unbind().click(function(event) {
        event.preventDefault();
        $("#loading").show();
        // get selected file for import
        try {
            const file = document.getElementById("import_input").files[0];
            $("#import_input").val("");
            if (file.name.endsWith(".csv")) {
                // reading file
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function() {
                    //processing data from file
                    post_information('import/', process_data(reader.result));
                    $("#loading").hide();
                    $("#response_title").text("Import");
                    $("#response_text").text("Data imported SUCCESSFULLY");
                    $("#response").modal('toggle');
                }
            } else {
                $("#wrong_import_modal").modal("toggle");
                $("#loading").hide();
            }
        } catch(e) {
            $("#loading").hide();
        }
    });
}

// splits and sorts tags to be correctly connected with words
function sort_tags_to_import(entries) {
    var tags = [];
    var cards = [];
    for (let entry of entries) {
        entry = entry.split(",");
        entry = $.map(entry, $.trim);
        if (entry[0] == "card") {
            cards.push(entry);
        } else if (entry[0] == "tag") {
            tags.push(entry);
        }
    }
    tags.sort(function(a, b) {
        return a[1] - b[1];
    });
    return tags.concat(cards);
}

// handles processing of data
function process_data(text) {
    var entries;
    // splits text to lines
    try {
        entries = text.split("\r\n");
    } catch(exception) {
        entries = text.split("\n");
    }
    entries = sort_tags_to_import(entries);
    var count = entries.length;
    var entry;
    var result = [[], []];
    var object;
    var tags;
    for (let i = 0; i < count; i += 1) {
        entry = entries[i];
        if (entry[0] == "card") {
            tags = entry[3].split("|").sort();
            for (let i = 0; i < tags.length; i += 1) {
                tags[i] = Number(tags[i]);
            }
            object = {id: "new", card_front: entry[1], card_back: entry[2], tag_count: tags.length, tags: tags};
            result[0].push(object);
        } else if (entry[0] == "tag") {
            object = {id: "new", tag_name: entry[2], success_rate: 0, card_count: 0};
            result[1].push(object);
        }
    }
    //console.log(filter_json(result));
    return filter_json(result);
}

// filters out jsons which contain invalid values
function filter_json(json_list) {
    let length = json_list[0].length;
    let json;
    let remove = [];
    for (let i = 0; i < length; i += 1) {
        json = json_list[0][i];
        if ((json.card_front == '') || (json.card_back == '') || (json.tag_count != json.tags.length)) {
            remove.push(i);
        }
    }
    for (let i = remove.length - 1; i >= 0; i -= 1) {
        json_list[0].splice(remove[i], 1);
    }
    length = json_list[1].length;
    remove = [];
    for (let i = 0; i < length; i += 1) {
        json = json_list[1][i];
        if ((json.tag_name == '') || (json.success_rate > 100) || (json.success_rate < 0)) {
            remove.push(i);
        }
    }
    for (let i = remove.length - 1; i >= 0; i -= 1) {
        json_list[1].splice(remove[i], 1);
    }
    return JSON.stringify({
        tags: json_list[1],
        cards: json_list[0]
    });
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
            prepare_data(filename);
        }
    });
}

// writes file with exported data
function write_file(filename, export_list) {
    var complete_string = "";
    var tag_list;
    for (let item of export_list[0]) {
        complete_string += (`tag, ${item.number}, ${item.tag_name}\n`);
    }
    for (let item of export_list[1]) {
        tag_list = [];
        for (let card_tag of item.tags) {
            for (let tag of export_list[0]) {
                if (card_tag == tag.id) {
                    tag_list.push(export_list[0].indexOf(tag) + 1).toString();
                }
            }
        }
        complete_string += (`card, ${item.card_front}, ${item.card_back}, ${tag_list.join("|")}\n`);
    }
    const file = require('fs');
    if (!file.stat("export", function(err, stats) {})) {
        file.mkdir("export", {recursive: true}, function(err) {});
    }
    file.writeFile(`export/${filename}.csv`, complete_string, function() {
        $("#loading").hide();
        $("#response_title").text("Export");
        $("#response_text").text("Data successfully exported into ");
        $("#path").text(`/${filename}.csv`);
        $("#response").modal('toggle');
    });
}

// prepares data to export
function prepare_data(filename) {
    var count = 0;
    var export_list = [[], []];
    var length;
    load_information("tags").done(function(tag_list) {
        length = tag_list.length;
        for (let tag of tag_list) {
            export_list[0].push({
                "type": "tag",
                "number": count + 1,
                "tag_name": tag.tag_name, 
                "id": tag.id
            });
            count += 1;
        }
    });
    load_information("cards").done(function(card_list) {
        length = card_list.length;
        count = 0;
        for (let card of card_list) {
            load_information("cards/" + card.id).done(function(card_info) {
                export_list[1].push({
                    "type": "card",
                    "card_front": card_info.card_front,
                    "card_back": card_info.card_back,
                    "tags": card_info.tags
                });
                count += 1;
                if (count == length) {
                    write_file(filename, export_list);
                    $("#loading").hide();
                }
            });
        }
    });
}

// determines if string contains special symbols and cannot be used for file name
function contains_special_symbols(string) {
    var charlist = '!@#$%^&*()=+[{}];:\'"\\|,<.>/?'.split("");
    for (let char of charlist) {
        if (string.includes(char)) {
            return true;
        }
    }
    return false;
}

// let user know that inputted filename is not correct
function wrong_export_format(string) {
    $("#wrong_export_modal_content").text(string);
    $("#wrong_export_modal").modal("toggle");
    $("#loading").hide();
    export_data();
}

// main, handle clicks on navigation bar
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