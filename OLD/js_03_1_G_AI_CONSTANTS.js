G.AI.CONSTANTS.ARR_6_ORTS = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],

  [0, 0, -1],
  [0, -1, 0],
  [-1, 0, 0],
];

G.AI.CONSTANTS.ARR_8_VERTICES = [
  [-1, -1, -1], [-1, -1, +1],
  [-1, +1, -1], [-1, +1, +1],
  [+1, -1, -1], [+1, -1, +1],
  [+1, +1, -1], [+1, +1, +1]
];

G.AI.CONSTANTS.ARR_12_EDGES = [
  [-1, -1, 0], [-1, +1, 0], [+1, -1, 0], [+1, +1, 0],
  [-1, 0, -1], [-1, 0, +1], [+1, 0, -1], [+1, 0, +1],
  [0, -1, -1], [0, -1, +1], [0, +1, -1], [0, +1, +1]
];

G.AI.CONSTANTS.ARR_12_EDGES_PAIRS = G.ARR.f_gen(12, function f(i12) {
  var e12 = G.AI.CONSTANTS.ARR_12_EDGES[i12].slice();
  var d = (e12[0] == 0) ? [1, 0, 0] : (e12[1] == 0) ? [0, 1, 0] : [0, 0, 1];
  return [G.ARR.OP.f_sub(e12, d), G.ARR.OP.f_add(e12, d)];
});

G.AI.CONSTANTS.ARR_8_EDGES_TRIPLETS_indexes = G.ARR.f_gen(8, function f(i8) {
  var v = G.AI.CONSTANTS.ARR_8_VERTICES[i8].slice();
  var triplet = [];
  function f_check_edge_for_putting_in_triplet(i12) {
    var pair = G.AI.CONSTANTS.ARR_12_EDGES_PAIRS[i12];
    if (G.ARR.OP.f_are_eq(pair[0], v) || G.ARR.OP.f_are_eq(pair[1], v)) {
      triplet.push(i12);
    }
  }
  for (var i12 = 0; i12 < 12; i12 += 1) {
    f_check_edge_for_putting_in_triplet(i12);
  }
  return triplet;
});

function f_generate_all_24_matrix_of_rotation_by_checking_6_by_6_by_6_ort_combinations() {
  var arr_result = [];
  function f_check(vx, vy, vz) {
    if (G.MATRIX.f_determinant([vx, vy, vz]) == 1) {
      arr_result.push([vx.slice(), vy.slice(), vz.slice()]);
    };
  }
  for (var ix = 0; ix <= 5; ix++) {
    for (var iy = 0; iy <= 5; iy++) {
      for (var iz = 0; iz <= 5; iz++) {
        f_check(G.AI.CONSTANTS.ARR_6_ORTS[ix], G.AI.CONSTANTS.ARR_6_ORTS[iy], G.AI.CONSTANTS.ARR_6_ORTS[iz]);
      }
    }
  }
  return arr_result;
};

G.AI.CONSTANTS.ARR_24_M = f_generate_all_24_matrix_of_rotation_by_checking_6_by_6_by_6_ort_combinations();

//4 rotations for each axis
G.AI.CONSTANTS.ARR_ARR_3_4_AXIS_ROTATIONS = G.MATRIX.f_gen_matrix([3, 4], //rotation is defined by triplet's index
  function f_gen_axis_deg(axis_02, deg_03) {
    var t0 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var t_new = G.AI.ROTATIONS.f_rot_matrix(t0, axis_02, deg_03);
    return t_new;
  });

//inverse rotation (that return rotation back)
G.AI.CONSTANTS.ARR_24_inverse = G.ARR.f_gen(24, function f_gen_inverse(i24) {
  var m = G.AI.CONSTANTS.ARR_24_M[i24];
  for (var i = 0; i < 24; i++) {
    if (G.MATRIX.f_are_eq(G.MATRIX.f_mult_matrix_left_right(G.AI.CONSTANTS.ARR_24_M[i], m), [[1, 0, 0], [0, 1, 0], [0, 0, 1]])) {
      return G.MATRIX.f_op_copy(G.AI.CONSTANTS.ARR_24_M[i]);
    }
  }
});

//eath edge has 24 rotations
G.AI.CONSTANTS.ARR_ARR_12_24_ROTATED_EDGES = G.MATRIX.f_gen_matrix([12, 24], function f_12_24(i12, i24) {
  var e12 = G.AI.CONSTANTS.ARR_12_EDGES[i12];
  var m24 = G.AI.CONSTANTS.ARR_24_M[i24];
  return G.MATRIX.f_mult_matrix_to_point(m24, e12);
});
