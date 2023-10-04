G.DRAW.CUBES.POLYFORM = {
  f_scale_translate: function (min_max_old, min_max_new) {
    var wh_old = [min_max_old[1][0] - min_max_old[0][0], min_max_old[1][1] - min_max_old[0][1]];
    var center_old = [(min_max_old[1][0] + min_max_old[0][0]) * 0.5, (min_max_old[1][1] + min_max_old[0][1]) * 0.5];
    
    var wh_new = [min_max_new[1][0] - min_max_new[0][0], min_max_new[1][1] - min_max_new[0][1]];
    var center_new = [(min_max_new[1][0] + min_max_new[0][0]) * 0.5, (min_max_new[1][1] + min_max_new[0][1]) * 0.5];

    var scale = Math.min(wh_new[0] / wh_old[0], wh_new[1] / wh_old[1]);
    var delta = [center_new[0] - center_old[0] * scale, center_new[1] - center_old[1] * scale];
    
    var ma = scale, mc = 0, me = delta[0];
    var mb = 0, md = scale, mf = delta[1];
    var my_string = 'matrix(' + ma + " " + mb + " " + mc + " " + md + " " + me + " " + mf + ')' 

    return '<g transform="' + my_string + '"> ';
  },

  f_polycube: function (arr_obj_cubes, c_xy_final = [0, 0, 0], half_grid = 50, deg_xyz = [-6, -12, 0], scale = 0.8) {
    var arr_obj_connector = G.DRAW.CALC_3D.f_arr_cubes_to_arr_connectors(arr_obj_cubes, c_xy_final, half_grid, deg_xyz, scale);
    var t_svg = "";

    function f_style(i) {
      return new G.DRAW.F_STYLE().f_set_stroke(G.DRAW.SETTING.RGB.arr_8_cubes[i]);
    }

    for (var i_cube = 0; i_cube < arr_obj_cubes.length; i_cube++) {
      t_svg += G.DRAW.CUBES.SINGLE.f_one_cube(c_xy_final, arr_obj_cubes[i_cube].center, half_grid, deg_xyz, scale, f_style(i_cube));
    }

    for (var i_c = 0; i_c < arr_obj_connector.length; i_c++) {
      t_svg += G.DRAW.PRIMITIVES.f_cross(arr_obj_connector[i_c]);
    }

    return t_svg;
  },

  f_polycube_inscride_points_of_view: function(arr_obj_cubes, deg_xyz, x01_y01, egde_rot, deg_rot_03, half_grid = 50, scale = 0.8) {
    
    var arr_obj_cubes_ROT = G.AI.MOVE.f_edge_work_all_cubes(arr_obj_cubes, egde_rot, deg_rot_03);

    G.DRAW.CUBES.BORDERS.f_clear(true);
    G.DRAW.CUBES.BORDERS.f_renew_arr_cubes_obj(arr_obj_cubes_ROT, deg_xyz, half_grid, scale);

    var min_max_old = G.DRAW.CUBES.BORDERS.f_get_min_max();
    var min_max_new = G.ARR.f_get_area_quarter([[0,0], G.DRAW.ELEMENTS.f_get_sizes_wh()], x01_y01);
    //var min_max_new = [[0,0], G.DRAW.ELEMENTS.f_get_sizes_wh()];
    //console.log("! min_max_old",min_max_old);
    var scale_translate = G.DRAW.CUBES.POLYFORM.f_scale_translate(min_max_old, min_max_new);

    var t_svg = G.DRAW.CUBES.POLYFORM.f_polycube(arr_obj_cubes_ROT, [0, 0, 0], 50, deg_xyz, scale);
    var svg_polycube = scale_translate + t_svg + ' </g> ';

    return svg_polycube;

  },

  f_polycube_inscribe: function(arr_obj_cubes, deg_xyz = [-6, -12, 0], scale = 0.8) {
    var svg_00 = G.DRAW.CUBES.POLYFORM.f_polycube_inscride_points_of_view(arr_obj_cubes, deg_xyz, [0,0], [1,1,0], 0);
    var svg_01 = G.DRAW.CUBES.POLYFORM.f_polycube_inscride_points_of_view(arr_obj_cubes, deg_xyz, [0,1], [0,1,1], 1);
    var svg_10 = G.DRAW.CUBES.POLYFORM.f_polycube_inscride_points_of_view(arr_obj_cubes, deg_xyz, [1,0], [1,0,1], 1);
    
    return svg_00 + svg_01 + svg_10;
    /*
    //console.log("G.DRAW.CUBES.BORDERS.min_max", G.DRAW.CUBES.BORDERS.min_max);
    var t_svg = G.DRAW.CUBES.POLYFORM.f_polycube(arr_obj_cubes, [0, 0, 0], 50, deg_xyz, scale);
    //console.log("G.DRAW.CUBES.BORDERS.min_max", G.DRAW.CUBES.BORDERS.min_max);
    
    console.log("arr_obj_cubes", arr_obj_cubes);

    var min_max_old = G.DRAW.CUBES.BORDERS.min_max;
    var min_max_new = [[0,0], G.DRAW.ELEMENTS.f_get_sizes_wh()];

    var scale_translate = G.DRAW.CUBES.POLYFORM.f_scale_translate(min_max_old, min_max_new);
    var svg_polycube = scale_translate + t_svg + ' </g> ';

    return svg_polycube;*/
  }
};