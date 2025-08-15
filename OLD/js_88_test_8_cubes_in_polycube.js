G.TEST.f_fig_from_family_and_school = function () {
  /*
  var arr_edges_8 = [[0,"F",1],[1,"D",2],[2,"B",3],[3,"D",4],[4,"F",5],[5,"D",6],[6,"F",7]];
  arr_edges_8 = G.AI.INPUT.f_string_to_edge_array_of_triplets(string_task_8);
  //console.log(arr_cubes_8);

  var arr_cubes_8 = G.AI.INPUT.f_arr_rectangle_block([8,1]);
  var ARR_8_CUBES = G.AI.INPUT.f_generate_cube_array(arr_edges_8, arr_cubes_8);
  return ARR_8_CUBES
  */

  /*
  var arr_edges_4_2 = G.AI.INPUT.f_string_to_edge_array_of_triplets("0f1 1f2 0r4 5f6 5_2 6_3 6f7");
  var arr_cubes_4_2 = G.AI.INPUT.f_arr_rectangle_block([4,2]);
  //arr_cubes_4_2[7].center = [2,2,2];
  var ARR_4_2_CUBES = G.AI.INPUT.f_generate_cube_array(arr_edges_4_2, arr_cubes_4_2);
  return ARR_4_2_CUBES;
*/
  //var string_task_8 = "0f1 1d2 2b3 3d4 4f5 5d6 6f7";
  //var string_task_4_2 = "0f1 1f2 0l4 5f6 5_2 6_3 6f7";
  var string_task_4_2 = "1f2 2f3 1l5 6f7 6_3 7_4 7f8";
  var arr_cubes = G.AI.INPUT.f_generate_start_rectangle_task(string_task_4_2);
  
  /*
  console.log("arr_cubes", arr_cubes);
  //console.log("G.AI.SEPARATE.f_gen_matrix_of_two_areas(arr_cubes)", G.AI.SEPARATE.f_gen_matrix_of_two_areas(arr_cubes, true));
  
  console.log(
    "\n\nf_polycube_to_arr_of_edges_separation\n",
    G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes),

    "\nf_polycube_to_areas_static_active",
    G.AI.SEPARATE.f_polycube_to_areas_static_active(arr_cubes),

    "\nf_polycube_to_edges_static_active",
    G.AI.SEPARATE.f_polycube_to_edges_static_active(arr_cubes),"\n\n\n"
  );
  
  */
  return  arr_cubes;
};
