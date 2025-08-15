G.AI.ROTATIONS_24 = {
  C: {
    f_unit_3_3: function () {return [[1,0,0],[0,1,0],[0,0,1]]; },
    deg_90: {
      mx: [[1,0,0], [0,0,1], [0,-1,0]], //x  y-z
      my: [[0,0,-1], [0,1,0], [1,0,0]], //y  z-x
      mz: [[0,1,0], [-1,0,0], [0,0,1]] //z  x-y
    }
  },

  f_gen_cube_rotations: function () {
    var arr_6_dir = [[1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]];
    var f_m = (x6, y6, z6) => [arr_6_dir[x6].slice(), arr_6_dir[y6].slice(), arr_6_dir[z6].slice()];
    var arr_result = [];

    for (let ix = 0; ix < 6; ix+=1)
    for (let iy = 0; iy < 6; iy+=1)
    for (let iz = 0; iz < 6; iz+=1)
    if (G.MATRIX.f_determinant(f_m(ix, iy, iz)) == 1)
      arr_result.push(f_m(ix, iy, iz));

    return arr_result;
  },

  f_m_to_n24: function (m, arr_matrixes = G.AI.ROTATIONS_24.f_gen_cube_rotations()) {
    for (let i = 0; i < arr_matrixes.length; i+=1)
    if (G.MATRIX.f_are_eq(arr_matrixes[i], m))
      return i;
  },

  f_op_mult_a24_b24: function (a24, b24, arr_matrixes = G.AI.ROTATIONS_24.f_gen_cube_rotations()) {
    var ma = arr_matrixes[a24];
    var mb = arr_matrixes[b24];
    var mc = G.MATRIX.f_mult_matrix_left_right(ma, mb);
    return G.AI.ROTATIONS_24.f_m_to_n24(mc);
  },

  f_op_rev_a24: function (a24, arr_matrixes = G.AI.ROTATIONS_24.f_gen_cube_rotations()) {
    for (let i = 0; i < arr_matrixes.length; i+=1)
    if (G.MATRIX.f_are_eq(arr_matrixes[G.AI.ROTATIONS_24.f_op_mult_a24_b24(a24, i, arr_matrixes)], arr_matrixes[0]))
      return i;
  },

  f_op_div_a24_b24: function (a24, b24, arr_matrixes = G.AI.ROTATIONS_24.f_gen_cube_rotations()) {
    var ma = arr_matrixes[a24];
    var mb = arr_matrixes[G.AI.ROTATIONS_24.f_op_rev_a24(b24)];
    var mc = G.MATRIX.f_mult_matrix_left_right(ma, mb);
    return G.AI.ROTATIONS_24.f_m_to_n24(mc);
  },

  f_gen_x_y_z_0_90_180_clock90_matrixes: function (obj = G.AI.ROTATIONS_24.C.deg_90) {
    var f = (ma, mb) => G.MATRIX.f_mult_matrix_left_right(ma, mb);
    var fu = () => G.AI.ROTATIONS_24.C.f_unit_3_3();
    var F = (m) => [fu(), f(fu(),m), f(m,m), f(m,(f(m,m)))];
    return [F(obj.mx), F(obj.my), F(obj.mz)]; 
  },

  f_gen_x_y_z_0_90_180_clock90_numbers: function () {
    var a3_a4 = G.AI.ROTATIONS_24.f_gen_x_y_z_0_90_180_clock90_matrixes();
    var f = (row, col) => a3_a4[row][col];
    return G.MATRIX.f_gen_matrix([3,4], f);
  }
};

G.AI.ROTATIONS_24.C.arr_triplets = G.AI.ROTATIONS_24.f_gen_cube_rotations();
G.AI.ROTATIONS_24.C.arr_inverse = G.ARR.f_gen(24, (a24) => G.AI.ROTATIONS_24.f_op_rev_a24(a24, G.AI.ROTATIONS_24.arr_axis_24));
G.AI.ROTATIONS_24.C.table_mult = G.MATRIX.f_gen_matrix([24,24], (row, col) => G.AI.ROTATIONS_24.f_op_mult_a24_b24(row, col, G.AI.ROTATIONS_24.arr_axis_24));
G.AI.ROTATIONS_24.C.table_div = G.MATRIX.f_gen_matrix([24,24], (row, col) => G.AI.ROTATIONS_24.f_op_div_a24_b24(row, col, G.AI.ROTATIONS_24.arr_axis_24));

G.AI.ROTATIONS_24.C.arr_3_arr_4_matrixes = G.AI.ROTATIONS_24.f_gen_x_y_z_0_90_180_clock90_matrixes();
G.AI.ROTATIONS_24.C.arr_3_arr_4 = G.AI.ROTATIONS_24.f_gen_x_y_z_0_90_180_clock90_numbers();
