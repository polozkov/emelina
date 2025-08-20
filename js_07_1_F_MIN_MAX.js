//область, ограниченная минимальной и максимальной точкой
G.F_MIN_MAX = function (min = G.F_NNN(Infinity), max = G.F_NNN(-Infinity)) {
    this.min = min; //min
    this.max = max; //max
};

//расширь область с помощью точки (если точка вне блока, то блок расширится)
G.F_MIN_MAX.prototype.f_add_point = function (p) {
    return new G.F_MIN_MAX(p.f_op_min(this.min), p.f_op_max(this.max));
};

//расширь область с помощью области (внешняя граница двух блоков)
G.F_MIN_MAX.prototype.f_add_rect = function (min_max) {
    return this.f_add_point(min_max.min).f_add_point(min_max.max);
};

//копируй область - глубокое копирование
G.F_MIN_MAX.prototype.f_get_copy = function () {
    return new G.F_MIN_MAX(this.min.f_get_copy(), this.min.f_get_copy()); 
};

//верни полигон-прямоугольник с четырьмя углами на 2Д плоскости, не обращая внимания на ось "Z"
G.F_MIN_MAX.prototype.f_get_polygon_p4 = function () {
    let a = this.min, b = this.max;
    let arr_xy = [[a.x,a.y], [a.x,b.y], [b.x,b.y], [b.x,a.y]];
    let arr_obj = arr_xy.map(xy => new G.F_XYZ(...xy));
    return new G.F_POLYGON(arr_obj); 
};

//расширь общую область (ограничивающий контейнер) - добавляя четыре точки квадратной грани куба
G.F_MIN_MAX.prototype.f_add_p4 = function (p4) {
    return this.f_add_point(p4[0]).f_add_point(p4[1]).f_add_point(p4[2]).f_add_point(p4[3]);
};

//центр контейнера (среднее арифметическое координа min, max)
G.F_MIN_MAX.prototype.f_get_center = function () {
    return this.min.f_op_center(this.max);
};

//размеры как разность от max до min
G.F_MIN_MAX.prototype.f_get_sizes = function () {
    return new G.F_XYZ(this.max.x - this.min.x, this.max.y - this.min.y, this.max.z - this.min.z);
};

//сожми область в такое количество раз
G.F_MIN_MAX.prototype.f_press_ratio = function (ratio) {
    let c = this.f_get_center();
    let s50 = this.f_get_sizes().f_n_multiply(0.5 * ratio);
    return new G.F_MIN_MAX(c.f_op_subtract(s50), c.f_op_add(s50));
};

//посчитай трансформацию одной области в другую
G.F_MIN_MAX.prototype.f_calculate_transform = function (new_min_max) {
    let new_center = new_min_max.f_get_center();
    let this_center = this.f_get_center();
    //сдвиг между центрами
    let delta = new_center.f_op_subtract(this_center);

    let old_sizes = this.f_get_sizes();
    let new_sizes = new_min_max.f_get_sizes();
    let n_scale = Math.min(new_sizes.x / old_sizes.x, new_sizes.y / old_sizes.y);
    //во столько раз растяни, чтобы поместится (возможны пустоты справа-слева, либо сверху-снизу)
    let xy_scale = new G.F_XYZ(n_scale, n_scale);
    
    let translate_start = "translate(" + delta.f_get_string_xy() + ")";

    //для масштабирования относительно центра нужно: сдвинуть, растянуть, а потом вернуть
    let translate_a = "translate(" + this_center.f_get_string_xy() + ")";
    let scale_string = "scale(" + xy_scale.f_get_string_xy() + ")";
    let translate_b = "translate(" + this_center.f_get_negative().f_get_string_xy() + ")";

    let scale_from_old_center = translate_a + " " + scale_string + " " + translate_b;
    let transform_string = translate_start + " " + scale_from_old_center;
    return transform_string;
};

G.F_MIN_MAX.prototype.f_svg_transform_to_area = function (svg, new_min_max) {
    let transform_string = this.f_calculate_transform(new_min_max);
    let group_open = '<g transform="' + transform_string + '">';
    let group_close = '</g>';
    return group_open + " " + svg + " " + group_close;
};
