G.SVG.EL = document.getElementById("id_main_svg");


//клетка номер i (левая сверху клетка имеет номер 0), - на сетке из nx*ny прямоугольников
G.SVG.f_area_i_nx_ny = function (i = 0, nx = G.CONST.GRID_SHOW_NX, ny = G.CONST.GRID_SHOW_NY) {
    let ix = i % nx;
    let iy = (i - ix) / nx;
    let step_x = 100 / nx;
    let step_y = 100 / ny;
    let my_min = new G.F_XYZ(ix * step_x, iy * step_y);
    let my_max = my_min.f_op_add_x_y_z(step_x, step_y);

    let cell_area = new G.F_MIN_MAX(my_min, my_max);
    return cell_area.f_press_ratio(0.9);
};

G.SVG.f_area_i_move_rect = function (i_move) {
    let nx = i_move % (G.CONST.GRID_SHOW_HALF_NX);
    let ny = (i_move - nx) / (G.CONST.GRID_SHOW_HALF_NX);
    let step_x = 100 / G.CONST.GRID_SHOW_HALF_NX;
    let step_y = 100 / G.CONST.GRID_SHOW_NY;

    let a = new G.F_XYZ(nx * step_x, ny * step_y);
    let b = new G.F_XYZ((nx+1) * step_x, (ny+1) * step_y);
    let ab = new G.F_MIN_MAX(a,b);

    let polygon = ab.f_get_polygon_p4();
    let svg = polygon.f_get_svg_polygon(G.CONST.VIEW.GRID_STYLE);

    //debugger
    return svg;
};

G.SVG.f_grid = function () {
    let svg = "";
    let n = G.CONST.GRID_SHOW_HALF_NX * G.CONST.GRID_SHOW_NY;
    for (let i = 0; i < n; i++)
        svg += G.SVG.f_area_i_move_rect(i) + " ";
    return svg;
};

G.SVG.f_draw_arr_myltifold = function (arr_obj) {
    let arr_multifold = arr_obj.arr_multifold;
    let arr_of_arr8_0_1_flags_cubes_selected = arr_obj.arr8_0_1_flags_cubes_selected;
    
    arr_of_arr8_0_1_flags_cubes_selected || (new Array(arr_multifold.length).fill([0,0,0,0, 0,0,0,0]));

    function f_svg_i(i_multifold, i) {
        let min_max = G.SVG.f_area_i_nx_ny(i);
        let i_faces_draw = new G.F_FACES_DRAW(i_multifold.arr_folds);
        let i_svg = i_faces_draw.f_get_final_svg(min_max, arr_of_arr8_0_1_flags_cubes_selected[i]);
        return i_svg;
    };
    let arr_string = arr_multifold.map((i_multifold, i) => f_svg_i(i_multifold, i));
    let joined_string = arr_string.join(" ");

    return joined_string;
};

(function f_test_draw() {
    let my_multifold = G.AI.MULTIFOLD.f_multifold_by_string();
    let arr_obj_multifold_and_flags_active = my_multifold.f_search_cube_2_2_2();

    G.SVG.EL.innerHTML = (G.SVG.f_draw_arr_myltifold(arr_obj_multifold_and_flags_active) + G.SVG.f_grid());

    console.log(G);
}());
