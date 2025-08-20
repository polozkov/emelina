//сумма координат точек двух 3д точек
G.F_XYZ.prototype.f_op_add = function(p) {return new G.F_XYZ(this.x + p.x, this.y + p.y, this.z + p.z);};
G.F_XYZ.prototype.f_op_add_x_y_z = function(x=0,y=0,z=0) {return new G.F_XYZ(this.x + x, this.y + y, this.z + z);};

//разность координат точек двух 3д точек
G.F_XYZ.prototype.f_op_subtract = function(p) {return new G.F_XYZ(this.x - p.x, this.y - p.y, this.z - p.z);};
//произведение координат точек двух 3д точек (растянуть по трём осям)
G.F_XYZ.prototype.f_op_multiply = function(p) {return new G.F_XYZ(this.x * p.x, this.y * p.y, this.z * p.z);};
//частное координат точек двух 3д точек (сжать по трём осям)
G.F_XYZ.prototype.f_op_divide = function(p) {return new G.F_XYZ(this.x / p.x, this.y / p.y, this.z / p.z);};

//сравни текущую точку с точкой b  (для сортировки функцией sort)
G.F_XYZ.prototype.f_op_compare = function(b) {return ((this.z-b.z) || (this.y-b.y) || (this.x-b.x)); };

//минимальная граница
G.F_XYZ.prototype.f_op_min = function(p) {return new G.F_XYZ(Math.min(this.x, p.x), Math.min(this.y, p.y), Math.min(this.z, p.z));};
//максимальная граница
G.F_XYZ.prototype.f_op_max = function(p) {return new G.F_XYZ(Math.max(this.x, p.x), Math.max(this.y, p.y), Math.max(this.z, p.z));};

//Векторное произведение двух векторов в трёхмерном евклидовом пространстве 
G.F_XYZ.prototype.f_op_cross_product = function(b) {
    var new_x = this.y * b.z - this.z * b.y;
    var new_y = this.z * b.x - this.x * b.z;
    var new_z = this.x * b.y - this.y * b.x;
    return new G.F_XYZ(new_x, new_y, new_z);
};

//умножить координаты 3д точки на n (растянуть)
G.F_XYZ.prototype.f_n_multiply = function(n) {return new G.F_XYZ(this.x * n, this.y * n, this.z * n);};
//разделить координаты 3д точки на n (сжать)
G.F_XYZ.prototype.f_n_divide = function(n) {return new G.F_XYZ(this.x / n, this.y / n, this.z / n);};

//глубокое копирование точки (всех трёх координат)
G.F_XYZ.prototype.f_get_copy = function () {return new G.F_XYZ(this.x, this.y, this.z); };

G.F_XYZ.prototype.f_get_negative = function () {return new G.F_XYZ(-this.x, -this.y, -this.z); };

//квадрат длины от нулевой точки
G.F_XYZ.prototype.f_get_len2 = function () {return (this.x * this.x) + (this.y * this.y) + (this.z * this.z); };
//длина до точки "b" от данной точки
G.F_XYZ.prototype.f_op_len2 = function (b) {return this.f_op_subtract(b).f_get_len2(); };

//длина до нулевой точки (по теореме Пифагора - с помощью корня)
G.F_XYZ.prototype.f_get_len = function () {return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); };
//нормализируй радиус-вектор (делай длину равной одному)
G.F_XYZ.prototype.f_get_unit = function() {return this.f_n_divide(this.f_get_len()); };
//две координаты (х,у), разделённые запятой
G.F_XYZ.prototype.f_get_string_xy = function(separator = ",") {return this.x + separator + this.y; };

//максимальная координата из трёх
G.F_XYZ.prototype.f_get_max = function() {return Math.max(this.x, this.y, this.z); };
//все три координаты преобразуй в беззнаковые числа
G.F_XYZ.prototype.f_get_abs = function() {return new G.F_XYZ(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)); };
//максимум среди модулей трёх координат
G.F_XYZ.prototype.f_get_max_abs = function () {return Math.max(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)); };
//сумма трёх расстояний (по трём осям) - то есть сумма модулей
G.F_XYZ.prototype.f_get_sum_abs = function () {return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); };

//верни массив длины 3
G.F_XYZ.prototype.f_get_array_012 = function () {return [this.x, this.y, this.z]; };
//верни массив длины 3 из битов 0..1
G.F_XYZ.prototype.f_get_array_012_bits = function () {
    let a = this.f_get_array_012().map(n => ((n % 2) ? 1 : 0));
    return a;
};
G.F_XYZ.prototype.f_get_07_bits = function () {
    let a = this.f_get_array_012_bits();
    return a[0] + a[1] * 2 + a[2] * 4;
}
G.F_XYZ.prototype.f_get_unique_letter = function () {
    return G.CONST.arr_unique_letter[this.f_get_07_bits()];
};
//номер направления 0: +-x,  1: +- y,  2: +- z
G.F_XYZ.prototype.f_get_unique_n012 = function () {
    return G.CONST.arr_unique_bit[this.f_get_07_bits()];
};

//три буквы: в нужном порядке - сведи 3д к 2д
G.F_XYZ.prototype.f_get_unique_three_letters = function () {
    let n012 = G.CONST.arr_unique_bit[this.f_get_07_bits()];
    return G.CONST.arr_char_my_012[n012];
};

//максимум из отклонений по трём осям от точки b
G.F_XYZ.prototype.f_op_delta_max_abs = function(b) {return Math.max(Math.abs(this.x-b.x), Math.abs(this.y-b.y), Math.abs(this.z-b.z)); };
//G.F_XYZ.prototype.f_get_sum_abs_delta = function (b=new G.F_XYZ(0,0,0)) {return Math.abs(this.x-b.x) + Math.abs(this.y-b.y) + Math.abs(this.z-b.z); };

//сравнивай две точки покоординатно
G.F_XYZ.prototype.f_is_equal = function(b) {return ((this.x === b.x) && (this.y === b.y) && (this.z === b.z)); };
G.F_XYZ.prototype.f_is_unequal = function(b) {return !((this.x === b.x) && (this.y === b.y) && (this.z === b.z)); };


G.F_XYZ.prototype.f_is_order_grow = function() {return (this.x >= this.y)&&(this.y >= this.z); };

G.F_XYZ.prototype.f_is_on_one_axe = function(b) {
    let unique_letter = this.f_get_unique_letter();
    let delta = this.f_op_subtract(b);
    delta[unique_letter] = 0;
    return ((delta.x === 0) && (delta.y === 0) && (delta.z === 0));
};
//нормализуя, растыни до нужной длины
G.F_XYZ.prototype.f_set_len = function (final_len = 1.0) {return this.f_n_multiply(final_len / this.f_get_len()); };

//середина отрезка ab
G.F_XYZ.prototype.f_op_center = function (b) {return (this.f_op_add(b)).f_n_divide(2); };

//интерполяция между двумя точками (a:0; b:1)
G.F_XYZ.prototype.f_op_interpolate = function(b, n01) {
    var v = b.f_op_subtract(this);
    var v_01 = v.f_n_multiply(n01);
    return this.f_op_add(v_01);
};

//перемещение на заданное расстояние в направлении точки "b"
G.F_XYZ.prototype.f_op_absolute_move = function(b, distance) {
    var v = b.f_op_subtract(this);
    var v_01 = v.f_get_unit().f_n_multiply(distance);
    return this.f_op_add(v_01);
};

//середина отрезка ab
G.F_XYZ.prototype.f_op_middle = function(b) {
    return this.f_op_add(b).f_n_multiply(0.5);
};

//сдвинь в направление ab точку "а" на данное расстояние
G.F_XYZ.prototype.f_op_interpolate_absolute = function(b, n_len_for_interpolate) {
    var v = b.f_op_subtract(a);
    var v_translate = v.f_set_len(n_len_for_interpolate);
    return a.f_op_add(v_translate);
};

//единичный вектор преврати в номер грани от 0 до 5 (6 граней)
G.F_XYZ.prototype.f_get_direction_05 = function() {
    var n012 = this.f_get_unique_n012();
    var sum = this.x + this.y + this.z;
    return (sum > 0) ? n012 : ((2 - n012) + 3);
};

//дана середина ребра, верни вершину куба (на этом ребре)
G.F_XYZ.prototype.f_get_edge_end = function(plus_or_minus_one) {
    let letter = this.f_get_unique_letter();
    let my_copy = this.f_get_copy();
    my_copy[letter] = plus_or_minus_one;
    return my_copy;
};

