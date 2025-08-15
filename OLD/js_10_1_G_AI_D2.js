G.AI.D2 = {
  //point is exactly in sector between two lines t3[0]-t3[1]; t3[0]-t3[2]
  f_is_test_point_in_sector: function (t3, x, y) {
    var f_det = (x0, y0, x1, y1) => x0*y1 - y0*x1;
    var f_sign = (a, b, x, y) => Math.sign(f_det(a[0]-x,a[1]-y, b[0]-x,b[1]-y));
    var s0 = f_sign(t3[0], t3[1], x, y);
    var s1 = f_sign(t3[2], t3[0], x, y);

    return (s0 == 1) && (s1 == 1);
  },

  //arc_x and arc_y can not be negative
  f_is_line_intersect_arc: function (x0, y0, x1, y1, arc_x, arc_y) {
    var f_is_b_outside = (a,b,c) => ((b > a) && (b > c)) || ((b < a) && (b < c));
    var f_is_b_outside_or_eq = (a,b,c) => ((b >= a) && (b >= c)) || ((b <= a) && (b <= c));

    var len_2 = arc_x * arc_x + arc_y * arc_y;
    var len = Math.sqrt(len_2);
    //intersection has 2 points with opposite signs on one coordinate
    var intersect_xx_yy = [[x0, x0], [y0, y0]];

    //vert line; set Y - coordinate (always positive)
    if (x0 == x1) {
      if (len <= x0) {return false; }
      intersect_xx_yy[1] = [-Math.sqrt(len_2 - x0 * x0), Math.sqrt(len_2 - x0 * x0)];
    }

    //hori line; set X - coordinate (X - can be nagative)
    if (y0 == y1) {
      if (len <= y0) {return false; }
      intersect_xx_yy[0] = [-Math.sqrt(len_2 - y0 * y0), Math.sqrt(len_2 - y0 * y0)];
    }

    function f_test_point(x, y) {
      var trio = [[0,0], [arc_x,arc_y], G.ARR.OP.f_rot_90([arc_x,arc_y])];
      if (!G.AI.D2.f_is_test_point_in_sector(trio, x, y)) return false;

      if (f_is_b_outside(x0, x, x1) || f_is_b_outside(y0, y, y1)) return false;
      if (
        ((x0 == x1) && f_is_b_outside_or_eq(y0, y, y1)) || 
        ((y0 == y1) && f_is_b_outside_or_eq(x0, x, x1))
      ) return false;
      return true;
    }

    return f_test_point(intersect_xx_yy[0][0], intersect_xx_yy[1][0]) || f_test_point(intersect_xx_yy[0][1], intersect_xx_yy[1][1]);
  },

  f_is_square_intersect_arc: function (x, y, X, Y, arc_x, arc_y) {
    //var f = (x0, y0, x1, y1) => G.AI.D2.f_is_line_intersect_arc(x0, y0, x1, y1, arc_x, arc_y);
    function f(x0, y0, x1, y1) {
      var bool = G.AI.D2.f_is_line_intersect_arc(x0, y0, x1, y1, arc_x, arc_y);
      //if (bool) {console.log("f", x0, y0, x1, y1, arc_x, arc_y);}
      return bool;
    }

    //midsegment also use for intercest itself and neigbours on 90 degrees
    return (
      f(x, y, X, y) || f(x, Y, X, Y) || f(x, (y+Y)*0.5, X, (y+Y)*0.5) || 
      f(x, y, x, Y) || f(X, y, X, Y) || f((x+X)*0.5, y, (x+X)*0.5, Y));
  },

  f_is_square_intersect_square: function (static_x, static_y, static_X, static_Y, ax, ay, AX, AY) {
    //var f = (arc_x, arc_y) => G.AI.D2.f_is_square_intersect_arc(static_x, static_y, static_X, static_Y, arc_x, arc_y);
    function f(arc_x, arc_y) {
      var bool = G.AI.D2.f_is_square_intersect_arc(static_x, static_y, static_X, static_Y, arc_x, arc_y);
      //if (bool) {console.log("f", arc_x, arc_y);}
      return bool;
    }
    return f(ax,ay) || f(ax,AY) || f(AX,ay) || f(AX,AY);
  },

  f_is_square_intersect_square_get_centers: function (static_x, static_y, active_x, active_y) {
    var s_4 = [static_x - 1, static_y - 1, static_x + 1, static_y + 1];
    var a_4 = [active_x - 1, active_y - 1, active_x + 1, active_y + 1];

    return G.AI.D2.f_is_square_intersect_square(...s_4, ...a_4);
  },

  //sign = +=1 (+: counter clock wise), n_1_2 = 1,2 (90 or 180 degree rotation)
  f_is_square_intersect_square_any: function (static_xy, active_xy, sign = 1, n_1_2 = 1) {
    if (active_xy[0] < 0)
      return G.AI.D2.f_is_square_intersect_square_any(G.ARR.f_rev_x(static_xy), G.ARR.f_rev_x(active_xy), -sign, n_1_2);
    
    if (active_xy[1] < 0)
      return G.AI.D2.f_is_square_intersect_square_any(G.ARR.f_rev_y(static_xy), G.ARR.f_rev_y(active_xy), -sign, n_1_2);

    //so, active_xy is in first quarter (x>0 and y>0)

    //_xy are odd numbers
    var rot_xy = G.ARR.OP.f_rot_90_plus_minus(active_xy);
    if (n_1_2 == 2) return (
      G.AI.D2.f_is_square_intersect_square_any(static_xy, active_xy, sign, 1) ||
      G.AI.D2.f_is_square_intersect_square_any(static_xy, rot_xy, sign, 1)
    );

    //so, Math.abs(deg_sign_1_or_2) equal 1
    if (sign == -1) {
      return G.AI.D2.f_is_square_intersect_square_any(G.ARR.f_swap_xy(static_xy), G.ARR.f_swap_xy(active_xy), 1, n_1_2);
    };

    return G.AI.D2.f_is_square_intersect_square_get_centers(...static_xy, ...active_xy);
  },

  //sign_and_n12 = 1 (default 90 degrees)
  f_is_final_intersect: function (static_xy, active_xy, sign_and_n12 = 1, origin_xy = [0,0]) {
    var new_static_xy = G.ARR.OP.f_sub(static_xy, origin_xy);
    var new_active_xy = G.ARR.OP.f_sub(active_xy, origin_xy);
    var sign = Math.sign(sign_and_n12);
    var n_1_2 = Math.abs(sign_and_n12);
    return G.AI.D2.f_is_square_intersect_square_any(new_static_xy, new_active_xy, sign, n_1_2);
  },

  //block of square interssect block of square
  f_is_block_intersect_block: function (arr_static_xy, arr_active_xy, sign_and_n12 = 1, origin_xy = [0,0]) {
    for (let i_static = 0; i_static < arr_static_xy.length; i_static+=1)
    for (let i_active = 0; i_active < arr_active_xy.length; i_active+=1)
      if (G.AI.D2.f_is_final_intersect(arr_static_xy[i_static], arr_active_xy[i_active], sign_and_n12, origin_xy)) {
        return true;
      }
    return false;
  },

  //return array (static squares, than will be interect by active xy)
  f_generate_blocks: function (x_active, y_active) {
    var arr_result = [];
    var n_max = Math.max(Math.abs(x_active) + 2, Math.abs(y_active) + 2);
    for (let ix = -n_max; ix <= n_max; ix+=2)
    for (let iy = -n_max; iy <= n_max; iy+=2)
      if (G.AI.D2.f_is_square_intersect_square_any([ix, iy], [x_active, y_active])) {
        arr_result.push([ix, iy]);
      }
    //console.log(x_active, y_active);
    return arr_result;
  }
};

G.AI.D3 = {
  //n012=0: x,y;  1: y,z;  2: z,x;  
  f_2d_by_3d: function (xyz, n012) {
    var new_x = xyz[(n012 + 1) % 3];
    var new_y = xyz[(n012 + 2) % 3];
    return [new_x, new_y];
  },

  f_is_cube_intersect_cube: function (a_static, b_active, edge_xyz, sign_and_n12) {
    var n012_axis = G.ARR.OP.f_axis_even(edge_xyz);

    if (a_static.center[n012_axis] != b_active.center[n012_axis]) {return false;}

    var origin_xy = G.AI.D3.f_2d_by_3d(edge_xyz, n012_axis);
    var static_xy = G.AI.D3.f_2d_by_3d(a_static.center, n012_axis);
    var active_xy = G.AI.D3.f_2d_by_3d(b_active.center, n012_axis);


    /*console.log("static_xy, active_xy, sign_and_n12, origin_xy",
    G.AI.D2.f_is_final_intersect(static_xy, active_xy, sign_and_n12, origin_xy),
    static_xy, active_xy, sign_and_n12, origin_xy);*/


    //edge 321
    //if ((a_static.n_index == 2) && (b_active.n_index == 3)) {debugger; }
    if (G.ARR.OP.f_are_eq(edge_xyz,[3,2,1]) && (a_static.n_index == 2) && (b_active.n_index == 3)) {
      //console.log("BOOL", G.AI.D2.f_is_final_intersect(static_xy, active_xy, sign_and_n12, origin_xy));
      //debugger;
    }

    return G.AI.D2.f_is_final_intersect(static_xy, active_xy, sign_and_n12, origin_xy);
  },

  f_is_polycube_blocked_by_other_polycube: function (arr_cubes, indexes_static, indexes_active, edge_xyz_absolute, sign_and_n12) {
    //debugger

    //if ((indexes_static[0] == 5) && (indexes_active[0] == 6)) {debugger; }

    //console.log("*** indexes_active", indexes_active, " indexes_static", indexes_static);
    for (let i_static = 0; i_static < indexes_static.length; i_static+=1) {
      for (let i_active = 0; i_active < indexes_active.length; i_active+=1) {
        let active = indexes_static[i_static];
        let static = indexes_active[i_active];
        if (G.AI.D3.f_is_cube_intersect_cube(
            arr_cubes[active],
            arr_cubes[static],
            edge_xyz_absolute,
            sign_and_n12
          )) {
          //console.log("TRUE");
          return true;
        }
      }
    }
    //console.log("FALSE");
    return false;
  }
};

function ff(ix, iy) {
  //console.log(ix, iy, G.AI.D2.f_generate_blocks(ix,iy).length, ...G.AI.D2.f_generate_blocks(ix,iy));
}

ff(1,1);
ff(1,3);

ff(1,5);
ff(1,-5);

ff(-1,5);
ff(-1,-5);


/*
console.log("### G.AI.D2.f_is_final_intersect([0,4], [0,6], -1, [1,3])", 
  G.AI.D2.f_is_final_intersect([-1,1], [-1,3], -1, [0,0]),
  G.AI.D2.f_is_final_intersect([0,4], [0,6], -1, [1,3]),

  G.AI.D2.f_is_final_intersect([-1,1], [-1,3], 1, [0,0]),
  G.AI.D2.f_is_final_intersect([0,4], [0,6], 1, [1,3]));
*/