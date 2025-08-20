//Емелина печка - это дерево рубиков (8 кубиков и 7 петель)
G.AI.TREE = {};

//рекурсивно ищи путь в дереве (на входе именно дерево) между двумя вершинами (путь точно есть и он один)
G.AI.TREE.f_search_unique_path_in_tree = function (arr_adjacency, vertex_start, vertex_final) {
    if (vertex_start === vertex_final) {return [vertex_start];};
    
    let arr_visited = new Array(8).fill(false);
    let arr_path = [];
        
    // Рекурсивная функция DFS
    function dfs(vertex_current, vertex_target, path_current) {
        arr_visited[vertex_current] = true;
        path_current.push(vertex_current);
            
        // Если достигли целевой вершины
        if (vertex_current === vertex_target) {return true;}
            
        // Перебираем всех соседей
        for (let i_neighbor of arr_adjacency[vertex_current]) {
            if (!arr_visited[i_neighbor]) {
                if (dfs(i_neighbor, vertex_target, path_current)) {
                        return true;
        }}}
            
        // Если путь не найден, удаляем текущую вершину из пути
        path_current.pop();
        return false;
    }
        
    // Запускаем поиск
    if (dfs(vertex_start, vertex_final, arr_path)) {return arr_path; }
};

//У Емелиной печки 7 петель (и на графе с 8 кубиками - 7 рёбер)
G.AI.TREE.f_arr_to_n128 = function (arr_06) {return arr_06.reduce((acc, n) => acc + (1 << n), 0); };
G.AI.TREE.f_n128_to_arr = function(n128) {return [0,1,2,3,4,5,6].filter(n => (1 << n)&n128); };
G.AI.TREE.f_n128_to_arr_true_false = function(n128) {return [0,1,2,3,4,5,6].map(n => ((1 << n)&n128) ? true : false); };

//у Емелиной печки 14 полупетель
G.AI.TREE.f_arr_to_bin14 = function (arr_14) {return arr_14.reduce((acc, n) => acc + (1 << n), 0); };
G.AI.TREE.f_bin14_to_arr = function(n_b14) {           return [0,1,2,3,4,5,6,7,8,9,10,11,12,13].filter(n => (1 << n)&n_b14); };//
G.AI.TREE.f_bin14_to_arr_true_false = function(n_b14) {return [0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(n => ((1 << n)&n_b14) ? true : false); };

//у Емелиной печки 8 кубиков
G.AI.TREE.f_arr_to_bin8 = function (arr_8) {return arr_8.reduce((acc, n) => acc + (1 << n), 0); };
G.AI.TREE.f_bin8_to_arr = function(n_b8) {return            [0,1,2,3,4,5,6,7].filter(n => (1 << n)&n_b8); };
G.AI.TREE.f_bin8_to_arr_true_false = function(n_b8) {return [0,1,2,3,4,5,6,7].map(n => ((1 << n)&n_b8) ? true : false); };
G.AI.TREE.f_bool8_filter_true = function(bool_8) {return    [0,1,2,3,4,5,6,7].filter(n => bool_8[n]); };
G.AI.TREE.f_bool8_filter_false = function(bool_8) {return   [0,1,2,3,4,5,6,7].filter(n => !bool_8[n]); };

//дана матрица с РАЗДЕЛЯЮЩИМИ рёбрами (то есть петлями), сколько раз путь пересекал РАЗДЕЛЯЮЩИЕ рёбра
G.AI.TREE.f_n_times_separate = function (my_path, my_m) {
    var n_times_separate = 0;
    for (let i = 1; i < my_path.length; i++) {
        let a = my_path[i-1];
        let b = my_path[i]
        n_times_separate += my_m[a][b];
    }
    return n_times_separate;
};

//раздели все 8 кубиков на статичные и "подвижные"
//известны все пути от ОСНОВНОГО кубика до всех остальных
G.AI.TREE.f_select_by_path_and_matrix_of_swap = function(arr_pathes, matrix) {
    //в таблице - разделяющие рёбра-петли
    let arr_times_separate = [0,1,2,3,4,5,6,7].map(n => G.AI.TREE.f_n_times_separate(arr_pathes[n], matrix));
    return arr_times_separate;
};