G.AI.FULL_FOLD = {};

//складка состоит из двух полускладок и угла (0..2: 0,90 или 180) между гранями
G.F_FULL_FOLD = function (min_fold, max_fold) {
    this.min_fold = min_fold;
    this.max_fold = max_fold;
};


//возможнеы значения складки 0,1,2, невозможое - 3; неопределённое - (-1)
//step fold  от 0 до 2  [-90, 0, +90]
//3 - невозможное значение, когда центры кубов совпадают
G.F_FULL_FOLD.prototype.f_get_step_fold = function () {
    //если центры кубов совпадают, то специальное значение 3 (*90) (270 градусов - невозможный поворот)
    if (this.min_fold.center.f_is_equal(this.max_fold.center)) { return 3; };

    //если угол складки не задан, то вычисли его (как расстояние между центрами граней, гле полускладки)
    let delta = this.max_fold.face.f_op_subtract(this.min_fold.face);

    //когда 0 градусов, грани совпадают;
    //когда 90 градусов (1 шаг), сдвиг по диагонали на общем ребре 
    //когда 180 градусов (два шага), угол развёрнут, расстояние 2 (ребро куба - всегда две единицы)
    return delta.f_get_max_abs(); //0, 1 или 2 (максимум среди отклонений по трём осям)
};

//другой конструктор (midEdge совпадает)
G.AI.FULL_FOLD.f_create_short = function (index_cube_a, index_cube_b, center_a, center_b, face_a, face_b, mid_edge) {
    var min_fold = new G.F_HALF_FOLD(index_cube_a, center_a, face_a, mid_edge);
    var max_fold = new G.F_HALF_FOLD(index_cube_b, center_b, face_b, mid_edge);
    return new G.F_FULL_FOLD(min_fold, max_fold);
};

//копия складки
G.F_FULL_FOLD.prototype.f_get_copy = function () {
    return new G.F_FULL_FOLD(this.min_fold.f_get_copy(), this.max_fold.f_get_copy());
};

//поменяй местами порядок полускладок
G.F_FULL_FOLD.prototype.f_get_swap_min_max = function () {
    return new G.F_FULL_FOLD(this.max_fold.f_get_copy(), this.min_fold.f_get_copy());
};

//поверни maxfold относительно себя: на угол кратный 90 относительно оси координат
G.F_HALF_FOLD.prototype.f_do_fold_by_moving_max_fold = function (deg_0123) {
    return new G.F_FULL_FOLD(this.min_fold.f_get_copy(), this.max_fold.f_op_rotate_mid_edge_90_180_270(deg_0123));
};

//to do
//можно ди повернуть max_fold на столько градусов по оси координат
G.F_FULL_FOLD.prototype.f_is_legal_rot = function (plus_or_minus_one) {
    var deg_0123 = (plus_or_minus_one + 4) % 4; //1 или 3
    var new_center = this.max_fold.center.f_op_rotate_mid_edge_90_180_270(deg_0123, this.max_fold.mid_edge);
    return !this.center.f_is_equal(new_center);
};

//поворот по и против на 90 градусов (если поворот упирается в себя, то null)
G.F_FULL_FOLD.prototype.f_get_two_children_plus_minus = function () {
    var is_plus = this.f_is_legal_rot(+1);
    var is_minus = this.f_is_legal_rot(-1);
    var next_plus = null;
    var next_minus = null;
    if (is_plus) { next_plus = this.f_do_fold_by_moving_max_fold(1); };
    if (is_minus) { next_minus = this.f_do_fold_by_moving_max_fold(-1); };
    //вернёт массив 0: плюс 90, 1: минус 90.
    return [next_plus, next_minus];
};

//поворот петли
G.F_FULL_FOLD.prototype.f_op_rotate_m33 = function (m_33) {
    var new_min = this.min_fold.f_op_rotate_m33(m_33);
    var new_max = this.max_fold.f_op_rotate_m33(m_33);
    return new G.F_FULL_FOLD(new_min, new_max);
};

//сдвиг петли
G.F_FULL_FOLD.prototype.f_op_translate = function (v) {
    var new_min = this.min_fold.f_op_translate(v);
    var new_max = this.max_fold.f_op_translate(v);
    return new G.F_FULL_FOLD(new_min, new_max);
};