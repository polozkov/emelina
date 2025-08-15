//generate matrix by function-generator
G.MATRIX = {
  f_gen_matrix: function (len_row_columns, f) {
    var my_arr = [];

    for (var i = 0; i < len_row_columns[0]; i++) {
      my_arr.push([]);
      for (var j = 0; j < len_row_columns[1]; j++) {
        my_arr[i].push(f(i, j));
      }
    }

    return my_arr;
  },

  f_determinant: function (m) {
    var pos = (m[0][0] * m[1][1] * m[2][2]) + (m[0][1] * m[1][2] * m[2][0]) + (m[0][2] * m[1][0] * m[2][1]);
    var neg = (m[0][2] * m[1][1] * m[2][0]) + (m[0][0] * m[1][2] * m[2][1]) + (m[0][1] * m[1][0] * m[2][2]);
    return pos - neg;
  },

  f_mult_matrix_left_right: function (L, R) {
    function f(row, col) {
      return (
        L[row][0] * R[0][col] + L[row][1] * R[1][col] + L[row][2] * R[2][col]
      );
    }
    return [
      [f(0, 0), f(0, 1), f(0, 2)],
      [f(1, 0), f(1, 1), f(1, 2)],
      [f(2, 0), f(2, 1), f(2, 2)],
    ];
  },

  //multiply left matrix to right matrix
  f_mult_matrix_to_point: function (M, P3) {
    function f(row) {
      return M[row][0] * P3[0] + M[row][1] * P3[1] + M[row][2] * P3[2];
    }
    return [f(0), f(1), f(2)];
  },

  //multiply left matrix to right matrix
  f_are_eq: function (ma, mb) {
    for (var i_row = 0; i_row < 3; i_row += 1) {
      for (var i_col = 0; i_col < 3; i_col += 1) {
        if (ma[i_row][i_col] != mb[i_row][i_col]) {
          return false;
        }
      }
    }
    return true;
  },

  //copy matrix
  f_op_copy: function (m) {
    var m_result = [];

    for (var i = 0; i < m.length; i++) {
      m_result.push(m[i].slice());
    }

    return m_result;
  },
};