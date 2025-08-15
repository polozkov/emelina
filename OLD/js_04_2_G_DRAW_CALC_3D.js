G.DRAW.CALC_3D = {
  f_arr_cubes_to_arr_connectors: function(arr_cubes, c_xy_final, half_of_side, deg_xyz, ratio_scale) {
    var arr_of_arr_4_points = [];

    function f_add_edge(old_center, old_edge, new_center, new_edge) {
      var ab = old_edge.f_get_pair_vertices(old_center, deg_xyz, ratio_scale, c_xy_final, half_of_side);
      var cd = new_edge.f_get_pair_vertices(new_center, deg_xyz, ratio_scale, c_xy_final, half_of_side);

      arr_of_arr_4_points.push([ab[0], ab[1], cd[0], cd[1]]);
    }

    //test edges of two cubes
    function f_test_two_cubes(i_old_cube, i_new_cube) {
      var old_cube = arr_cubes[i_old_cube];
      var old_edges = old_cube.arr_edges;
      var new_cube = arr_cubes[i_new_cube];
      var new_edges = new_cube.arr_edges;

      for (var i_old_edge = 0; i_old_edge < old_edges.length; i_old_edge++) {
        for (var i_new_edge = 0; i_new_edge < new_edges.length; i_new_edge++) {
          if ((old_edges[i_old_edge].i_next_cube == i_new_cube) && (new_edges[i_new_edge].i_next_cube == i_old_cube)) {
            f_add_edge(old_cube.center, old_edges[i_old_edge], new_cube.center, new_edges[i_new_edge]);
          }
        }
      }
    }

    for (var i_old_cube = 0; i_old_cube < (arr_cubes.length - 1); i_old_cube++) {
      for (var i_new_cube = i_old_cube + 1; i_new_cube < arr_cubes.length; i_new_cube++) {
        f_test_two_cubes(i_old_cube, i_new_cube);
      }
    }

    return arr_of_arr_4_points;
  }
};

