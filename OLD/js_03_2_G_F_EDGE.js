G.F_EDGE.prototype.f_get_pair_vertices = function(cube_center, deg_xyz, ratio_scale, c_xy_final, half_of_side) {
  var d = (this.edge_point[0] == 0) ? [1, 0, 0] : (this.edge_point[1] == 0) ? [0, 1, 0] : [0, 0, 1];
  var e_scale = G.ARR.OP.f_scale(this.edge_point, ratio_scale);
  var d_scale = G.ARR.OP.f_scale(d, ratio_scale);

  var ab = [G.ARR.OP.f_sub(e_scale, d_scale), G.ARR.OP.f_add(e_scale, d_scale)];
  var ab_center = [G.ARR.OP.f_add(ab[0], cube_center), G.ARR.OP.f_add(ab[1], cube_center)];
  var ab_rot = [G.AI.ROTATIONS.f_rot_3_times(ab_center[0], deg_xyz), G.AI.ROTATIONS.f_rot_3_times(ab_center[1], deg_xyz)];

  var a_scaled_and_shifted = G.ARR.OP.f_add(G.ARR.OP.f_scale(ab_rot[0], half_of_side * 2), c_xy_final);
  var b_scaled_and_shifted = G.ARR.OP.f_add(G.ARR.OP.f_scale(ab_rot[1], half_of_side * 2), c_xy_final);
  return [a_scaled_and_shifted, b_scaled_and_shifted];
};