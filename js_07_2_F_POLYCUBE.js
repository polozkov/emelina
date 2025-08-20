//массив центров кубов (кубы единичные, начинаются точки 0,0,0);
G.F_POLYCUBE = function (arr_centers) { this.arr_centers = arr_centers; };
//минимальные xyz - границы в поликубе
G.F_POLYCUBE.prototype.f_get_min = function () {var min = G.F_NNN(Infinity); for (let p of this.arr_centers) min = min.f_op_min(p); return min;};
//максимальные xyz - границы в поликубе
G.F_POLYCUBE.prototype.f_get_max = function () {var max = G.F_NNN(-Infinity); for (let p of this.arr_centers) max = max.f_op_max(p); return max;};
//середина ограничевающего бокса-контейнера
G.F_POLYCUBE.prototype.f_get_000 = function () {return this.f_get_min().f_op_center(this.f_get_max());};

//куб в 0,0,0
G.F_POLYCUBE.prototype.f_get_to_min = function () {return new G.F_POLYCUBE(this.arr_centers.map(c => c.f_op_subtract(this.f_get_min())));};

//центрируй куб
G.F_POLYCUBE.prototype.f_get_to_mid = function () {return new G.F_POLYCUBE(this.arr_centers.map(c => c.f_op_subtract(this.f_get_000())));};
//отсортируй кубики по возрастанию (главный критерий - z-координата, потом - y, потом - x)
G.F_POLYCUBE.prototype.f_get_sorted = function () {return new G.F_POLYCUBE(this.arr_centers.toSorted((a, b) => a.f_op_compare(b)));};
G.F_POLYCUBE.prototype.f_get_to_mid_and_sorted = function () {return this.f_get_to_mid().f_get_sorted(); };
G.F_POLYCUBE.prototype.f_get_divided = function (n = 2) {return new G.F_POLYCUBE(this.arr_centers.map(c => c.f_n_divide(n)));};
G.F_POLYCUBE.prototype.f_get_string = function () {return this.arr_centers.map(v => (v.x+""+v.y+""+v.z)).join("_");} ;

G.F_POLYCUBE.prototype.f_get_copy_centers = function () {return this.arr_centers.map(v => v.f_get_copy());};
G.F_POLYCUBE.prototype.f_get_copy = function () { return new G.F_POLYCUBE(this.f_get_copy_centers());};


//сравни два куба
G.F_POLYCUBE.prototype.f_is_equal = function (b_cube) {
    let my_a = this.f_get_to_mid_and_sorted();
    let my_b = b_cube.f_get_to_mid_and_sorted();
    for (let i = 0; i < my_a.arr_centers.length; i++)
        if (my_a.arr_centers[i].f_is_unequal(my_b.arr_centers[i]))
            return false;
    return true;
};

//поверни весь поликуб
G.F_POLYCUBE.prototype.f_mult_m33 = function(m33) {return new G.F_POLYCUBE(this.arr_centers.map(v => v.f_op_mult_m33(m33))); };

G.F_POLYCUBE.prototype.f_get_new_cubes_m33 = function () {
    let my_to_mid = this.f_get_to_mid_and_sorted()
    let sizes_50 = my_to_mid.f_get_max().f_op_add_x_y_z(1,1,1);
    let arr_m33 = G.F_M33.arr_m33_by_sizes[sizes_50.x + "_" + sizes_50.y + "_" + sizes_50.z];
    let new_cubes = arr_m33.map(m33 => my_to_mid.f_mult_m33(m33).f_get_sorted());
    return new_cubes;
};

G.F_POLYCUBE.prototype.f_get_order_dimentions_cube = function () {
    let my_to_mid = this.f_get_to_mid_and_sorted()
    let sizes_50 = my_to_mid.f_get_max().f_op_add_x_y_z(1,1,1);
    let m33 = G.F_M33.arr_m33_by_x_big[sizes_50.x + "_" + sizes_50.y + "_" + sizes_50.z][0];
    return my_to_mid.f_mult_m33(m33);
};

G.F_POLYCUBE.prototype.f_is_symmetry = function() {
    let new_cubes = this.f_get_new_cubes_m33();
    for (let i = 1; i < new_cubes.length; i++)
        if (new_cubes[0].f_is_equal(new_cubes[i]))
            return true;
    return false;
};

G.F_POLYCUBE.prototype.f_get_amount_of_symmetry = function() {
    let new_cubes = this.f_get_new_cubes_m33(); let n_symmetry = 1;
    for (let i = 1; i < new_cubes.length; i++)
        if (new_cubes[0].f_is_equal(new_cubes[i]))
            n_symmetry += 1;
    return n_symmetry;
};

G.F_POLYCUBE.f_convert_from_code = function (str = "01,1;0", mult = 2) {
    let arr_012 = G.CONST.f_convert_code_to_012_array(str, mult);
    let arr_centers = arr_012.map(xyz => new G.F_XYZ(...xyz));
    return new G.F_POLYCUBE(arr_centers).f_get_to_mid_and_sorted();
};

//-------------------------------------------

//сравни два куба, которые сдвинуты к нулю и отсортированы
G.F_POLYCUBE.prototype.f_op_compare = function (b_cube_on_zero) {
    for (let i = 0; i < this.arr_centers.length; i++) {
        let n = this.arr_centers[i].f_op_compare(b_cube_on_zero.arr_centers[i]);
        if (n) { return Math.sign(n); }
    }
    return 0;
};

G.F_POLYCUBE.prototype.f_all_24_or_48_unsorted = function (arr_m33) {
    let arr_mult_cubes = arr_m33.map(m => this.f_mult_m33(m));
    let arr_cubes = arr_mult_cubes.map(cube => cube.f_get_to_mid_and_sorted());
    return arr_cubes;
};

G.F_POLYCUBE.prototype.f_min_24_or_48 = function (arr_m33) {
    let arr_unsorted = this.f_all_24_or_48_unsorted(arr_m33);
    let min_cube = arr_unsorted[0];
    for (let i = 1; i < arr_unsorted.length; i++)
        if (min_cube.f_op_compare(arr_unsorted[i]) > 0)
            min_cube = arr_unsorted[i];
    return min_cube.f_get_copy();
};

G.F_POLYCUBE.f_only_unique = function (arr_order) {
    let arr_unique = [arr_order[0]];
    for (let i = 1; i < arr_order.length; i++)
        if (!arr_order[i].f_is_equal(arr_unique.at(-1)))
            arr_unique.push(arr_order[i]);
    return arr_unique;
};

G.F_POLYCUBE.prototype.f_get_final_svg_cubes = function (min_max_in_100) {
    //console.log(CUBES_I);
    //debugger
    let arr_8_cubes = this.f_get_to_mid().f_get_order_dimentions_cube();
    let sizes = arr_8_cubes.f_get_max().f_op_add_x_y_z(1, 1, 1);
    let CUBES = arr_8_cubes.f_get_divided().f_get_to_min();
    let CUBES_I = CUBES.arr_centers.map((v, i) => ({ v: v, i: i }));
    CUBES_I.sort((a, b) => (a.v.z - b.v.z));

    function f_draw_rect(center, i_cube) {
        let WH = min_max_in_100.f_get_sizes();
        let step_x = WH.x / sizes.x;
        let step_y = WH.y / sizes.y;

        let xy_center = min_max_in_100.min.f_op_add_x_y_z(step_x * (center.x + 0.5), step_y * (center.y + 0.5));

        let arr_ratio = new Array(sizes.z).fill(0).map((n, i) => ((sizes.z - i) / sizes.z));
        let ratio = arr_ratio[center.z];

        let wh = new G.F_XYZ(ratio * step_x, ratio * step_y);
        let xy = xy_center.f_op_add_x_y_z(wh.x * -0.5, wh.y * -0.5);

        let fill = G.CONST.RGB.arr_8_cubes[i_cube];
        let svg = `<rect x="${xy.x}" y="${xy.y}" width="${wh.x}" height="${wh.y}" fill="${fill}" stroke="black" stroke-width="0.2" />`;

        return svg;
    };
    let svg_final = "";
    for (let i = 0; i < CUBES_I.length; i++)
        svg_final += f_draw_rect(CUBES_I[i].v, CUBES_I[i].i);

    return svg_final;
};




//console.log(G.F_POLYCUBE.f_convert_from_code().f_get_amount_of_symmetry());