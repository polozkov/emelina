G.DRAW.PRIMITIVES = {
  //length of dash step in dash line (gap between two segments)
  DASH_STEP: 5.0,

  //line between two points
  f_line: function (pa, pb, obj_style = new G.DRAW.F_STYLE()) {
    var my_string = '<line x1="' + pa[0] + '" y1="' + pa[1] + '" x2="' + pb[0] + '" y2="' + pb[1] + '"';
    return my_string + " " + obj_style.f_get_style_stroke() + ' " />';
  },

  //cross for connection of two cubes
  f_cross: function (abcd, obj_style = new G.DRAW.F_STYLE()) {
    var ad = G.DRAW.PRIMITIVES.f_line(abcd[0], abcd[3], obj_style);
    var bc = G.DRAW.PRIMITIVES.f_line(abcd[1], abcd[2], obj_style);
    return ad + bc;
  },

  //len_xy is distance on 2D (Pythagorean theorem) thas separated on "n" segments for dash line
  f_calc_step_amount: function(len_xy, dash_step) {
    var ratio = len_xy / dash_step;
    var n = Math.round(ratio);
    
    if (n >= ratio) {return ((n % 2) == 1) ? n : (n + 1); }
    n = n + 1;
    if (n >= ratio) {return ((n % 2) == 1) ? n : (n + 1); }

    //console.log(len_xy, dash_step);
    return 1;
  },

  f_dash_line: function (pa, pb, obj_style = new G.DRAW.F_STYLE.F_STYLE(), dash_step = D.P.DASH_STEP) {
    var n = G.DRAW.PRIMITIVES.f_calc_step_amount(G.ARR.LEN.f_ab(pa, pb, 0), dash_step);
    var my_string = "";
    var a_new = [], b_new = [];
    for (var i = 0; i <= n; i+=2) {
      a_new = G.ARR.OP.f_interpolate(pa, pb, (i+0.0) / n);
      b_new = G.ARR.OP.f_interpolate(pa, pb, (i+1.0) / n);
      my_string += G.DRAW.PRIMITIVES.f_line(a_new, b_new, obj_style);
    }
    return my_string;
  },

  f_line_with_visible_interval: function (pa, pb, visible_intervals = 1, obj_style = new G.DRAW.F_STYLE.F_STYLE(), dash_step = G.DRAW.PRIMITIVES.DASH_STEP) {
    if (visible_intervals == 0) {
      return G.DRAW.PRIMITIVES.f_dash_line(pa, pb, obj_style, dash_step);
    }
    return G.DRAW.PRIMITIVES.f_line(pa, pb, obj_style);
  },

  //ellipse can be rotated
  f_ellipse: function (center, rx, ry, rotate_deg = 0, obj_style = new G.DRAW.F_STYLE.F_STYLE()) {
    var my_string = '<ellipse cx="' + center[0] + '" cy="' + center[1] + '" rx="' + rx + '" ry="' + ry + '"';
    my_string += " " + obj_style.f_get_style_stroke_fill();
    var rot = rotate_deg ? ' transform = "rotate(' + rotate_deg + ' ' + center[0] + ' ' + center[1] + ')"' : "";
    return  my_string + rot + ' " />';
  },

  //rectengle by opposite corners
  f_rect: function (a, b, obj_style = new G.DRAW.F_STYLE.F_STYLE()) {
    var wh = b.f_op_sub(a);
    var my_string = '<rect x="' + a[0] + '" y="' + a[1] + '" width="' + wh[0] + '" height="' + wh[1] + '"';
    my_string += obj_style.f_get_style_stroke_fill()
    return  my_string + ' " />';
  }
};

