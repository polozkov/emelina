G.AI.SEPARATE = {
  f_polycubes_to_arr_of_edges: function (arr_cubes) {
    var LEN = arr_cubes.length;
    var arr_pairs = [];

    function f_test_i_cube_i_edge(i_cube, i_edge) {
      var j_cube = arr_cubes[i_cube].arr_edges[i_edge].i_next_cube;
      if (i_cube < j_cube)
        arr_pairs.push([i_cube, j_cube]);
    }

    for (var i_cube = 0; i_cube < LEN; i_cube++)
      for (var i_edge = 0; i_edge < arr_cubes[i_cube].arr_edges.length; i_edge++)
        f_test_i_cube_i_edge(i_cube, i_edge);
    return arr_pairs;
  },

  f_polycubes_to_graph_matrix: function (arr_cubes) {
    var LEN = arr_cubes.length;
    var m_graph = G.ARR.f_fill_matrix([LEN,LEN],0);

    for (var i_cube = 0; i_cube < LEN; i_cube++) {
      for (var i_edge = 0; i_edge < arr_cubes[i_cube].arr_edges.length; i_edge++) {
        m_graph[i_cube][arr_cubes[i_cube].arr_edges[i_edge].i_next_cube] = 1;
      }
    }
    return m_graph;
  },

  //m is square graph matrix
  f_graph_matrix_to_areas: function (m_graph) {
    var LEN = m_graph.length;

    function f_has_contact(m_graph, old_start, i_try_add) {
      for (var i = 0; i < old_start.length; i+=1) {
        if (m_graph[old_start[i]][i_try_add]) {
          return true;
        }
      }
      return false;
    }

    function f_area(m_graph, old_start) {
      var new_start = old_start.slice();
      for (var i_try_add = 0; i_try_add < m_graph.length; i_try_add += 1) {
        if (old_start.indexOf(i_try_add) !== (-1)) {continue; }
        if (f_has_contact(m_graph, old_start, i_try_add)) {
          new_start.push(i_try_add);
        }
      }

      if (new_start.length == old_start.length) {
        return old_start;
      }
      return f_area(m_graph, new_start);
    }

    function f_gen_two_areas(row, col) {
      if (m_graph[row][col] == 0) {return 0; }

      m_graph[row][col] = 0; m_graph[col][row] = 0;
      var area_from = f_area(m_graph, [row]);
      var area_to = f_area(m_graph, [col]);
      var is_zero_0_or_1_area = (area_from.indexOf(0) !== (-1)) ? 0 : 1;

      m_graph[row][col] = 1; m_graph[col][row] = 1;

      //current area, neigbour area, 0 or 1 (by zero cube's position)
      return [area_from, area_to, is_zero_0_or_1_area];
    }

    var m = G.ARR.f_gen_matrix([LEN,LEN], f_gen_two_areas);
    return m;
  },

  f_polycube_to_arr_of_edges_separation: function (arr_cubes) {
    var m_graph = G.AI.SEPARATE.f_polycubes_to_graph_matrix(arr_cubes);
    var m = G.AI.SEPARATE.f_graph_matrix_to_areas(m_graph);
    var arr_of_edges = G.AI.SEPARATE.f_polycubes_to_arr_of_edges(arr_cubes);
    var arr_result = [];

    function f_push(a) {
      arr_result.push({cube_min_cube_max: [a[3], a[4]], zero_0_or_1: a[2], area_min_area_max: [a[0].slice(), a[1].slice()]});
    }

    for (let i = 0; i < arr_of_edges.length; i+=1)
      f_push([...m[arr_of_edges[i][0]][arr_of_edges[i][1]], ...arr_of_edges[i]]);

    return arr_result;
  },

  f_polycube_to_edges_static_active: function(arr_cubes) {
    var sep = G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes);
    var f = i => [
      sep[i].cube_min_cube_max[sep[i].zero_0_or_1],
      sep[i].cube_min_cube_max[1 - sep[i].zero_0_or_1]
    ];
    return G.ARR.f_gen(sep.length, f);
  },

  f_polycube_to_areas_static_active: function(arr_cubes) {
    var sep = G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes);
    var f = i => [
      sep[i].area_min_area_max[sep[i].zero_0_or_1].slice(), 
      sep[i].area_min_area_max[1 - sep[i].zero_0_or_1].slice()
    ];
    return G.ARR.f_gen(sep.length, f);
  },

  f_text_to_table_data: function(arr_cubes) {
    var sep = G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes);
    //.log("sep", sep);
    var a8 = G.DRAW.SETTING.RGB.arr_8_cubes_names;

    var f = (row,col) =>  
      a8[sep[col].cube_min_cube_max[1 - sep[col].zero_0_or_1]] + 
      ((row == 0 ? "+ " : "- ") + 
      a8[sep[col].cube_min_cube_max[sep[col].zero_0_or_1]]);
    return G.MATRIX.f_gen_matrix([2, sep.length], f);
  },

  TWO_EDGES: {
    f_polycubes_to_pair_of_folds: function (arr_cubes) {
      var arr_separations = G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes);
      
      function f_row_col_to_triplet_and_index(row, col) {
        if (row==col) {return null;}
        var row_obj = arr_separations[row];
        var col_obj = arr_separations[col];

        function f_search_intersection() {
          function f(i,j) {
            var len = G.ARR.f_intersection(
              row_obj.area_min_area_max[i],
              col_obj.area_min_area_max[j],
              arr_cubes.length).length;
            //console.log("len", len);
            return len > 0;
          }
          for (let i01 = 0; i01 < 2; i01+=1)
            for (let j01 = 0; j01 < 2; j01+=1)
              if (f(i01, 0) && f(i01, 1) && f(0, j01) && f(1, j01)) return [i01, j01];
        }

        var ij = f_search_intersection();
        //console.log("ij", ij);

        var common = G.ARR.f_intersection(row_obj.area_min_area_max[ij[0]], col_obj.area_min_area_max[ij[1]], arr_cubes.length);
        var unique = [...row_obj.area_min_area_max[1-ij[0]], ...col_obj.area_min_area_max[1-ij[1]]];
        var zero = G.ARR.f_where_zero([common,unique]);
        return {common_unique: [common, unique], zero: zero};
      }

      return G.ARR.f_gen_matrix([arr_separations.length, arr_separations.length], f_row_col_to_triplet_and_index);
    }
  },

  f_gen_matrix_of_two_areas: function (arr_cubes, is_pairs = false) {
    //Adjacency matrix (matrix of zeros and ones)
    var m_graph = G.AI.SEPARATE.f_polycubes_to_graph_matrix(arr_cubes);
    var my_result_matrix_of_pairs_and_0_or_1 = G.AI.SEPARATE.f_graph_matrix_to_areas(m_graph);
  
    return G.AI.SEPARATE.TWO_EDGES.f_polycubes_to_pair_of_folds(arr_cubes);

    return G.AI.SEPARATE.f_polycube_to_arr_of_edges_separation(arr_cubes);

    //return G.AI.SEPARATE.f_polycubes_to_arr_of_edges(arr_cubes);
  }
};
