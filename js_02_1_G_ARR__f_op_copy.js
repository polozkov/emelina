G.ARR = {
  //generate array by function-generator
  f_gen: function (len, f) {
    var my_arr = [];

    for (var i = 0; i < len; i++) {
      my_arr.push(f(i));
    }

    return my_arr;
  },

  //search zero
  f_where_zero: function (arr_of_arr) {
    for (var i = 0; i < arr_of_arr.length; i+=1)
      if (arr_of_arr[i].indexOf(0) !== (-1))
        return i;
  },
  
  f_get_area_quarter: function (min_max, x_01_y_01 = [0,0]) {
    var w = min_max[1][0] - min_max[0][0];
    var h = min_max[1][1] - min_max[0][1];
    var p0 = [min_max[0][0], min_max[0][1]];
    var new_min = [p0[0] + w * 0.5 * x_01_y_01[0], p0[1] + h * 0.5 * x_01_y_01[1]];
    var new_max = [new_min[0] + w * 0.5, new_min[1] + h * 0.5];
    return [new_min, new_max];
  },

  f_swap_xy: function (xy) {
    return [xy[1], xy[0]];
  },

  f_rev_x: function (xy) {
    return [-xy[0], xy[1]];
  },

  f_rev_y: function (xy) {
    return [xy[0], -xy[1]];
  },

  f_intersection: function (indexes_a, indexes_b, max_n, union_1_intersection_2 = 2) {
    var arr_owner = G.ARR.f_fill(max_n, 0);
    for (var ia = 0; ia < indexes_a.length; ia+=1)
      arr_owner[indexes_a[ia]] += 1;

    for (var ib = 0; ib < indexes_b.length; ib+=1)
      arr_owner[indexes_b[ib]] += 1;
    
    var arr_result = [];
    for (var i = 0; i < max_n; i+=1)
    if (arr_owner[i] >= union_1_intersection_2)
      arr_result.push(i);
    return arr_result;
  },


  f_gen_matrix: function (len_rows_columns, f_row_col) {
    var m = [];
    for (var i_rows = 0; i_rows < len_rows_columns[0]; i_rows++) {
      m.push([]);
      for (var i_columns = 0; i_columns < len_rows_columns[1]; i_columns++) {
        m[i_rows].push(f_row_col(i_rows, i_columns));
      }
    }
    return m;
  },
  
  //generate array by function-generator
  f_fill: function (len, value) {
    var my_arr = [];

    for (var i = 0; i < len; i++) {
      my_arr.push(value);
    }

    return my_arr;
  },
  
  f_fill_matrix: function (len_rows_columns, value) {
    var m = [];
    for (var i_rows = 0; i_rows < len_rows_columns[0]; i_rows++) {
      m.push([]);
      for (var i_columns = 0; i_columns < len_rows_columns[1]; i_columns++) {
        m[i_rows].push(value);
      }
    }
    return m;
  },

  //copy array (elements have operation f_op_copy)
  f_op_copy: function (arr) {
    var arr_result = [];

    for (var i = 0; i < arr.length; i++) {
      arr_result.push(arr[i].f_op_copy());
    }

    return arr_result;
  },

  OP: {},
  LEN: {}
};

G.F_EDGE.prototype.f_op_copy = function() {
  return new G.F_EDGE(this.edge_point, this.i_next_cube);
};

G.F_CUBE.prototype.f_op_copy = function() {
  return new G.F_CUBE(this.center, this.n_index, G.ARR.f_op_copy(this.arr_edges));
};