G.DRAW.CUBES = {
  BORDERS: {
    min_max: [[+Infinity, +Infinity], [-Infinity, -Infinity]],
    f_get_min_max: function () { return [G.DRAW.CUBES.BORDERS.min_max[0].slice(), G.DRAW.CUBES.BORDERS.min_max[1].slice()]; },

    f_renew: function (xy) {
      G.DRAW.CUBES.BORDERS.min_max[0][0] = Math.min(G.DRAW.CUBES.BORDERS.min_max[0][0], xy[0]);
      G.DRAW.CUBES.BORDERS.min_max[1][0] = Math.max(G.DRAW.CUBES.BORDERS.min_max[1][0], xy[0]);

      G.DRAW.CUBES.BORDERS.min_max[0][1] = Math.min(G.DRAW.CUBES.BORDERS.min_max[0][1], xy[1]);
      G.DRAW.CUBES.BORDERS.min_max[1][1] = Math.max(G.DRAW.CUBES.BORDERS.min_max[1][1], xy[1]);
    },

    f_clear: function (do_clear = false) {
      if (do_clear)
        G.DRAW.CUBES.BORDERS.min_max = [[+Infinity, +Infinity], [-Infinity, -Infinity]];
    },

    f_renew_one_cube: function (n_xyz = [0, 0, 0], half_of_grid = 50, deg_xyz = [10, -20, 10], ratio_scale = 0.8) {
      function f(i12) {
        var edge_point_i12 = G.AI.CONSTANTS.ARR_12_EDGES[i12];
        var obj_edge = new G.F_EDGE(edge_point_i12);
        var ab_final = obj_edge.f_get_pair_vertices(n_xyz, deg_xyz, ratio_scale, [0,0], half_of_grid);

        G.DRAW.CUBES.BORDERS.f_renew(ab_final[0]);
        G.DRAW.CUBES.BORDERS.f_renew(ab_final[1]);
      }
      for (let i12 = 0; i12 < 12; i12 += 1) f(i12);
    },

    f_renew_arr_cubes_obj: function (arr_cubes, deg_xyz, half_grid, scale) {
      G.DRAW.CUBES.BORDERS.f_clear(true);
      for (let i_cube = 0; i_cube < arr_cubes.length; i_cube += 1) {
        let c = arr_cubes[i_cube];
        G.DRAW.CUBES.BORDERS.f_renew_one_cube(c.center, half_grid, deg_xyz);
      }
    }
  },

  SINGLE: {
    f_hidden_vertice: function (deg_xyz) {
      function f_value(i8) {
        var v_i8 = G.AI.ROTATIONS.f_rot_3_times(G.AI.CONSTANTS.ARR_8_VERTICES[i8], deg_xyz);
        return v_i8[2];
      }
      var best_result = 0;
      var best_value = f_value(0);
      function f_compare(t) {
        var new_value = f_value(t);
        if (new_value < best_value) {
          best_result = t;
          best_value = new_value;
        }
      }
      for (var i = 1; i < 8; i++) {
        f_compare(i);
      }

      return best_result;
    },

    f_12_intervals_of_visibility: function (deg_xyz) {
      var invisible_vertice = G.DRAW.CUBES.SINGLE.f_hidden_vertice(deg_xyz);
      var hidden_edges = G.AI.CONSTANTS.ARR_8_EDGES_TRIPLETS_indexes[invisible_vertice];

      var ab_visible_intervals = G.ARR.f_fill(12, 1);

      for (var i_hidden = 0; i_hidden < hidden_edges.length; i_hidden++) {
        ab_visible_intervals[hidden_edges[i_hidden]] = 0;
      }
      return ab_visible_intervals;
    },

    //cube with coordinates n_xyz;  SIDE = half_of_grid * 2 * scale;  rotated on three axis x,y,z by deg_xyz
    //cube's center is also rotated
    f_one_cube: function (c_xy_final, n_xyz = [0, 0, 0], half_of_grid = 50, deg_xyz = [10, -20, 10], ratio_scale = 0.8, obj_style = new G.DRAW.F_STYLE()) {
      var ab_visible_intervals = G.DRAW.CUBES.SINGLE.f_12_intervals_of_visibility(deg_xyz);

      function f(i12) {
        var edge_point_i12 = G.AI.CONSTANTS.ARR_12_EDGES[i12];
        var obj_edge = new G.F_EDGE(edge_point_i12);
        var ab_final = obj_edge.f_get_pair_vertices(n_xyz, deg_xyz, ratio_scale, c_xy_final, half_of_grid);

        //G.DRAW.CUBES.BORDERS.f_renew(ab_final[0]);
        //G.DRAW.CUBES.BORDERS.f_renew(ab_final[1]);

        return G.DRAW.PRIMITIVES.f_line_with_visible_interval(ab_final[0], ab_final[1], ab_visible_intervals[i12], obj_style);
      }

      return f(0) + f(1) + f(2) + f(3) + f(4) + f(5) + f(6) + f(7) + f(8) + f(9) + f(10) + f(11);
    }
  },
  POLYFORM: {}
};