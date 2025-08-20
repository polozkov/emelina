//верни одну из 6 осей - как координаты единичного вектора
G.CONST.f_dir_by_letter = my_letter => G.CONST.arr_6_directions_xyz[G.CONST.obj_dir_indexes[my_letter]];

//шесть единичных векторов (преобразуй три координаты в объект F_XYZ)
G.CONST.arr_6_directions_xyz = G.CONST.arr_6_directions.map(v => new G.F_XYZ(v[0],v[1],v[2]));

//шесть вершин на каждой из шести граней (куб отмасштабирован; сторона = 2, но сторону можно растянуть в ratio раз)
G.CONST.f_arr_6_square_faces = (ratio = G.CONST.VIEW.ratio_for_cube_side, shift = new G.F_XYZ(0,0,0)) => 
    G.CONST.arr_6_faces.map(p4 => p4.map(v => new G.F_XYZ(v[0],v[1],v[2]).f_n_multiply(ratio).f_op_add(shift)));

//грани куба стандартного размера (сторона равна 2, не отмасштабирован и поэтому параметр = 1)
G.CONST.arr_6_square_faces_unit_size = G.CONST.f_arr_6_square_faces(1);
//грани отмасштабиррованного кубика
G.CONST.arr_6_square_faces_pressed_size = G.CONST.f_arr_6_square_faces(G.CONST.VIEW.ratio_for_cube_side);

//стиль для рисования сетки - куда размещать отдельные ходы из начальной и конечной позиции
G.CONST.VIEW.GRID_STYLE = new G.F_SVG_STYLE(...G.CONST.RGB.grid_fill_stroke_line_width);

//получи стиль для рисования граней куба (дан индекс куба и флаг - выделен ли куб или нет)
G.CONST.VIEW.f_style_cube = (n8, flag_01_is_select_cube = 0, w = G.CONST.VIEW.default_stroke_cube_width) => 
    new G.F_SVG_STYLE(G.CONST.RGB.arr_not_selected_and_selected[flag_01_is_select_cube], G.CONST.RGB.arr_8_cubes[n8], w);

//получи стиль для рисования складки куба (полускладка задаётся индексом n14: 0..13, толщина линии определена заранее)
G.CONST.VIEW.f_style_n_fold = function(n14, w = G.CONST.VIEW.default_stroke_fold_width) {
    //звет заливки; и в чётной половине случаев ещё и обводки
    let n7_color = G.CONST.RGB.arr_7_folds[n14 >> 1];
    let n7_stroke = (n14 % 2) ? G.CONST.RGB.default_fold_stroke_odd_indexes : n7_color;
    return new G.F_SVG_STYLE(n7_color, n7_stroke, w);
};

//в каком направлении (от 0 до 5) указывет данная ось "xyz"
G.CONST.f_get_direction_index = function (xyz) {
    for (var i = 0; i < 6; i++)
        if (xyz.f_is_equal(G.CONST.arr_6_directions_xyz[i]))
            return i;
};

function f_arr_mask_of_contacts(arr_legal_len2 = [1,2]) {
    let arr_result = [];
    for (let iz of [-1, 0, 1]) for (let iy of [-1, 0, 1]) for (let ix of [-1, 0, 1]) {
        let p = new G.F_XYZ(ix, iy, iz);
        if (arr_legal_len2.includes(p.f_get_len2()))
            arr_result.push(p.f_get_copy());
    };
    return arr_result;
};
G.CONST.arr_contacts_6 = f_arr_mask_of_contacts([1]);
G.CONST.arr_contacts_12 = f_arr_mask_of_contacts([2]);
G.CONST.arr_contacts_18 = f_arr_mask_of_contacts([1,2]);