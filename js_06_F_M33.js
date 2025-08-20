//умножить ВЕКТОР на матрицу поворота; матрица состоит из трёх векторов - базисов (осей)
G.F_XYZ.prototype.f_op_mult_m33 = function (m33) {
    var final_vx = m33.vx.f_n_multiply(this.x);
    var final_vy = m33.vy.f_n_multiply(this.y);
    var final_vz = m33.vz.f_n_multiply(this.z);
    //сумма по трём осям
    return final_vx.f_op_add(final_vy).f_op_add(final_vz);
};

//умножить МАТРИЦУ на матрицу поворота; матрица состоит из трёх векторов - базисов (осей)
G.F_M33.prototype.f_op_matrix_mult_m33 = function (m33) {
    var arr_vx = this.vx.f_op_mult_m33(m33).f_get_array_012();
    var arr_vy = this.vy.f_op_mult_m33(m33).f_get_array_012();
    var arr_vz = this.vz.f_op_mult_m33(m33).f_get_array_012();
    return new G.F_M33(arr_vx, arr_vy, arr_vz);
};

//получи матрицу поворота по текущему вектору, косинусу и синусу (текущий вектор this имеет единичную длину)
G.F_XYZ.prototype.f_convert_cos_sin_to_m33 = function(cos, sin) {
    var s = sin;
    var c = cos;
    var D = 1 - c;
    var x = this.x, y = this.y, z = this.z;
    //  https://en.wikipedia.org/wiki/Rotation_matrix
    var arr_vx = [c + D*x*x,  D*y*x + s*z,  D*z*x - s*y];
    var arr_vy = [D*x*y - s*z,  c + D*y*y,  D*z*y + s*x];
    var arr_vz = [D*x*z + s*y,  D*y*z - s*x,  c + D*z*z];
    return new G.F_M33(arr_vx, arr_vy, arr_vz);
};

//получи матрицу поворота из ВЕКТОРА
G.F_XYZ.prototype.f_convert_deg_to_m33 = function(deg) {
    var cos = Math.cos(deg * Math.PI / 180.0);
    var sin = Math.sin(deg * Math.PI / 180.0);
    var  U = this.f_get_unit();
    return U.f_convert_cos_sin_to_m33(cos, sin);
};

G.F_M33.f_create_by_deg_x_y_z = function (deg_xyz = G.CONST.DEG_ROTATE_X_Y_Z) {
    var mx = new G.F_XYZ(1,0,0).f_convert_deg_to_m33(deg_xyz[0]);
    var my = new G.F_XYZ(0,1,0).f_convert_deg_to_m33(deg_xyz[1]);
    var mz = new G.F_XYZ(0,0,1).f_convert_deg_to_m33(deg_xyz[2]);
    return mx.f_op_matrix_mult_m33(my).f_op_matrix_mult_m33(mz);
};

//поверни текущую точку; по умочанию ось смотрит вверх (0,0,1); угол поворота равен 90 градусов (синус = 1, косинус = 0)
G.F_XYZ.prototype.f_op_rotate_axis_cos_sin = function (axis_v = new G.F_XYZ(0,0,1), cos=0.0, sin=1.0) {
    var U = axis_v.f_get_unit();
    var m33 = U.f_convert_cos_sin_to_m33(cos, sin);
    return this.f_op_mult_m33(m33);
};

//поверни текущую точку вокруг оси; по умочанию ось смотрит вверх (0,0,1); угол поворота равен 90 градусов (синус = 1, косинус = 0)
G.F_XYZ.prototype.f_op_rotate_axis_deg = function (axis_v = new G.F_XYZ(0,0,1), deg = 90.0) {
    return this.f_op_rotate_axis_cos_sin(axis_v, Math.cos(deg * Math.PI / 180.0), Math.sin(deg * Math.PI / 180.0));
};

//поверни текущую точку вокруг оси (с указанием центра)
G.F_XYZ.prototype.f_op_rotate_by_axis_center_deg = function(axis_v, center = new G.F_XYZ(0,0,0), deg = 90.0) {
    var delta_this = this.f_op_subtract(center);
    var new_delta_this_rotate = delta_this.f_op_rotate_axis_deg(axis_v, deg);
    return new_delta_this_rotate.f_op_add(center);
};

//поверни точку вокруг оси ab на заданный угол
G.F_XYZ.prototype.f_op_rotate_by_ab = function (a, b, deg = 90.0) {
    var axis_v = b.f_op_subtract(a);
    var center = b.f_op_center(a);
    return this.f_op_rotate_by_axis_center_deg(axis_v, center, deg);
};

G.F_M33.prototype.f_get_determinant = function () {
    function f_determinant_m33(m) {
        var pos = (m[0][0] * m[1][1] * m[2][2]) + (m[0][1] * m[1][2] * m[2][0]) + (m[0][2] * m[1][0] * m[2][1]);
        var neg = (m[0][2] * m[1][1] * m[2][0]) + (m[0][0] * m[1][2] * m[2][1]) + (m[0][1] * m[1][0] * m[2][2]);
        return pos - neg;
    };

    var m = [this.vx.f_get_array_012(), this.vy.f_get_array_012(), this.vz.f_get_array_012()];
    return f_determinant_m33(m);
};

function f_generate_24_or_48_m33(arr_legal_determinants = [1]) {
    let arr_216_m33 = [];
    for (let ix of G.CONST.arr_6_directions)
        for (let iy of G.CONST.arr_6_directions)
            for (let iz of G.CONST.arr_6_directions)
              arr_216_m33.push(new G.F_M33(ix, iy, iz));

    let f_m33_is_ok = m33 => arr_legal_determinants.includes(m33.f_get_determinant());
    let arr_filtered = arr_216_m33.filter(f_m33_is_ok);
    return arr_filtered;             
};

G.F_M33.arr_24_m33 = f_generate_24_or_48_m33([1]);
G.F_M33.arr_48_m33 = f_generate_24_or_48_m33([-1, 1]);

function f_filter_arr_48_m33(size_xyz) {
    let f_is_m33_ok = m33 => size_xyz.f_op_mult_m33(m33).f_get_abs().f_is_equal(size_xyz);
    return G.F_M33.arr_48_m33.filter(m33 => f_is_m33_ok(m33));
};

function f_search_x_big_arr_48_m33(size_xyz) {
    let f_is_m33_ok = m33 => size_xyz.f_op_mult_m33(m33).f_get_abs().f_is_order_grow();
    return G.F_M33.arr_48_m33.filter(m33 => f_is_m33_ok(m33)); 
};

G.F_M33.arr_m33_by_sizes = {};
G.F_M33.arr_m33_by_x_big = {};
for (let size_ix of [0,1,2,3,4,5,6,7,8])
for (let size_iy of [0,1,2,3,4,5,6,7,8])
for (let size_iz of [0,1,2,3,4,5,6,7,8]) {
    let i_str = size_ix+"_"+size_iy+"_"+size_iz
    G.F_M33.arr_m33_by_sizes[i_str] = f_filter_arr_48_m33(new G.F_XYZ(size_ix,size_iy,size_iz));
    G.F_M33.arr_m33_by_x_big[i_str] = f_search_x_big_arr_48_m33(new G.F_XYZ(size_ix,size_iy,size_iz));
}