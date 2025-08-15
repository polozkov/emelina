//середины всех семи рёбер (петель, соединяющих кубики)
G.F_MULTIFOLD.prototype.f_get_mid_edges = function () { return this.arr_folds.map(obj => obj.min_fold.mid_edge); };

G.AI.MOVE = {};

//верни те места, на которых стоят единицы (в двоичной записи числа n) ПРИМЕР 13 -> 1+4+8 -> [0,2,3]
G.AI.MOVE.f_n_to_arr_bits = function (n) {
    let positions = [], current_index = 0;
    while (n > 0) {
        if (n & 1) { positions.push(current_index); }
        n = n >> 1;
        current_index++;
    }
    return positions;
};

G.AI.MOVE.f_non_empty_subsets = function (arr_set = [1, 2, 4]) {
    let my_result = [], n = arr_set.length, n_pow_2 = Math.pow(2, n);
    //всего подмножеств 2^n, исключаем пустое
    for (let i = 1; i < n_pow_2; i++) {
        let subset = [];
        // Проверяем каждый бит числа 
        for (let j = 0; j < n; j++) {
            // Если j-й бит i равен 1, включаем j-й элемент в подмножество
            if (i & (1 << j)) { subset.push(arr_set[j]); }
        }
        my_result.push(subset);
    }
    return my_result;
};

G.AI.MOVE.f_is_centers_of_cube_are_unique = function (arr_obj_xyz) {
    let A = arr_obj_xyz.map(obj => obj.f_get_array_012());
    for (let i = 0; i < 7; i++)
        for (let j = i + 1; j <= 0; j++)
            if ((A[i][0] === A[j][0]) && (A[i][1] === A[j][1]) && (A[i][2] === A[j][2])) { return false; }
    return true;
};

//делит все петли на группы (которые лежат на одной прямой)
G.F_MULTIFOLD.prototype.f_get_axis_sets = function () {
    let arr_mid_edges = this.f_get_mid_edges();
    //сначала ни одно ребро не входит ни в одну прямую
    let arr_06_flags = [-1, -1, -1, -1, -1, -1, -1];
    //группа - это прямая, на которой лежит одна или более петля
    let n_group = 0;

    //переходи к новой группе (следующей прямой) - только если ребро не вошло ни в одну другую прямую
    for (let i = 0; i <= 6; i++, n_group += ((arr_06_flags[i] === (-1)) ? 1 : 0))
        if (arr_06_flags[i] === (-1)) //прямая не занята
            for (let j = i; j <= 6; j++) //проведи прямую, нанизывая на неё все незанятые петли
                if (arr_06_flags[j] === (-1)) //петля свободна
                    //петля на той же оси, что и текущая прямая (n_group - номер прямой, начиная с 0)
                    if (arr_mid_edges[i].f_is_on_one_axe(arr_mid_edges[j])) {
                        arr_06_flags[j] = n_group;
                    }

    //количество группп = максимальный номер прямой + 1 (так как нумерация с нуля)
    let group_amount = Math.max(...arr_06_flags) + 1;
    let arr_groups = new Array(group_amount).fill().map(_ => []);

    for (let i = 0; i <= 6; i++)
        arr_groups[arr_06_flags[i]].push(i);

    let arr_subsets = arr_groups.map(edges_group => G.AI.MOVE.f_non_empty_subsets(edges_group));
    //группы, на которые разбиваются оси, нас не интересуют
    let arr_of_edges_on_one_line = [].concat(...arr_subsets);

    let f_to_result = arr_edges => ({
        n128: G.AI.TREE.f_arr_to_n128(arr_edges),
        line: arr_mid_edges[arr_edges[0]].f_get_copy()
    });
    let arr_of_128 = arr_of_edges_on_one_line.map(arr_edges => f_to_result(arr_edges));

    return arr_of_128;
};

//G.AI.ROTATE.f_is_block_turbo = function(start_x, start_y, on_track_x, on_track_y, p1_p2_m1_m2 = 0)
G.AI.f_is_legal_move = function (line_xyz, get_data_i, p1_p2_m1_m2, centers_of_cubes) {
    var arr_all_centers = centers_of_cubes.map(point => point.f_op_subtract(line_xyz));
    //Letters - буквы для превращения 3д в 2д
    //например: ["y","z","x"]
    var L = line_xyz.f_get_unique_three_letters();
    //рассматривай плоскость (первые две координаты, а третья координата должна совпадать)
    var arr_xy = arr_all_centers.map(p => [p[L[0]], p[L[1]], p[L[2]]]);

    for (let i_active of get_data_i.arr8_active) {
        for (let i_passive of get_data_i.arr8_passive) {
            let P_ACTIVE = arr_xy[i_active];
            let P_PASSIVE = arr_xy[i_passive];

            //на разных слоях
            if (P_ACTIVE[2] !== P_PASSIVE[2]) {
                continue;
            }

            //на одном слое и блокируется
            if (G.AI.ROTATE.f_is_block_turbo(P_ACTIVE[0], P_ACTIVE[1], P_PASSIVE[0], P_PASSIVE[1], p1_p2_m1_m2)) {
                return false;
            }
        }
    }

    return true;
};

G.F_MULTIFOLD.prototype.f_legal_moves = function (get_data_128) {
    //для ускорения работы - заранее просчитай базу данных (для ходов)
    var data_128 = get_data_128 || this.f_separate_active_data_base_128();

    var arr_legal_moves = [];
    //возможности, как делятся оси (важно, если они совпадают)
    var axis_sets = this.f_get_axis_sets();
    var arr_centers_cubes = this.f_get_centers_of_cubes();

    for (let i_axis of axis_sets) {
        for (let i03 = 0; i03 <= 3; i03++) {
            if (G.AI.f_is_legal_move(i_axis.line, data_128[i_axis.n128], i03, arr_centers_cubes)) {
                let i_child = this.f_get_copy();
                //делай ход
                for (let i_active of data_128[i_axis.n128].arr14_active) {
                    let [n7, str] = G.CONST.arr_14_as_7_2[i_active];
                    let deg_rot = G.CONST.DEG_P1_P2_M1_M2[i03];
                    i_child.arr_folds[n7][str] = i_child.arr_folds[n7][str].f_op_rotate_mid_edge_90_180_270(deg_rot, i_axis.line);
                }
                arr_legal_moves.push(i_child);
            }
        }
    }

    return arr_legal_moves;
};

