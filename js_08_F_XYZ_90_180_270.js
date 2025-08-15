//поворот относительно нужной оси на произвольный угол, заданный косинусом и синусом
G.F_XYZ.prototype.f_op_rotate_from_origin_cos_sin = function (axis_012_xyz = 2, cos = 0, sin = 1) {  
    var char_x = G.CONST.arr_char_x[axis_012_xyz];
    var char_y = G.CONST.arr_char_y[axis_012_xyz];
    var x = this[char_x];
    var y = this[char_y];

    var this_copy = this.f_get_copy();
    this_copy[char_x] = x * cos - y * sin; //new_x = x*cos - y*sin
    this_copy[char_y] = x * sin + y * cos; //new_y = x*sin + y*cos
    return this_copy
};

//поворот на угол на шаг 0123, шаг = 90
G.F_XYZ.prototype.f_op_rotate_from_origin_90_180_270 = function (axis_012_xyz = 2, deg_0123 = 1) {
    var cos = G.CONST.arr_cos[deg_0123];
    var sin = G.CONST.arr_sin[deg_0123];
    return this.f_op_rotate_from_origin_cos_sin(axis_012_xyz, cos, sin);
};

//определи ту ось, которая отличается чётностью координат от двух других
G.F_XYZ.prototype.f_get_unique_index_of_axis = function() {
    var bit_x0 = (Math.abs(this.x) % 2) * 1;
    var bit_y1 = (Math.abs(this.y) % 2) * 2;
    var bit_z2 = (Math.abs(this.z) % 2) * 4;
    return G.CONST.arr_unique_bit[bit_x0 + bit_y1 + bit_z2];
};

//поворот относительно данной середины ребра
G.F_XYZ.prototype.f_op_rotate_mid_edge_90_180_270 = function (deg_0123, mid_edge) {
    //определи направление оси
    var axis_012_xyz = mid_edge.f_get_unique_index_of_axis();
    //расстояние до середины ребра (относительно которой делают поворот)
    var this_from_mid_edge = this.f_op_subtract(mid_edge);
    //совёршённый поворот
    var this_rotated = this_from_mid_edge.f_op_rotate_from_origin_90_180_270(axis_012_xyz, deg_0123);
    //верни совершённый поворот, сдвинутый на mid_edge
    return this_rotated.f_op_add(mid_edge);
};
