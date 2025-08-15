//what we do with SVG html element
G.DRAW.ELEMENTS = {
  TABLE: {},

  //main SVG for drawing puzzle
  SVG: document.getElementById("id_main_svg"),
  DEG: {},

  f_get_coords: function(elem) {
    let box = elem.getBoundingClientRect();
  
    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  },

  //width and heigth in pixels
  f_get_sizes_wh: function(svg = G.DRAW.ELEMENTS.SVG) {
    var w = svg.clientWidth;
    var h = svg.clientHeight;
    return [w, h, 0];
  },

  f_set_svg_sizes: function(svg = G.DRAW.ELEMENTS.SVG) {
    var table = document.getElementById("id_table");
    var bottom = G.DRAW.ELEMENTS.f_get_coords(table).bottom;
    var svg_y = document.documentElement.clientHeight - bottom;
    var svg_x = document.documentElement.clientWidth;
    svg.style.height = Math.floor(svg_y) + "px";
    svg.style.width = Math.floor(svg_x) + "px";
  },

  //SVG viewBox is equal to svg sizes
  f_set_view_box: function(svg = G.DRAW.ELEMENTS.SVG) {
    var wh = G.DRAW.ELEMENTS.f_get_sizes_wh(svg);
    svg.setAttribute("viewBox", '0 0 ' + wh[0] + ' ' + wh[1]);
    svg.wh = wh.slice();
  },

  f_add_inner_html: function(innerHTML, svg = G.DRAW.ELEMENTS.SVG) {
    svg.innerHTML = svg.innerHTML + innerHTML;
  },

  f_clear_inner_html: function (svg = G.DRAW.ELEMENTS.SVG) {
    svg.innerHTML = "";
  }
};

G.DRAW.ELEMENTS.TABLE = {
  f_press_table_cell: function(row_col) {
    console.log("EVENT row_col (" + row_col[0] + "," + row_col[1] + ") ");
  },

  f_set_inner_html_data_in_table: function(row_col, value, f_press_table_cell = G.DRAW.ELEMENTS.TABLE.f_press_table_cell, is_legal = 0) {
    var id = 'id_' + row_col[0] + '_' + row_col[1];
    document.getElementById(id).innerHTML = value;

    document.getElementById(id).style.backgroundColor = G.DRAW.SETTING.RGB.arr_is_move_illegal_or_legal[is_legal ? 1 : 0];

    document.getElementById(id).onclick = (function() {
      f_press_table_cell(row_col);
      G.DRAW.ELEMENTS.TABLE.f_set_table(G.AI.SEPARATE.f_text_to_table_data(G.ARR_CUBES_NOW),
      G.DRAW.ELEMENTS.TABLE.f_press_and_rotate, G.AI.LEGAL.f_arr_legal());
    })
  },

  f_set_table: function(matrix_2_7_text, f_press_table_cell = G.DRAW.ELEMENTS.TABLE.f_press_table_cell, arr_are_legal = [[1,0,0,0,0,0,0],[0,0,0,0,0,0,0]]) {

    function f_inner_html(row, col) {
      return matrix_2_7_text[row][col];
    }

    for (let i_row = 0; i_row < 2; i_row+=1)
    for (let i_col = 0; i_col < 7; i_col+=1)
      G.DRAW.ELEMENTS.TABLE.f_set_inner_html_data_in_table([i_row, i_col], f_inner_html(i_row, i_col), f_press_table_cell, arr_are_legal[i_row][i_col]);
  },
};