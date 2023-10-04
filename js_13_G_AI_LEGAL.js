G.AI.LEGAL = {
  f_is_legal_move_row_col: function (row_col, arr_cubes, areas_static_active, edges_static_active) {
    if (arr_cubes == undefined) {
      arr_cubes = G.ARR_CUBES_NOW;
    }
    if (areas_static_active == undefined) {
      areas_static_active = G.AI.SEPARATE.f_polycube_to_areas_static_active(arr_cubes);
    }
    if (edges_static_active == undefined) {
      edges_static_active = G.AI.SEPARATE.f_polycube_to_edges_static_active(arr_cubes);
    }
    
    let n_plus_minus_1 = (row_col[0] == 0) ? 1 : -1;

    var i_cube_static = edges_static_active[row_col[1]][0];
    var i_cube_active = edges_static_active[row_col[1]][1];
    var edge_xyz_absolute = G.AI.MOVE.f_edge_edge(arr_cubes, i_cube_static, i_cube_active);

    return !G.AI.D3.f_is_polycube_blocked_by_other_polycube(
      arr_cubes, ...areas_static_active[row_col[1]], edge_xyz_absolute, n_plus_minus_1
    );
  },

  f_arr_legal: function () {
    var m_2_7 = [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0]];

    for (let i_row = 0; i_row < 2; i_row+=1)
      for (let i_col = 0; i_col < 7; i_col+=1)
       m_2_7[i_row][i_col] = G.AI.LEGAL.f_is_legal_move_row_col([i_row, i_col]);

    //console.log("m_2_7", m_2_7);
    return m_2_7;
  }
};
