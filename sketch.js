let number_of_columns = 5;
let number_of_rows = 6;

let possible_words = []
let chosen_word = "";

let points = [];
let guesses = [];
let current_guess = "";

let letter = "";

function preload() {
  possible_words = loadStrings("words.txt");
}

function setup() {
  createCanvas(350, 350);
  chosen_word = random(possible_words);
}

function draw() {
  background(150);

  setup_points();
  draw_rectangles();

  draw_guesses();

}

function setup_points() {
  for (let index_x = 0; index_x < number_of_columns; index_x++) {
    empty_list = []
    for (let index_y = 0; index_y < number_of_rows; index_y++) {
      empty_list.push(-1);
    }
    points.push(empty_list);
  }
}

function draw_rectangles() {
  for (let index_x = 0; index_x < number_of_columns; index_x++) {
    for (let index_y = 0; index_y < number_of_rows; index_y++) {
      draw_rectangle(index_x, index_y);
    }
  }
}

function draw_rectangle(x_index, y_index) {
  size_percentage = 0.9;

  x_size = width / number_of_columns;
  y_size = height / number_of_rows;

  initial_x_position = x_size / 2;
  initial_y_position = y_size / 2;

  x_position = initial_x_position + x_size * x_index;
  y_position = initial_y_position + y_size * y_index;

  switch (points[x_index][y_index]) {
    case -1:
      fill(255);
      break;
    case 0:
      fill(50);
      break;
    case 1:
      fill(227, 202, 41);
      break;
    case 2:
      fill(0, 255, 0);
      break;

    default:
      fill(255);
      break;
  }

  noStroke();
  rectMode(CENTER);
  rect(x_position, y_position, x_size * size_percentage, y_size * size_percentage, 10);
}

function draw_text(x_index, y_index, string_to_show) {
  x_size = width / number_of_columns;
  y_size = height / number_of_rows;

  initial_x_position = x_size / 2;
  initial_y_position = y_size / 2;

  x_position = initial_x_position + x_size * x_index;
  y_position = initial_y_position + y_size * y_index;

  stroke(20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text(string_to_show, x_position, y_position);
}

function draw_guesses() {
  for (let index_y = 0; index_y < guesses.length; index_y++) {
    for (let index_x = 0; index_x < guesses[index_y].length; index_x++) {
      draw_text(index_x, index_y, guesses[index_y].charAt(index_x));
    }
  }
  for (let i = 0; i < current_guess.length; i++) {
    draw_text(i, guesses.length, current_guess.charAt(i));
  }
}

function keyPressed() {
  if (keyCode == BACKSPACE) {
    delete_letter();
  }
  if (current_guess.length == number_of_columns
    && keyCode == RETURN) {
    input_guess();
  }
  if (keyCode < 65 || keyCode > 90) {
    return;
  }
  letter = char(keyCode).toLowerCase();
  if (current_guess.length < number_of_columns) {
    current_guess += letter;
  }
}

function delete_letter() {
  if (current_guess.length > 0) {
    current_guess = current_guess.substring(0, current_guess.length - 1);
  }
}

function input_guess() {
  if (possible_words.indexOf(current_guess) != -1) {
    guesses.push(current_guess);
    current_guess = "";
    check_guesses();
  }
}

function check_guesses() {
  for (let current_guess_index = 0; current_guess_index < guesses.length; current_guess_index++) {
    chosen_word_copy = chosen_word;
    current_guess_copy = guesses[current_guess_index];

    // Exact match
    for (let letter_index = 0; letter_index < current_guess_copy.length; letter_index++) {
      if (chosen_word_copy.charAt(letter_index) == current_guess_copy.charAt(letter_index)) {
        console.log("Exact match");
        chosen_word_copy = replaceChar(chosen_word_copy, "2", letter_index);
        current_guess_copy = replaceChar(current_guess_copy, "2", letter_index);
      }
    }


    // Inexact match
    for (let index_current = 0; index_current < current_guess_copy.length; index_current++) {
      for (let index_chosen = 0; index_chosen < chosen_word_copy.length; index_chosen++) {

        if (current_guess_copy.charAt(index_current) == "2" ||
          current_guess_copy.charAt(index_current) == "1") {
          console.log("1 or 2");
          continue;
        }
        if (current_guess_copy.charAt(index_current) == chosen_word_copy.charAt(index_chosen)) {
          console.log("Inexact match");
          chosen_word_copy = replaceChar(chosen_word_copy, "1", index_chosen);
          current_guess_copy = replaceChar(current_guess_copy, "1", index_current);
        }
      }
    }

    // No matches
    for (let letter_index = 0; letter_index < current_guess_copy.length; letter_index++) {
      if (current_guess_copy.charAt(letter_index) == "2") {
        points[letter_index][current_guess_index] = 2;
      }
      else if (current_guess_copy.charAt(letter_index) == "1") {
        points[letter_index][current_guess_index] = 1;
      }
      else {
        points[letter_index][current_guess_index] = 0;
      }
    }
  }
}

function replaceChar(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}