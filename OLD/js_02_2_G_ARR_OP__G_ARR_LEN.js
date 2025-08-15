G.ARR.OP = {
  f_rot_90: function (xy) {
    return [-xy[1], xy[0]];
  },

  f_rot_90_plus_minus: function (xy, sign = 1) {
    if (sign == 1) return G.ARR.OP.f_rot_90(xy);
    return G.ARR.OP.f_rot_90([-xy[0], -xy[1]]);
  },

  f_is_in_area: function (xy, xy_min, xy_max) {
    return (xy_min[0] <= xy[0]) && (xy[0] <= xy_max[0]) && (xy_min[1] <= xy[1]) && (xy[1] <= xy_max[1]);
  },

  //operation "+"
  f_add: function (a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  },

  //operation "-"
  f_sub: function (a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },

  //operation "*"
  f_mult: function (a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
  },

  //operation "*number"
  f_scale: function (a, n) {
    return [a[0] * n, a[1] * n, a[2] * n];
  },

  //center of two points
  f_center: function (a, b) {
    return [(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5];
  },

  //interpolate: 0 -> this, 0.5 -> middle (this,p); 1 -> p;
  f_interpolate: function (a, b, n01) {
    return [a[0] + (b[0] - a[0]) * n01, a[1] + (b[1] - a[1]) * n01, a[2] + (b[2] - a[2]) * n01];
  },

  //if two points are equal, return true
  f_are_eq: function (a, b) {
    return ((a[0] == b[0]) && (a[1] == b[1]) && (a[2] == b[2]));
  },

  f_sign_order: function (a, b) {
    if (a[0] < b[0]) return 1; if (a[0] > b[0]) return -1;
    if (a[1] < b[1]) return 1; if (a[1] > b[1]) return -1;
    if (a[2] < b[2]) return 1; if (a[2] > b[2]) return -1;
    return 0;
  },

  f_axis_with_zero: function (xyz) {
    if (xyz[0] == 0) return 0;
    if (xyz[1] == 0) return 1;
    if (xyz[2] == 0) return 2;
    return -1;
  },

  f_axis_even: function (xyz) {
    if ((xyz[0] % 2) == 0) return 0;
    if ((xyz[1] % 2) == 0) return 1;
    if ((xyz[2] % 2) == 0) return 2;
    return -1;
  }, 
};

G.ARR.LEN = {
  f2_a: function (a) {
    return (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  },

  f2_ab: function (a, b) {
    var c = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    return (c[0] * c[0] + c[1] * c[1] + c[2] * c[2]);
  },

  f_a: function (a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  },
  
  f_ab: function (a, b, value_z = 1) {
    var c = [a[0] - b[0], a[1] - b[1], (a[2] - b[2]) * value_z];
    return Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]);
  }
}