G.DRAW.ELEMENTS.DEG = {
  id_deg_input: document.getElementById("id_deg_input"),
  id_deg_button: document.getElementById("id_deg_button"),
  arr_xyz: [0,0,0],
};

//from Krasnouhov article in USSR Magazine "Family and School" 
G.ARR_CUBES_NOW = G.TEST.f_fig_from_family_and_school();


G.DRAW.ELEMENTS.DEG.f_renew = function(c_arr = undefined) {
  if (c_arr == undefined) {c_arr = G.ARR_CUBES_NOW;}

  G.DRAW.ELEMENTS.DEG.arr_xyz = G.DRAW.ELEMENTS.DEG.id_deg_input.value.split(',');

  //G.DRAW.CUBES.BORDERS.f_clear(true);
  var t_svg = G.DRAW.CUBES.POLYFORM.f_polycube_inscribe(c_arr, G.DRAW.ELEMENTS.DEG.arr_xyz, 0.75);

  G.DRAW.ELEMENTS.f_set_svg_sizes();
  G.DRAW.ELEMENTS.f_set_view_box();
  G.DRAW.ELEMENTS.f_clear_inner_html();
  G.DRAW.ELEMENTS.f_add_inner_html(t_svg);
};

console.log(G);


G.DRAW.ELEMENTS.TABLE.f_press_and_rotate = function (row_col) {
  var deg_03 = (row_col[0] == 0) ? 1 : 3;
  var i_edge_06 = row_col[1];
  var new_arr_cubes = G.AI.MOVE.f_edge_work(G.ARR_CUBES_NOW, i_edge_06, deg_03);
  G.ARR_CUBES_NOW = null;
  G.ARR_CUBES_NOW = new_arr_cubes;

  //alert(row_col[0] + " " + row_col[1]);
  G.DRAW.ELEMENTS.DEG.f_renew();
}

G.DRAW.ELEMENTS.TABLE.f_set_table(G.AI.SEPARATE.f_text_to_table_data(G.ARR_CUBES_NOW),
  G.DRAW.ELEMENTS.TABLE.f_press_and_rotate, G.AI.LEGAL.f_arr_legal());

console.log("SEP", G.AI.SEPARATE.f_text_to_table_data(G.ARR_CUBES_NOW));

G.DRAW.ELEMENTS.DEG.id_deg_button.onclick = function () {G.DRAW.ELEMENTS.DEG.f_renew();};

G.DRAW.ELEMENTS.DEG.f_renew();
G.DRAW.ELEMENTS.DEG.f_renew();

//console.log("G.AI.LEGAL.f_is_legal_move_row_col([1,5]", G.AI.LEGAL.f_is_legal_move_row_col([1,5]));
