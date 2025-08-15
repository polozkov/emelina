G.F_HALF_FOLD = function (index_cube, center, face, mid_edge, index_self = 0) {
    //самономер от 0 до 13 (всего 14 полупетель, условно сгруппированнных по порядку 2 полупетли)
    this.index_self = index_self;

    //номер кубика от 0 до 7
    this.index_cube = index_cube;
    //точка - координата центра кубика
    this.center = center;
    //точка на грани, к которой крепится половинка складки
    this.face = face;
    //точка на середине ребра, к которой крепится половинка складки
    this.mid_edge = mid_edge;
};

//копия текущей половинки складки
G.F_HALF_FOLD.prototype.f_get_copy = function () {
    var new_center = this.center.f_get_copy();
    var new_face = this.face.f_get_copy();
    var new_mid_edge = this.mid_edge.f_get_copy();
    return new G.F_HALF_FOLD(this.index_cube, new_center, new_face, new_mid_edge, this.index_self);
};

//поверни на угол, кратный 90 (по умолчанию поворот вокруг текущего ребра)
G.F_HALF_FOLD.prototype.f_op_rotate_mid_edge_90_180_270 = function(deg_0123, mid_edge) {
    mid_edge = mid_edge || this.mid_edge;
    //f_op_rotate_mid_edge_90_180_270 - функция поворота
    var new_center = this.center.f_op_rotate_mid_edge_90_180_270(deg_0123, mid_edge);
    var new_face = this.face.f_op_rotate_mid_edge_90_180_270(deg_0123, mid_edge);
    var new_mid_edge = this.mid_edge.f_op_rotate_mid_edge_90_180_270(deg_0123, mid_edge);
    return new G.F_HALF_FOLD(this.index_cube, new_center, new_face, new_mid_edge, this.index_self);
};

//поворот с помощью матрицы относительно нуля
G.F_HALF_FOLD.prototype.f_op_rotate_m33 = function(m33) {
    var new_center = this.center.f_op_mult_m33(m33);
    var new_face = this.face.f_op_mult_m33(m33);
    var new_mid_edge = this.mid_edge.f_op_mult_m33(m33);
    return new G.F_HALF_FOLD(this.index_cube, new_center, new_face, new_mid_edge, this.index_self);  
};

//сдвиг на вектор
G.F_HALF_FOLD.prototype.f_op_translate = function (v) {
    var new_center = this.center.f_op_add(v);
    var new_face = this.face.f_op_add(v);
    var new_mid_edge = this.mid_edge.f_op_add(v);
    return new G.F_HALF_FOLD(this.index_cube, new_center, new_face, new_mid_edge, this.index_self);  
};