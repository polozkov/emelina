//копия массива точек
G.F_POLYGON.prototype.f_get_copy = function () {
    var new_arr_xyz = this.arr_xyz.map((p) => new G.F_XYZ(p.x, p.y, p.z));
    return new G.F_POLYGON(new_arr_xyz);
};

//центр - как среднеее арифметическое
G.F_POLYGON.prototype.f_get_center = function() {
    var sum = this.arr_xyz.reduce((sum, current) => sum.f_op_add(current), new G.F_XYZ(0.0,0.0,0.0));
    return sum.f_n_divide(this.arr_xyz.length);
};

//среднее арифметическое z-координат
G.F_POLYGON.prototype.f_get_center_z = function() {
    var sum = this.arr_xyz.reduce((sum, current) => sum + current.z, 0.0);
    return sum / this.arr_xyz.length;
};

//трансформация каждой точки по данной функции
G.F_POLYGON.prototype.f_do_foreach = function (f_new_3d_point) {
    var new_arr_xyz = this.arr_xyz.map((p) => f_new_3d_point(p));
    return new G.F_POLYGON(new_arr_xyz);
};

//сдвиг всех точек
G.F_POLYGON.prototype.f_translate = function (delta_xyz) {
    return this.f_do_foreach((p) => p.f_op_add(delta_xyz));
};

//поворот всех точек
G.F_POLYGON.prototype.f_op_rotate_m33 = function (m33) {
    return this.f_do_foreach((p) => p.f_op_mult_m33(m33));
};

//сдвиг и поворот
G.F_POLYGON.prototype.f_op_rotate_translate = function(m33, delta_xyz) {
    return this.f_op_rotate_m33(m33).f_translate(delta_xyz);
};

//многоугольник с заданным стилем
G.F_POLYGON.prototype.f_get_svg_polygon = function(my_style) {
    //<polygon points="100,100 150,25 150,75 200,0" fill="none" stroke="black" />
    var str_points = this.arr_xyz.map((p) => p.f_get_string_xy()).join(" ");
    var str_style = my_style.f_get_string_style();
    return '<polygon points="' + str_points + '" ' + str_style + '/>';
};

G.F_POLYGON.prototype.f_get_svg_polygon_cut_90_45_45_trio = function(my_style) {
    var line_w = my_style.width_stroke * 1;
    var p3 = this.arr_xyz;

    function f_interpolate(na, nb, ratio) {return p3[na].f_op_interpolate(p3[nb], ratio); };
    //сдвинь a относительно b на абсолутное значение
    function f_move(a,b, distance = line_w / G.CONST.sin_22_5) {return a.f_op_absolute_move(b, distance); };

    var bases = [[1, 2, 0.5], [0,2,G.CONST.tan_22_5], [0,1,G.CONST.tan_22_5]].map(p => f_interpolate(...p));
    var p3_new = [f_move(p3[0], bases[0], line_w * G.CONST.sqrt2), f_move(p3[1], bases[1]), f_move(p3[2], bases[2])];

    return new G.F_POLYGON(p3_new).f_get_svg_polygon(my_style);
};