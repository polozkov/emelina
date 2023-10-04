//rotation on axis x,y,z; rotation of triplet; triplet to matrix converting
G.AI.ROTATIONS = {
  ARR_COS: [1, 0, -1, 0],
  ARR_SIN: [0, 1, 0, -1],

  f_rot_z_cos_sin: function (p, cos, sin) {
    var new_x = p[0] * cos - p[1] * sin;
    var new_y = p[0] * sin + p[1] * cos;
    return [new_x, new_y, p[2]];
  },

  f_rot_y_cos_sin: function (p, cos, sin) {
    var new_x = p[0] * cos + p[2] * sin;
    var new_z = -p[0] * sin + p[2] * cos;
    return [new_x, p[1], new_z];
  },

  f_rot_x_cos_sin: function (p, cos, sin) {
    var new_y = p[1] * cos - p[2] * sin;
    var new_z = p[1] * sin + p[2] * cos;
    return [p[0], new_y, new_z];
  },

  f_axe_name: function (n012) {
    var arr_012_names = [
      "f_rot_x_cos_sin",
      "f_rot_y_cos_sin",
      "f_rot_z_cos_sin"
    ];
    return arr_012_names[n012];
  },

  //n_axis_012 for define ox,oy,oz; deg_03 = 1 -> +90, -1 -> -90, 2 -> 180
  f_rot_any_axe: function (p, n_axis_012, deg_03) {
    //deg_03 is in set {0,1,2,3}
    var cos = G.AI.ROTATIONS.ARR_COS[deg_03];
    var sin = G.AI.ROTATIONS.ARR_SIN[deg_03];

    //my name is name of function ("f_rot_x_cos_sin", _y_ or _z_)
    return G.AI.ROTATIONS[G.AI.ROTATIONS.f_axe_name(n_axis_012)](p, cos, sin);
  },

  f_rot_any_axe_and_degree: function (p, n_axis_012, deg) {
    var cos = Math.cos(deg * Math.PI / 180.0);
    var sin = Math.sin(deg * Math.PI / 180.0);
    return G.AI.ROTATIONS[G.AI.ROTATIONS.f_axe_name(n_axis_012)](p, cos, sin);
  },

  f_rot_3_times: function (p0, deg_xyz) {
    var px = G.AI.ROTATIONS.f_rot_any_axe_and_degree(p0, 0, deg_xyz[0]);
    var py = G.AI.ROTATIONS.f_rot_any_axe_and_degree(px, 1, deg_xyz[1]);
    var pz = G.AI.ROTATIONS.f_rot_any_axe_and_degree(py, 2, deg_xyz[2]);
    return pz;
  },

  //rotate (whole matrix m)
  f_rot_matrix: function (m, n_axis_012, deg_03) {
    var new_0 = G.AI.ROTATIONS.f_rot_any_axe(m[0], n_axis_012, deg_03);
    var new_1 = G.AI.ROTATIONS.f_rot_any_axe(m[1], n_axis_012, deg_03);
    var new_2 = G.AI.ROTATIONS.f_rot_any_axe(m[2], n_axis_012, deg_03);
    return [new_0, new_1, new_2];
  },

  //rotate three points (in matrix m)
  f_rot_matrix_3_times: function (m0, deg_xyz) {
    var row0 = G.AI.ROTATIONS.f_rot_3_times(m0[0], deg_xyz);
    var row1 = G.AI.ROTATIONS.f_rot_3_times(m0[1], deg_xyz);
    var row2 = G.AI.ROTATIONS.f_rot_3_times(m0[2], deg_xyz);
    return [row0, row1, row2];
  }
};