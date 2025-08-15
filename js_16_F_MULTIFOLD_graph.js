G.F_MULTIFOLD.prototype.f_get_graph_as_lists = function () {
    //массив соседей - "a" сосед "b" => "b" сосед "a"  
    var arr_adjacency = [[],[],[],[], [],[],[],[]];
    for (let fold of this.arr_folds) {
        arr_adjacency[fold.min_fold.index_cube].push(fold.max_fold.index_cube);
        arr_adjacency[fold.max_fold.index_cube].push(fold.min_fold.index_cube);
    }
    return arr_adjacency;
};

//путь между двумя кубиками
G.F_MULTIFOLD.prototype.f_search_unique_path_in_tree = function(vertex_start, vertex_final) {
    return G.AI.TREE.f_search_unique_path_in_tree(this.f_get_graph_as_lists(), vertex_start, vertex_final); 
};

//по данному массиву рёбер - определи, какие кубы "активные", а какие "статичные".
//Старовый куб (основной) - всегда статичен
G.F_MULTIFOLD.prototype.f_separate_active_as_n_times = function(arr_06, index_start_cube) {
    //петли (свои) - в одной петле две полупетли
    var arr_obj_folds = arr_06.map(n => this.arr_folds[n]);
    //откуда и куда идёт петля
    var arr_of_pairs_swap = arr_obj_folds.map(obj => [obj.min_fold.index_cube, obj.max_fold.index_cube]);

    var matrix = Array(8).fill().map(() => Array(8).fill(0));
    //матрица смежности
    for (i_ab of arr_of_pairs_swap) {
        matrix[i_ab[0]][i_ab[1]] = 1;
        matrix[i_ab[1]][i_ab[0]] = 1;
    }

    //путь в дереве
    let arr_pathes = [0,1,2,3,4,5,6,7].map(n => this.f_search_unique_path_in_tree(index_start_cube, n));
    //сколько раз пересекаем раздедитель (сгибаемую петлю)
    let arr_n_times_separate = G.AI.TREE.f_select_by_path_and_matrix_of_swap(arr_pathes, matrix);
    return arr_n_times_separate;
};

G.F_MULTIFOLD.prototype.f_separate_active_half_folds = function(arr_06, index_start_cube) {
    let arr_n_times_separate = this.f_separate_active_as_n_times(arr_06, index_start_cube);

    //Фильтруем индексы, где элементы нечётные
    //Создаём массив объектов {element, index}
    //Фильтруем нечётные элементы
    let arr_odd_indexes = arr_n_times_separate
        .map((element, index) => ({ element, index }))
        .filter(obj => ((obj.element % 2) !== 0))    
        .map(obj => obj.index);
    
    //дан один из 14 вариантов полупетли. Куб сам принадлежит нечётным (то есть, активным) кубам?
    let f_is_half_fold_7_min_max = (n7, str_min_max) => arr_odd_indexes.includes(this.arr_folds[n7][str_min_max].index_cube);

    //эта (одна из 14 полупетель) активна?
    let f_is_half_fold_14_active = n14 => f_is_half_fold_7_min_max(...G.CONST.arr_14_as_7_2[n14]);
    
    //верни все "активные полупетли"
    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13].filter(n => f_is_half_fold_14_active(n));
};

//активные петли - на активных кубах, пассивные петли - на пассивных кубах
G.F_MULTIFOLD.prototype.f_arr_bool_half_folds__to_bool_cubes = function (arr14_bool) {
    let arr8_bool = [false,false,false,false, false,false,false,false];
    let arr_folds = this.arr_folds;

    for (let i = 0; i < 14; i++) {
        let [n7,str] = G.CONST.arr_14_as_7_2[i];
        let n8 = arr_folds[n7][str].index_cube;
        if (arr14_bool[i]) {arr8_bool[n8] = true;};
    }
    return arr8_bool;
};

//функция для создания подробной информации по данным активным полупетлям (генерируй пассивные)
//arr14_active - это массив индексов от 0..13, которые двигаются
G.F_MULTIFOLD.prototype.f_arr_active_to_info_passive = function(arr14_active) {
    let bin14_active = G.AI.TREE.f_arr_to_bin14(arr14_active);
    let bin14_passive = 16383 ^ bin14_active; //16383 = 2**14 - 1
    let arr14_passive = G.AI.TREE.f_bin14_to_arr(bin14_passive);

    let arr14_bool = G.AI.TREE.f_bin14_to_arr_true_false(bin14_active);
    let arr8_bool = this.f_arr_bool_half_folds__to_bool_cubes(arr14_bool);

    let arr8_active = G.AI.TREE.f_bool8_filter_true(arr8_bool);
    let arr8_passive = G.AI.TREE.f_bool8_filter_false(arr8_bool);
    
    return ({arr14_active: arr14_active,
             arr14_passive: arr14_passive,
             arr14_bool: arr14_bool,

             arr8_active: arr8_active,
             arr8_passive: arr8_passive,
             arr8_bool: arr8_bool});
};

//активные полу-петли в зависимости от комбинации разделяющих рёбер (а их 2**7 = 128)
G.F_MULTIFOLD.prototype.f_separate_active_data_base_128 = function(index_start_cube = G.CONST.index_of_static_cube) {
    //массивы, с разрядами там, где стоят единицы (петли) в двоичной запписи чисел от 0 до 127
    let arr_128 = new Array(128).fill().map((n, i) => G.AI.TREE.f_n128_to_arr(i));
    //активные части полускладок (в зависимоси от петель)
    let arr_128_active_half_folds = arr_128.map(arr_06 => this.f_separate_active_half_folds(arr_06, index_start_cube));

    let arr_data = arr_128_active_half_folds.map(arr_active => this.f_arr_active_to_info_passive(arr_active));
    return arr_data;
};

