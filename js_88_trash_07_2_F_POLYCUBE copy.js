//массив центров кубов (кубы единичные, начинаются точки 0,0,0);
G.F_POLYCUBE = function (arr_centers) { this.arr_centers = arr_centers; };
//минимальные xyz - границы в поликубе
G.F_POLYCUBE.prototype.f_get_min = function () {var min = G.F_NNN(Infinity); for (let p of this.arr_centers) min = min.f_op_min(p); return min;};
//максимальные xyz - границы в поликубе
G.F_POLYCUBE.prototype.f_get_max = function () {var max = G.F_NNN(-Infinity); for (let p of this.arr_centers) max = max.f_op_min(p); return max;};
//минимальная и максимальная xyz - границы
G.F_POLYCUBE.prototype.f_get_min_max = function () {return new G.F_MIN_MAX(this.f_get_min(), this.f_get_max());};
//поликуб, сдвинутый к границам (0,0,0)
G.F_POLYCUBE.prototype.f_get_on_zero = function () {return new G.F_POLYCUBE(this.arr_centers.map(c => c.f_op_subtract(this.f_get_min())));};
//отсортируй кубики по возрастанию (главный критерий - z-координата, потом - y, потом - x)
G.F_POLYCUBE.prototype.f_get_sorted = function () {return new G.F_POLYCUBE(this.arr_centers.toSorted((a, b) => a.f_op_compare(b)));};
//сдвинь к нулям и отсортируй
G.F_POLYCUBE.prototype.f_get_zero_and_sorted = function () { return this.f_get_on_zero().f_get_sorted();};
G.F_POLYCUBE.prototype.f_get_copy_centers = function () {return this.arr_centers.map(v => v.f_get_copy());};
G.F_POLYCUBE.prototype.f_get_copy = function () { return new G.F_POLYCUBE(this.f_get_copy_centers());};

//сравни два куба, которые сдвинуты к нулю и отсортированы
G.F_POLYCUBE.prototype.f_is_equal = function (b_cube_on_zero) {
    for (let i = 0; i < this.arr_centers.length; i++)
        if (this.arr_centers[i].f_is_unequal(b_cube_on_zero.arr_centers[i]))
            return false;
    return true;
};

//сравни два куба, которые сдвинуты к нулю и отсортированы
G.F_POLYCUBE.prototype.f_op_compare = function (b_cube_on_zero) {
    for (let i = 0; i < this.arr_centers.length; i++) {
        let n = this.arr_centers[i].f_op_compare(b_cube_on_zero.arr_centers[i]);
        if (n) { return Math.sign(n); }
    }
    return 0;
};

//вкрючает ли поликуб данный куб?
G.F_POLYCUBE.prototype.f_is_includes = function (xyz) {for (let p of this.arr_centers) if (p.f_is_equal(xyz)) return true; return false;};

//из отсортированного поликуба удали кубики-дубликаты
G.F_POLYCUBE.prototype.f_get_delete_cells_dublicates = function () {
    let arr_result = [this.arr_centers[0].f_get_copy()];
    for (let i = 1; i < this.arr_centers.length; i++)
        if (this.arr_centers[i].f_is_unequal(arr_result.at(-1)))
            arr_result.push(this.arr_centers[i].f_get_copy());
    return arr_result;
};
//все контакты по маске, маска - это массив xyz
G.F_POLYCUBE.prototype.f_arr_contacts = function (mask) {
    function f_arr_contacts_of_cell(cell) { return mask.map(p => p.f_op_add(cell)); };
    let arr_arr_contacts = this.arr_centers.map(cell => f_arr_contacts_of_cell(cell));
    let arr_new_centers = arr_arr_contacts.flat(1);
    let arr_filtered = arr_new_centers.filter(cell => (!this.f_is_includes(cell)));
    let arr_unique = new G.F_POLYCUBE(arr_filtered).f_get_delete_cells_dublicates();
    return arr_unique;
};
G.F_POLYCUBE.prototype.f_child_by_adding_cell = function (cell_xyz) {
   return new G.F_POLYCUBE([...this.f_get_copy_centers(), cell_xyz.f_get_copy()]);
};

G.F_POLYCUBE.prototype.f_arr_all_children = function (mask) {
    let arr_contacts = this.f_arr_contacts(mask);
    return arr_contacts.map(cell_xyz => this.f_child_by_adding_cell(cell_xyz));
};

//поверни весь поликуб
G.F_POLYCUBE.prototype.f_mult_m33 = function(m33) {return new G.F_POLYCUBE(this.arr_centers.map(v => v.f_op_mult_m33(m33))); };

G.F_POLYCUBE.prototype.f_all_24_or_48_unsorted = function (arr_m33) {
    let arr_mult_cubes = arr_m33.map(m => this.f_mult_m33(m));
    let arr_cubes = arr_mult_cubes.map(cube => cube.f_get_zero_and_sorted());
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

G.F_POLYCUBE.prototype.f_all_24_or_48_unique = function (arr_m33) {
    let arr_order = this.f_all_24_or_48_unsorted(arr_m33).toSorted((a,b) => a.f_op_compare(b));
    return G.F_POLYCUBE.f_only_unique(arr_order);
};

G.F_POLYCUBE.prototype.f_is_symmetry_48 = function () {
    return (this.f_all_24_or_48_unique(G.F_M33.arr_24_m33).length > 1);
};


//-----------------------------
(function f_calc_polyforms(depth, mask) {
    return;
    //console.log(mask);
    let mono_cube = new G.F_POLYCUBE([G.F_NNN(0)]);
    let data_base = [[], [mono_cube]];

    function f_next_generation(step_data_base = data_base[0]) {
        //debugger
        let arr_polycubes = step_data_base.map(polycube => polycube.f_arr_all_children(mask)).flat(1);
        let arr_on_zero = arr_polycubes.map(polycube => polycube.f_get_zero_and_sorted());
        let arr_min_48 = arr_on_zero.map(polycube => polycube.f_min_24_or_48(G.F_M33.arr_48_m33));
        let arr_order = arr_min_48.toSorted((a,b) => a.f_op_compare(b));
        return G.F_POLYCUBE.f_only_unique(arr_order);
    }

    for (let i = 2; i <= depth; i++)
        data_base.push(f_next_generation(data_base.at(-1)));

    let final_step = data_base.at(-1).filter(polycybe => polycybe.f_is_symmetry_48());

    console.log(data_base);
    console.log(final_step);

})(8, G.CONST.arr_contacts_6);


(function f_test_polycubes() {
    G.CONST.f_convert_code_to_polycube = function (str, mult) {
        let arr_012 = G.CONST.f_convert_code_to_012_array(str, mult);
        let arr_centers = arr_012.map(xyz => new G.F_XYZ(...xyz));
        return new G.F_POLYCUBE(arr_centers);
    }

    let domino_x = G.CONST.f_convert_code_to_polycube("01", 1).f_get_zero_and_sorted();
    let domino_y = G.CONST.f_convert_code_to_polycube("0,0", 1).f_get_zero_and_sorted();
    let domino_min_x = domino_x.f_min_24_or_48(G.F_M33.arr_48_m33);
    let domino_min_y = domino_y.f_min_24_or_48(G.F_M33.arr_48_m33);
    console.log(domino_min_x.arr_centers, domino_min_y.arr_centers);
    
    return;
    //1^2 + 1^2 + 0^2 = 2, контакт по ребру
    function f_arr_mask_of_contacts(len_2 = 2) {
        let arr_result = [];
        for (let iz of [-1, 0, 1]) for (let iy of [-1, 0, 1]) for (let ix of [-1, 0, 1]) {
            let p = new G.F_XYZ(ix, iy, iz);
            if (p.f_get_len2() === len_2)
                arr_result.push(p.f_get_copy());
        };
        return arr_result;
    };


    let cube_test =  G.CONST.f_convert_code_to_polycube("01,0;1", 1).f_get_zero_and_sorted();
    console.log(cube_test.f_min_24_or_48(G.F_M33.arr_24_m33));
})();