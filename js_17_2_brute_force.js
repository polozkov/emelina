G.AI.BRUTE = {};

//2187
G.AI.BRUTE.POW_3_7 = 3*3*3 * 3 * 3*3*3;

//переведи массив троицных цифр в троичное число
G.AI.BRUTE.f_ternary_to_n = function (ternary_array) {
    let number = 0;
    for (let i = 0; i < ternary_array.length; i++)
        number = number * 3 + ternary_array[i];
    return number;
};

//верни число - характеристику текущей печки (число получается из семи троичных цифр)
G.F_MULTIFOLD.prototype.f_get_n_ternary = function () {return G.AI.BRUTE.f_ternary_to_n(this.f_get_step_fold_array()); };

//является ли конструкция кубом 2на2на2
G.F_MULTIFOLD.prototype.f_check_is_cube_2_2_2 = function () {
    let p8 = this.f_get_centers_of_cubes(); //центры кубов
    //область, которую занимают центры кубов
    let min_max = new G.F_MIN_MAX();
    for (let i = 0; i < 8; i++)
        min_max = min_max.f_add_point(p8[i]);

    //размер по всем трём направлениям = 2 (куб имеет сторону 2, шаг = 1 куб по всем трём осям)
    let sizes = min_max.f_get_sizes();
    return ((sizes.x === 2) && (sizes.y === 2) && (sizes.z === 2));
};

//грубый перебор - волновой алгоритм для всех доступных ходов
G.F_MULTIFOLD.prototype.f_brute_forse_for_all_legal_moves = function () {
    let static_data_128 = this.f_separate_active_data_base_128();

    let start_n_ternary = this.f_get_n_ternary()
    let data_base = new Array(G.AI.BRUTE.POW_3_7).fill(null); //вся база данных неопределена
    //начальная позиция имеет грубину ноль и не имеет родителей
    data_base[start_n_ternary] = ({obj: this, n: start_n_ternary, depth: 0, n_parent: -1});

    //в начале волна состоит из одной позиции (волна - это индекс от глубины и массив по всем позициям)
    //...поэтому волна - это массив массивов
    let wave = [[{obj: this, n: start_n_ternary, depth: 0, n_parent: -1}]];

    //все потомки одной позиции
    function f_children_of_one_parent(wave_element) {
        let next_depth = wave_element.depth + 1;
        let parent_for_children = wave_element.n;
        let arr_moves = wave_element.obj.f_legal_moves(static_data_128);
        return arr_moves.map(move => ({obj: move, n: move.f_get_n_ternary(), depth: next_depth, n_parent: parent_for_children}));
    };

    //все новые потомки фронта волны (для заполнения незаполненных значений базы данных)
    function f_full_wave(wave) {
        //потомки для каждй позиции из фронта волны
        let arr_of_arr = wave.map(move => f_children_of_one_parent(move));
        //потомки всех позиций (уменьшь вложенность на один)
        let flat_array = arr_of_arr.flat(1);
        //фильтруй только те позиции, которые новые
        let new_children = flat_array.filter((el) => (data_base[el.n] === null));
        return new_children;
    };

    //добавь новых детей (фронт волны) - в базу данных
    function f_add_to_date(new_children) {
        for (let child of new_children)
            data_base[child.n] = child;
    };

    //пока длина последней волны имеет положительную (ненулевую) длину
    while (wave.at(-1).length) {
        //следующая волна
        let next_wavefront = f_full_wave(wave.at(-1));
        //только уникальные значения во фронте
        let unique_wavefront = [];

        //флаги для определения, что волна уникальна
        let arr_indexes_bool = new Array(G.AI.BRUTE.POW_3_7).fill(0);
        for (let i_obj of next_wavefront) {
            let n = i_obj.n;
            arr_indexes_bool[n] += 1; //посчитай элемент фронта волны
            if (arr_indexes_bool[n] > 1) {continue; } //повторно не добавляй
            unique_wavefront.push(i_obj); //добавь в уникальный фронт
        }

        //добавь уникальный фронт в основной массив "wave" с волнами
        wave.push(unique_wavefront);
        //добавь уникальный фронт в базу данных
        f_add_to_date(unique_wavefront);
    };

    //верни базу данных
    return data_base;
};

G.F_MULTIFOLD.prototype.f_search_symmetrical = function () {
    //все допустимые ситуации (с индексом родителя и глубиной)
    let unfiltered_data = this.f_brute_forse_for_all_legal_moves();
    let filtered_symmmetry = unfiltered_data.filter(d => (d && d.obj.f_get_polycube().f_is_symmetry()));

    //console.log(filtered_symmmetry.map(d => d.obj.f_get_polycube().f_get_sorted().f_get_divided().f_get_string()));

    return filtered_symmmetry.map(d => d.obj)
};

//ищи кубик 2*2*2
G.F_MULTIFOLD.prototype.f_search_cube_2_2_2 = function () {
    //this.f_search_symmetrical();

    //все допустимые ситуации (с индексом родителя и глубиной)
    let unfiltered_data = this.f_brute_forse_for_all_legal_moves();;

    //убедись, что элемент существует (не равен null) и он действительно куб 2*2*2
    let cubes = unfiltered_data.filter(el => (el && el.obj.f_check_is_cube_2_2_2()));
    if (cubes.length === 0) {debugger; return;}

    //иди по цепочке от куба к его родителям, пра-родителям, пра-пра-родителям ...  и так до начального положения
    let arr_way_of_solving = [cubes[0]];
    //если родттель равен -1, это значит, что родителя нет
    while (arr_way_of_solving.at(-1).n_parent !== (-1)) {
        let next_to_disassembled = unfiltered_data[arr_way_of_solving.at(-1).n_parent];
        arr_way_of_solving.push(next_to_disassembled);
    };
    //от начального до конечного положения
    arr_way_of_solving.reverse();

    //каждый ход имеет два рисунка - начальное и конечное положение печки
    let way_to_cube_2_2_2 = [];
    //какие кубики активные
    let active_cubes = [];
    //строка с процессом решения - текстовые подсказки для каждого хода
    let arr_str_info = [];
    //ia - индекс до предпоследней позиции (в конце - собранный куб)
    function f_add(ia) {
        way_to_cube_2_2_2.push(arr_way_of_solving[ia].obj.f_get_copy());
        way_to_cube_2_2_2.push(arr_way_of_solving[ia+1].obj.f_get_copy());

        //активные кубы (которые перемещаются за текущий ход: из этой позиции в следующую)
        let i_arr_8_active_cubes = way_to_cube_2_2_2.at(-2).f_get_active_cubes_in_move(way_to_cube_2_2_2.at(-1));
        //показывай ход "до" и  "после", (активные кубики одни и те же в обоих случаях)
        active_cubes.push(i_arr_8_active_cubes.slice(), i_arr_8_active_cubes.slice());

        //строка с процессом решения - текстоваф подсказка для текущего хода
        arr_str_info.push(way_to_cube_2_2_2.at(-2).f_comment_move(way_to_cube_2_2_2.at(-1)));
    };

    //какую строчку добавить в подсказки
    function f_str_arr_to_str_html(str_arr = arr_str_info) {
        let s = "";
        for (let i = 0; i < str_arr.length; i++) {
            //после G.CONST.GRID_SHOW_HALF_NX числа ходов - перейди на новую строчку
            let is_enter = ((i+1) % G.CONST.GRID_SHOW_HALF_NX);
            s += str_arr[i] + (is_enter ? "" : "<br>");
        };
        return s;
    };

    //добавь ходы из всех позиций (кроме кубика 2*2*2 - кубик конец)
    for (let i = 0; i < arr_way_of_solving.length - 1; i++)
        f_add(i);
    G.EL.text_info_result.innerHTML = f_str_arr_to_str_html();

    return ({arr_multifold: way_to_cube_2_2_2, arr8_0_1_flags_cubes_selected: active_cubes});
};