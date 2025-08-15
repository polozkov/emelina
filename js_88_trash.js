G.F_MULTIFOLD.prototype.f_get_all_separations_by_data = function(get_data_128) {
    //для ускорения работы - заранее просчитай базу данных (для ходов)
    var data_128 = get_data_128 || this.f_separate_active_data_base_128();

    //возможности, как делятся оси
    var axis_sets = this.f_get_axis_sets();
    debugger
    var LEN = axis_sets.length;
    //база данных + координата прямой на оси
    var my_result_from_data = new Array(LEN).fill(null);


    for (let i = 0; i < axis_sets.length; i++) {
        let n128 = axis_sets[i].n128;
        my_result_from_data[i] = data_128[n128];
        //добавь ось, относительно которой всё вращается
        my_result_from_data[i].line = axis_sets[i].line;
    }

    return my_result_from_data;
};

G.F_MULTIFOLD.prototype.f_get_all_separations_by_data = function(get_data_128) {
    //для ускорения работы - заранее просчитай базу данных (для ходов)
    var data_128 = get_data_128 || this.f_separate_active_data_base_128();

    //возможности, как делятся оси
    var axis_sets = this.f_get_axis_sets();

    console.log(data_128);
    return axis_sets;
};




(function f_test() {
    let my_multifold = G.AI.MULTIFOLD.f_multifold_by_string();
    let legal_moves = my_multifold.f_legal_moves();
    let arr_multifold = [my_multifold, ...legal_moves];
    G.SVG.EL.innerHTML = G.SVG.f_draw_arr_myltifold(arr_multifold);

    //var faces_draw = new G.F_FACES_DRAW(my_multifold.arr_folds);
    //var my_svg = faces_draw.f_get_final_svg();
    //console.log(my_svg);
    G.SVG.EL.innerHTML = my_svg;

    //console.log(my_multifold.f_separate_active_data_base_128());

    function f_test_speed() {
        console.time('functionTimer');
        let database_separate_128 = null;
        for (let i = 0; i < 100; i++)
            database_separate_128 = my_multifold.f_separate_active_data_base_128();
        console.timeEnd('functionTimer');
    };

    //console.log(my_multifold.f_get_axis_sets());
    //console.log(my_multifold.f_legal_moves());

    var legal_moves = my_multifold.f_legal_moves();
    //console.log(G);
}());


G.F_MULTIFOLD.prototype.f_comment_move = function (child, n_depth) {
    let old_centers = this.f_get_centers_of_cubes();
    let new_centers = child.f_get_centers_of_cubes();
    let arr_i8 = [0,1,2,3,4,5,6,7].filter(n => old_centers[n].f_is_unequal(new_centers[n]));

    let old_folds = this.f_get_step_fold_array();
    let new_folds = child.f_get_step_fold_array();
    let arr_i7 = [0,1,2,3,4,5,6].filter(n => (old_folds[n] !== new_folds[n]));

    let angle = 0;
    if (arr_i7.length) {angle = Math.abs(new_folds[arr_i7[0]] - old_folds[arr_i7[0]]) * 90; };

    let colors_cubes = arr_i8.map(n => G.CONST.RGB.arr_8_cubes_names[n]).join(",");
    let colors_folds = arr_i7.map(n => G.CONST.RGB.arr_7_folds_names[n]).join(",");

    //let string_move_number = (n_depth === (-1)) ? "" : ("Глубина до начала: " + n_depth + " -> " + (n_depth + 1) + ". ");
    //let string_move_info = "Поворот " + angle + ", КУБЫ: " + colors_cubes + ", ПЕТЛИ: " + colors_folds;

    let string_move_number = n_depth + "-" +  (n_depth + 1) + ",";
    let string_move_info  = angle + "[" + colors_cubes + "]" + colors_folds;
    
    let string_letter_direction = this.arr_folds[arr_i7[0]].min_fold.mid_edge.f_get_unique_letter().toUpperCase();

    return "(" + string_letter_direction + "," + string_move_number + string_move_info + "); ";
};

G.AI.BRUTE.f_n_to_ternary = function (num) {
    // 1. Переводим число в троичную систему
    let ternaryStr = num.toString(3);
    // 2. Добавляем ведущие нули до длины 7
    ternaryStr = ternaryStr.padStart(7, '0');
    // 3. Разбиваем строку на массив цифр (и преобразуем символы в числа)
    const ternaryArray = ternaryStr.split('').map(Number);
    return ternaryArray;
};