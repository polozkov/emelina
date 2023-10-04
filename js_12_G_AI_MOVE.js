G.AI.MOVE = {
  f_rotate_point_on_axis: function(p, axis, deg_03, n_axis_012 = undefined) {
    if (n_axis_012 === undefined) {n_axis_012 = G.ARR.OP.f_axis_even(axis)};

    //relatively (when axis is center)
    var p_rel = G.ARR.OP.f_sub(p, axis);
    var p_rel_rot = G.AI.ROTATIONS.f_rot_any_axe(p_rel, n_axis_012, deg_03);
    var p_rel_rot_restore = G.ARR.OP.f_add(p_rel_rot, axis);
    return p_rel_rot_restore;
  },

  f_rotate_point_on_axis_from_origin: function(p, axis, deg_03, n_axis_012 = undefined) {
    if (n_axis_012 === undefined) {n_axis_012 = G.ARR.OP.f_axis_even(axis)};
    var p_result = G.AI.ROTATIONS.f_rot_any_axe(p, n_axis_012, deg_03);
    return p_result;
  }
};

G.F_EDGE.prototype.f_self_rotate_point_on_axis = function (axis, deg_03, n_axis_012 = undefined) {
  if (n_axis_012 === undefined) {n_axis_012 = G.ARR.OP.f_axis_even(axis)};
  var new_edge_point = G.AI.MOVE.f_rotate_point_on_axis_from_origin(this.edge_point, axis, deg_03, n_axis_012);
  var new_edge_face_point = G.AI.MOVE.f_rotate_point_on_axis_from_origin(this.edge_face_point, axis, deg_03, n_axis_012);
  
  return new G.F_EDGE(new_edge_point, this.i_next_cube, new_edge_face_point);
};

G.F_CUBE.prototype.f_self_rotate_point_on_axis = function (axis, deg_03, n_axis_012 = undefined) {
  if (n_axis_012 === undefined) {n_axis_012 = G.ARR.OP.f_axis_even(axis)};
  var new_arr_edges = [];

  for (var i = 0; i < this.arr_edges.length; i+=1) {
    new_arr_edges.push(this.arr_edges[i].f_self_rotate_point_on_axis(axis, deg_03, n_axis_012));
  }
  var new_center = G.AI.MOVE.f_rotate_point_on_axis(this.center, axis, deg_03, n_axis_012);
  return new G.F_CUBE(new_center, this.n_index, new_arr_edges);
};

//absolute edge
G.AI.MOVE.f_edge_edge = function(arr_cubes, cube_i, cube_j) {
  var obj_cube_i = arr_cubes[cube_i];
  for (let i = 0; i < obj_cube_i.arr_edges.length; i+=1)
    if (obj_cube_i.arr_edges[i].i_next_cube == cube_j)
      return G.ARR.OP.f_add(obj_cube_i.arr_edges[i].edge_point.slice(), obj_cube_i.center);
};

G.AI.MOVE.f_copy_arr_cubes = function(arr_cubes) {
  var arr_result = G.ARR.f_fill(arr_cubes.length, {});
  for (let t_copy = 0; t_copy < arr_static_cubes.length; t_copy+=1) {
    let n = arr_static_cubes[t_copy];
    arr_result[n] = arr_cubes[n].f_op_copy();
  }
  return arr_result;
};

//rotate all toy (without solving puzzle, just change orientation)
G.AI.MOVE.f_edge_work_all_cubes = function (arr_cubes, axis, deg_03) {
  var arr_result = G.ARR.f_fill(arr_cubes.length, {});

  for (let t_rot = 0; t_rot < arr_cubes.length; t_rot+=1) {
    arr_result[t_rot] = arr_cubes[t_rot].f_self_rotate_point_on_axis(axis, deg_03);
  }
  return arr_result;
};

//do move with puzzle (by folding)
G.AI.MOVE.f_edge_work = function(arr_cubes, i_edge_06, deg_03) {
  //return;
  var arr_areas = G.AI.SEPARATE.f_polycube_to_areas_static_active(arr_cubes);
  var i_static_cube = arr_areas[i_edge_06][0][0];
  var i_active_cube = arr_areas[i_edge_06][1][0];
  var arr_static_cubes = arr_areas[i_edge_06][0];
  var arr_active_cubes = arr_areas[i_edge_06][1];
  var arr_result = G.ARR.f_fill(arr_cubes.length, {});

  var edge_edge = G.AI.MOVE.f_edge_edge(arr_cubes, i_static_cube, i_active_cube);

  for (let t_copy = 0; t_copy < arr_static_cubes.length; t_copy+=1) {
    let n = arr_static_cubes[t_copy];
    arr_result[n] = arr_cubes[n].f_op_copy();
  } 

  for (let t_rot = 0; t_rot < arr_active_cubes.length; t_rot+=1) {
    let n = arr_active_cubes[t_rot];

    arr_result[n] = arr_cubes[n].f_self_rotate_point_on_axis(edge_edge, deg_03);
  } 
;

  //console.log("i_static_cube i_active_cube", i_static_cube, i_active_cube);
  //console.log("edge_edge ", G.AI.MOVE.f_edge_edge(arr_cubes, i_static_cube, i_active_cube));;


  return arr_result;
};
