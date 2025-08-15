//объект с массивом складок
G.F_MULTIFOLD = function (arr_folds) {
    this.arr_folds = arr_folds;
};

G.F_MULTIFOLD.prototype.f_get_copy = function () {
    let arr_copy_arr_folds = this.arr_folds.map(obj => obj.f_get_copy());
    return new G.F_MULTIFOLD(arr_copy_arr_folds);
};

//создай объект с петлями по строке с описанием
G.AI.MULTIFOLD = {};

//по массиву (массивов из трёх чисел-координат xyz) - создай массив центров (где будут кубы, все координаты чётные)
G.AI.MULTIFOLD.f_convert_arr_012_to_arr_xyz = (a8 = G.CONST.arr_cubes_centers) => a8.map(v => new G.F_XYZ(v[0], v[1], v[2]));

//связь между соседними кубиками (петля сложена нулём градусов), mid_face - середина соприкасающихся граней
G.AI.MULTIFOLD.f_contact_neigbours_fold_0 = function (na, nb, center_a, center_b, mid_face, dir_n6) {
    //середина ребра общая, она равна центру грани, сдвинотому в направлении
    var mid_edge = mid_face.f_op_add(G.CONST.arr_6_directions_xyz[dir_n6]);
    //mid_face общий
    return G.AI.FULL_FOLD.f_create_short(na, nb, center_a, center_b, mid_face, mid_face, mid_edge, 0);
};

//связь между соседними кубиками (петля сложена нулём градусов), mid_face - середина соприкасающихся граней
G.AI.MULTIFOLD.f_contact_neigbours_fold_180 = function (na, nb, center_a, center_b, mid_face, dir_n6) {
    //середина ребра общая, она равна центру грани, сдвинотому в направлении
    var mid_edge = mid_face.f_op_add(G.CONST.arr_6_directions_xyz[dir_n6]);
    
    //mid_face, mid_face_a - диагональ квадрата. center_a, mid_edge - другая диагональ квадрата 
    var mid_face_a = center_a.f_op_add(mid_edge).f_op_subtract(mid_face);
    var mid_face_b = center_b.f_op_add(mid_edge).f_op_subtract(mid_face);
    return G.AI.FULL_FOLD.f_create_short(na, nb, center_a, center_b, mid_face_a, mid_face_b, mid_edge, 2);
};

//кубики касаются по диагонали, известна середина ребра контакта
G.AI.MULTIFOLD.f_contact_diagonal = function (na, nb, center_a, center_b, mid_edge) {
    //обязательно должно быть направление в направлении +х
    for (var dir_best of [0,1,2]) //G.CONST.arr_dir_best_for_diagonal_connections)
    //перебери все 6 вариантов для двух направлениях 
    for (var ia_dir = 0; ia_dir < 6; ia_dir++)
    for (var ib_dir = 0; ib_dir < 6; ib_dir++)
    //хотя бы одно напраление должно совпадать с "обязательным" - то есть к нам, вправо или вверх
    if ((dir_best === ia_dir) || (dir_best === ib_dir)) {
        var a_face = center_a.f_op_add(G.CONST.arr_6_directions_xyz[ia_dir]);
        var b_face = center_b.f_op_add(G.CONST.arr_6_directions_xyz[ib_dir]);

        //убедись, что ни одна координата (между центрами граней) не отклоняется больше, чем на единицу
        //и так ты определи середины граней с полупетлями: a_face, b_face
        var n_max_must_be_1 = b_face.f_op_delta_max_abs(a_face);
        if (n_max_must_be_1 === 1)
            return G.AI.FULL_FOLD.f_create_short(na, nb, center_a, center_b, a_face, b_face, mid_edge, 1);
    }
};

//ещё один конструктор - создание с помощью строки с 7 связями
G.AI.MULTIFOLD.f_multifold_by_string = function (my_string = G.CONST.string_for_task_start, arr_8_centers = G.AI.MULTIFOLD.f_convert_arr_012_to_arr_xyz()) {
    var arr_s7 = my_string.split(" ");

    //добавь сгиб по номерам двух кубов и букве-связи (где крепить петлю)
    function f_add_fold(na, nb, dir_6_letter) {
        var center_a = arr_8_centers[na].f_get_copy();
        var center_b = arr_8_centers[nb].f_get_copy();
        var mid = center_a.f_op_center(center_b);

        //вектор между центрами кубов
        var delta = center_b.f_op_subtract(center_a);
        var delta_sum = delta.f_get_sum_abs();
        var delta_max = delta.f_get_max_abs();

        //Кубики - "соседи" (сдвиг на 2 в любом ннаправлении)
        if ((delta_sum === 2) && (delta_max === 2)) {
            var dir_n6 = G.CONST.obj_dir_indexes[dir_6_letter];
            //направление от середины грани контакта - целое в границах [0..5]
            return G.AI.MULTIFOLD.f_contact_neigbours_fold_180(na, nb, center_a, center_b, mid, dir_n6);
        }
        //Кубикик - "по диагонали" (сдваг на 2,2 в вдух направлениях; по третьей оси сдвиг = 0)
        if ((delta_sum === 4) && (delta_max === 2)) {
            return G.AI.MULTIFOLD.f_contact_diagonal(na, nb, center_a, center_b, mid);
        }
    }

    //D - это Дельта, где вектор задан буквой с одним из шести направлений
    var arr_folds = arr_s7.map(aDb => f_add_fold(+aDb[0], +aDb[2], aDb[1]));
    for (let i = 0; i < arr_folds.length; i++) {
        arr_folds[i].min_fold.index_self = i * 2;
        arr_folds[i].max_fold.index_self = i * 2 + 1;
    }
    return new G.F_MULTIFOLD(arr_folds);
};

//копия массива полу сгибов с индексами кубов и собственными номерами 
G.F_MULTIFOLD.prototype.f_get_arr_half_fold = function () {
    var arr_half_fold_with_index = [];
    function f_push(temp_half_fold, index) {
        arr_half_fold_with_index.push({
            half_fold: temp_half_fold.f_get_copy(),
            index_fold: index,
            index_cube: temp_half_fold.index_cube
        });
    }
    for (var index_fold = 0; index_fold < this.arr_folds.length; index_fold++) {
        f_push(this.arr_folds[index_fold].min_fold, index_fold);
        f_push(this.arr_folds[index_fold].max_fold, index_fold);
    }
    return arr_half_fold_with_index;
};

//поворот всех петель
G.F_MULTIFOLD.prototype.f_op_rotate_m33 = function (m33) {
    var new_arr_folds = this.arr_folds.map(fold => fold.f_op_rotate_m33(m33));
    return new G.F_MULTIFOLD(new_arr_folds);
};

//сдвиг всех петель
G.F_MULTIFOLD.prototype.f_op_translate = function (v) {
    var new_arr_folds = this.arr_folds.map(fold => fold.f_op_translate(v));
    return new G.F_MULTIFOLD(new_arr_folds);
};

//центры всех кубов
G.F_MULTIFOLD.prototype.f_get_centers_of_cubes = function (amount_of_cubes = 8) {
    var arr_centers_of_cubes = new Array(amount_of_cubes).fill(null);
    function f_try_add(half_fold) {
        if (arr_centers_of_cubes[half_fold.index_cube]) {return; }
        arr_centers_of_cubes[half_fold.index_cube] = half_fold.center.f_get_copy();
    }
    for (let i_fold of this.arr_folds) {
        f_try_add(i_fold.min_fold);
        f_try_add(i_fold.max_fold);
    }
    return arr_centers_of_cubes;
};

//верни ТЕРНАРНЫЙ массив длины 7 (как согнуты петли) 
G.F_MULTIFOLD.prototype.f_get_step_fold_array = function () {
    return this.arr_folds.map(obj => obj.f_get_step_fold());
};

//дан потомок - какие кубики поменяли положение - верни массив, анализируя их центры
G.F_MULTIFOLD.prototype.f_get_active_cubes_in_move = function (child) {
    let old_centers = this.f_get_centers_of_cubes(); //старые центры кубов
    let new_centers = child.f_get_centers_of_cubes(); //новые центры кубов
    //центры кубов не равны
    let arr8_0_1_flags_cubes_selected = [0,1,2,3,4,5,6,7].map(n => ((old_centers[n].f_is_unequal(new_centers[n])) ? 1 : 0));
    return arr8_0_1_flags_cubes_selected;
};

//прокомментируй ход, если известен потомок (следующая позиция). Комментарий пиши текстом
G.F_MULTIFOLD.prototype.f_comment_move = function (child) {
    let old_centers = this.f_get_centers_of_cubes(); //старые центры кубов
    let new_centers = child.f_get_centers_of_cubes(); //новые центры кубов
    let arr_i8 = [0,1,2,3,4,5,6,7].filter(n => old_centers[n].f_is_unequal(new_centers[n]));
    let STR_AMOUNT_CUBES = arr_i8.length + "_шт"; //пиши, сколько их штук, которые повернулись (изменили положение)

    let old_folds = this.f_get_step_fold_array(); //ТЕРНАРНЫЙ массив of 0..2 - как сложены петли сейчас
    let new_folds = child.f_get_step_fold_array(); //как будут сложены петли у потомка
    let arr_i7 = [0,1,2,3,4,5,6].filter(n => (old_folds[n] !== new_folds[n])); //петли, которые не совпадают

    let old_fold_n012 = new_folds[arr_i7[0]]; //положение начальной (сгибаемой) петли текущее - число 0,1 или 2
    let new_fold_n012 = old_folds[arr_i7[0]]; //положение начальной (сгибаемой) петли у потомка - число 0,1 или 2
    let angle_012 = 0; //на кокой угол произведён ход
    //либо на 90, либо на 180 градусов
    if (arr_i7.length) {angle_012 = Math.abs(old_fold_n012 - new_fold_n012); };

    let arr_str_012 = ["на___0", "на__90", "на_180"];
    let STR_ANGLE = arr_str_012[angle_012]; //на столько-то (0,90,180) градусов

    //определи, по какой из трёх осей сделан ход-поворот
    let STR_LETTER = "по_оси_" + this.arr_folds[arr_i7[0]].min_fold.mid_edge.f_get_unique_letter().toUpperCase();
    let STR_FINAL = "(" + STR_AMOUNT_CUBES + "_" + STR_ANGLE + "_" + STR_LETTER + ") ";

    return STR_FINAL;
};