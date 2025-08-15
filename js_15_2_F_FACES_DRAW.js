//прорисвка (для SVG) граней с полупетлями (на каждой грани от 0 до 4 полупетель)
G.F_FACES_DRAW = function (arr_folds) {
    //48 чисел (по количеству граней) по порядку: числа от 0 до 47
    var arr_48_index = (new Array(8 * 6)).fill().map((n,i) => i);
    //информация о каждой грани (по индексу от 0 до 47)
    function f_obj_48(n48) {
        var n6 = n48 % 6; //направление (грань на кубе)
        var n8 = (n48 - n6) / 6; //номер куба
        var xyz6 = G.CONST.arr_6_directions_xyz[n6].f_get_copy(); //вектор от середины куба до грани
        return ({
                n48: n48,  n6: n6,  n8: n8,  xyz6: xyz6, 
                cube_center: {},
                arr_half_fold_info: []
        });
    }
    //информация о каждой грани с неопределёнными
    var arr_48_8_6 = arr_48_index.map(n48 => f_obj_48(n48));
    //центры всех восьми кубов
    var arr_cube_xyz_centers = new Array(8).fill(null);

    //заполни центры всех восьми кубов
    for (let i = 0; i < arr_folds.length; i++) {
        let fold_min = arr_folds[i].min_fold;
        let fold_max = arr_folds[i].max_fold;
        if (arr_cube_xyz_centers[fold_min.index_cube] === null) {
            arr_cube_xyz_centers[fold_min.index_cube] = fold_min.center.f_get_copy();
        }
        if (arr_cube_xyz_centers[fold_max.index_cube] === null) {
            arr_cube_xyz_centers[fold_max.index_cube] = fold_max.center.f_get_copy();
        }
    }
    
    //заполни для каждого куба центры шесть раз (в массиве 48=8*6 граней)
    for (let i8 = 0; i8 < 8; i8++) {
        for (let i6 = 0; i6 < 6; i6++) {
            arr_48_8_6[i8 * 6 + i6].cube_center = arr_cube_xyz_centers[i8].f_get_copy();
        }
    }

    //информация о каждой полупетле как объект (на каждой из 48 граней от 0 до 4 таких объектов)
    function f_half_fold_info(half_fold) {
        let cube_center = half_fold.center.f_get_copy(); //центр куба там, где полупетля
        let cube_index = half_fold.index_cube; //индекс куба от 0 до 7
        let index_self = half_fold.index_self; //свой индекс от 0 до 13

        let face_center_rel = half_fold.face.f_op_subtract(cube_center); //вектор от центра куба до цетра грани 
        let face_center_05 = face_center_rel.f_get_direction_05(); //индекс вектора в сторону грани (от 0 до 5)
        let edge_center_rel = half_fold.mid_edge.f_op_subtract(cube_center); //от центра куба до середины ребра

        let n48 = cube_index * 6 + face_center_05; //индекс от 0 до 47 (по индексу куба и индексу грани)
        //информация о полупетле
        let final_result_half_fold_info = ({
            cube_center: cube_center,
            cube_index: cube_index,
            index_self: index_self, 
            face_center_rel: face_center_rel,
            face_center_05: face_center_05,
            edge_center_rel, edge_center_rel,
            n48: n48
        });
        //информация о полупетле на определённой грани
        return final_result_half_fold_info;
    }

    //добавь в arr_48_8_6 информацию о полупетле
    function f_half_fold_add(half_fold) {
        let fold_info = f_half_fold_info(half_fold);
        let n48 = fold_info.n48;
        arr_48_8_6[n48].arr_half_fold_info.push(fold_info);
    }

    //добавить две полупетли в базу
    for (let i = 0; i < arr_folds.length; i++) {
        f_half_fold_add(arr_folds[i].min_fold);
        f_half_fold_add(arr_folds[i].max_fold);
    }

    this.arr_48 = arr_48_8_6;
};

//информация о прорисовке одной квадратной грани (с информацией о полупетлях: их количество от 0 до 4)
G.F_FACES_DRAW.prototype.f_get_one_face_with_transform = function (i48, ratio_side = G.CONST.VIEW.ratio_for_cube_side, m33 = new G.F_M33(), v_translate = new G.F_XYZ()) {
    //грань из текущего массива
    var i_face = this.arr_48[i48];
    var i_cube_color_index = (i48 - i48 % 6) / 6;
    var arr_half_folds = i_face.arr_half_fold_info;
    function f_transform(p) {return p.f_op_mult_m33(m33).f_op_add(v_translate); }
    function f_transform_arr(arr) {return arr.map(v => f_transform(v)); }

    //многоугольник-треугольник с индексом, определяющим цвет
    function f_trio(edge_center_rel, face_center_rel, cube_center, index_self) {
        var v8_minus_rel = edge_center_rel.f_get_edge_end(-1).f_n_multiply(ratio_side);
        var v8_plus_rel = edge_center_rel.f_get_edge_end(1).f_n_multiply(ratio_side);
        var center_face = face_center_rel.f_n_multiply(ratio_side);
        //относительные координаты треугольника (куб сжат в пропорции ratio_side)
        var p3_pre_rel = [center_face, v8_minus_rel, v8_plus_rel];
        var p3_pre = p3_pre_rel.map(v => v.f_op_add(cube_center));
        var p3 = f_transform_arr(p3_pre);
        return ({p3: p3, index_self: index_self});
    }

    function f_p4(face_center_05, cube_center) {
        //4 вершины куба, где грань. Куб отмасштабирован в пропорции ratio_side
        var p4_pre = G.CONST.f_arr_6_square_faces(ratio_side, cube_center)[face_center_05];
        var p4 = f_transform_arr(p4_pre);
        var ratio_rel_mid_face = G.CONST.arr_6_directions_xyz[face_center_05].f_n_multiply(ratio_side);
        var mid_point_4 = f_transform(cube_center.f_op_add(ratio_rel_mid_face));
        return ({p4: p4, mid_point_4: mid_point_4});
    }

    var arr_p3 = arr_half_folds.map(obj => f_trio(obj.edge_center_rel, obj.face_center_rel, obj.cube_center, obj.index_self));
    var face_center_05 = i48 % 6;
    var obj_p4 = f_p4(face_center_05, i_face.cube_center);
    return ({arr_p3: arr_p3,  p4: obj_p4.p4,  mid_point_4: obj_p4.mid_point_4,  cube_color_index: i_cube_color_index});
};

var m33_default = G.F_M33.f_create_by_deg_x_y_z();

//пока не вписывай Емелины печки в предназначенные для них клеточки
G.F_FACES_DRAW.prototype.f_get_prefinal_svg = function (arr8_0_1_flags_cubes_selected = [0,0,0,0, 0,0,0,0], ratio_side = G.CONST.VIEW.ratio_for_cube_side, m33 = m33_default, v_translate = new G.F_XYZ()) {
    //индексы от 0 до 47
    var arr_48_indexes = new Array(48).fill().map((n,i) => i);
    //массив 0..47 с информацией о каждой грани (достаточной для прорисовки)
    var arr_48_obj = arr_48_indexes.map(n => this.f_get_one_face_with_transform(n, ratio_side, m33, v_translate));
    
    //отсортируй по z - координате
    function f_compare_faces(a, b) {return a.mid_point_4.z - b.mid_point_4.z; };
    //отсортируй по z-координате все 48 граней (на грани могут быть петлЯ или пЕтли)
    arr_48_obj.sort(f_compare_faces);

    let svg = "";

    let min_max = new G.F_MIN_MAX();

    function f_get_svg(face) {
        min_max = min_max.f_add_p4(face.p4);

        let svg_i48 = "";
        let polygon_4 = new G.F_POLYGON(face.p4);
        let flag_01_is_select_cube = arr8_0_1_flags_cubes_selected[face.cube_color_index];
        //стиль для прорисовки квадратной грани
        let style_4 = G.CONST.VIEW.f_style_cube(face.cube_color_index, flag_01_is_select_cube);

        svg_i48 += polygon_4.f_get_svg_polygon(style_4);

        for (let i_trio = 0; i_trio < face.arr_p3.length; i_trio++) {
            let obj = face.arr_p3[i_trio];
            let i14 = obj.index_self;
            let style_3 = G.CONST.VIEW.f_style_n_fold(i14);
            let polygon_3 = new G.F_POLYGON(obj.p3);
            svg_i48 += polygon_3.f_get_svg_polygon_cut_90_45_45_trio(style_3);
        }

        return svg_i48;
    }

    //47 = 6*8 - 1 (48 - число граней)
    for (let i48 = 0; i48 <= 47; i48++)
        svg += f_get_svg(arr_48_obj[i48]);

    return [svg, min_max];
};

G.F_FACES_DRAW.prototype.f_get_final_svg = function(min_max_in_100, arr8_0_1_flags_cubes_selected = [0,0,0,0, 0,0,0,0]) {
    let [svg,min_max] = [...this.f_get_prefinal_svg(arr8_0_1_flags_cubes_selected)];
    let svg_inscribe = min_max.f_svg_transform_to_area(svg, min_max_in_100);
    return svg_inscribe;
};