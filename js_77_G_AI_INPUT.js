G.AI.INPUT = {
  //only cube's centers (cubes in rectangle xy)
  f_arr_rectangle_block: function (xy = [4,2]) {
    var arr_result = [], n_index = 0;
    for (var iy = 0; iy < xy[1]; iy++) {
      for (var ix = 0; ix < xy[0]; ix++) { 
        arr_result.push(new G.F_CUBE([ix * 2, iy * 2, 0], n_index));
        n_index += 1;
      }
    }
    return arr_result;
  },

  //pair of edges for current and neighbour cube by delta and direction (v6 is unit ort, 6 directions)
  f_delta_to_edges: function (delta, v6) {
    //cubes are connected by diagonal
    function f_delta_diagonal_to_edges(delta) {
      var a = [delta[0] / 2, delta[1] / 2, delta[2] / 2];
      var b = [-a[0], -a[1], -a[2]]
      return [a, b];
    }
  
    function f_delta_contact_to_edges(delta, v6) {
      var a = [delta[0] / 2, delta[1] / 2, delta[2] / 2];
      var b = [-a[0], -a[1], -a[2]]
      //v6 define final position of edge connector
      var a_v6 = [a[0] + v6[0], a[1] + v6[1], a[2] + v6[2]];
      var b_v6 = [b[0] + v6[0], b[1] + v6[1], b[2] + v6[2]];
      return [a_v6, b_v6];
    }
    
    if (G.ARR.LEN.f2_a(delta) == 8) {
      return f_delta_diagonal_to_edges(delta);
    }
    if (G.ARR.LEN.f2_a(delta) == 4) {
      return f_delta_contact_to_edges(delta, v6);
    }
    //console.log("ERROR: no diagonal and no contact", delta, v6);
  },

  //define ort direction by char (Russian or English letter)
  f_to_v6: function (c) {
    var X = [1,0,0]; var x = [-1,0,0];
    var Y = [0,1,0]; var y = [0,-1,0];
    var Z = [0,0,1]; var z = [0,0,-1];
    if ((c == "R") || (c == "r") || (c == "П") || (c == "п")) {return X};
    if ((c == "L") || (c == "l") || (c == "Л") || (c == "л")) {return x};

    if ((c == "D") || (c == "d") || (c == "Н") || (c == "н")) {return Y};
    if ((c == "U") || (c == "u") || (c == "В") || (c == "в")) {return y};

    if ((c == "F") || (c == "f") || (c == "Ф") || (c == "ф")) {return Z};
    if ((c == "B") || (c == "b") || (c == "Т") || (c == "т")) {return z};
    return null;
  },

  f_edge_face_center: function (ca, cb) {
    var d = [cb[0] - ca[0], cb[1] - ca[1], cb[2] - ca[2]];
    var f = (test_first_axis, test_second_axis) => (d[test_first_axis] == 0) && (d[test_second_axis] == 0);
    if (f(0,1) || f(0,2) || f(1,2)) {
      return [Math.sign(d[0]), Math.sign(d[1]), Math.sign(d[2])];
    }
    
    var f_order_from_zero_axis = (D) => (D[0]==0) ? [0,1,2] : ((D[1]==0) ? [1,2,0] : ((D[2]==0) ? [2,0,1] : null));
    var f_swap_order = (i3, sign) => (sign == (-1)) ? [i3[0], i3[2], i3[1]] : i3.slice();
    var order = f_swap_order(f_order_from_zero_axis(d), G.ARR.OP.f_sign_order(ca, cb));
    var arr_result = [0,0,0];
    arr_result[order[1]] = Math.sign(d[order[1]]);
    return arr_result;
  },

  //4*2 block, (or 8*1 block) 
  f_generate_cube_array: function(arr_connections = [], arr_cubes = G.AI.INPUT.f_arr_rectangle_block()) {
    var arr = G.ARR.f_op_copy(arr_cubes);
    //ca and cb - cube's centers
    function f_add_connector(n_ca, v6_char, n_cb) {
      var ca = arr_cubes[n_ca].center;
      var cb = arr_cubes[n_cb].center;
      var d = [cb[0] - ca[0], cb[1] - ca[1], cb[2] - ca[2]];
      //pair of edges
      var ea_eb = G.AI.INPUT.f_delta_to_edges(d, G.AI.INPUT.f_to_v6(v6_char));

      var edge_face_center_a = G.AI.INPUT.f_edge_face_center(ca, cb);
      var edge_face_center_b = G.AI.INPUT.f_edge_face_center(cb, ca);
      arr[n_ca].arr_edges.push(new G.F_EDGE(ea_eb[0].slice(), n_cb, edge_face_center_a));
      arr[n_cb].arr_edges.push(new G.F_EDGE(ea_eb[1].slice(), n_ca, edge_face_center_b));
    }
    for (var i = 0; i < arr_connections.length; i++) {
      f_add_connector(arr_connections[i][0], arr_connections[i][1], arr_connections[i][2]);
    }
    return arr;
  },

  f_string_to_edge_array_of_triplets: function(s) {
    var a = s.split(" ");
    var arr_result = [];
    for (var i = 0; i < a.length; i++) {
      arr_result.push([(+(a[i][0])-1), a[i][1], + ((a[i][2])-1)]);
    }
    return arr_result;
  },
  
  //default - block 4 by 2 by 1 cubes
  f_generate_start_rectangle_task: function(s, sizes_xy = [4,2]) {
    var arr_cubes = G.AI.INPUT.f_arr_rectangle_block(sizes_xy);
    var arr_edges = G.AI.INPUT.f_string_to_edge_array_of_triplets(s);
    var arr_result = G.AI.INPUT.f_generate_cube_array(arr_edges, arr_cubes);

    //console.log(G.ARR.f_op_copy(arr_result)); //test f_op_copy foreach cube
    return arr_result;
  }
};
