//можно ли сделать поворот квадрата со стороной 2 относительно точки (0,0), чтобы другой квадрат не мешал?
G.AI.ROTATE = {};

//повороты точки {x,y} на нужный угол
G.AI.ROTATE.f_rot_90 = function(p) {return ({x: -p.y, y: p.x}); };
G.AI.ROTATE.f_rot_180 = function(p) {return ({x: -p.x, y: -p.y}); };
G.AI.ROTATE.f_rot_270 = function(p) {return ({x: p.y, y: -p.x}); };
//обмен координат x,y -> y,x
G.AI.ROTATE.f_swap_xy = function(p) {return ({x: p.y, y: p.x}); };

//14*14 = 196 дальше, чем на 7 квадратов повороты не рассматривай
//элемент матрицы - четыре флага +90,+180,-90,-180: (если ли блокировка хода? 0..1)
G.AI.ROTATE.m_196_196 = [];

//верни, где находится точка: +1 снаружи, 0 на окружности, -1 внутри окружности
G.AI.ROTATE.f_sign_inside_circle = function(point, circle) {
    var square_r = circle.x * circle.x + circle.y * circle.y;
    var square_point = point.x * point.x + point.y * point.y;
    return Math.sign(square_point - square_r);
};

//Есть прямая от точек (0,0) и (line_x,line_y)  и данная точка (point_x,point_y)
//верни, где находится точка: выше, на прямой или ниже (-1,0,+1)
G.AI.ROTATE.f_sign_above_line = function(point, line) {
    if ((point.y * line.x) === (line.y * point.x)) {return 0;}
    
    var line_tangens = 1.0 * line.y / line.x;
    var intersect_coord_y = point.x * line_tangens;
    return ((point.y > intersect_coord_y) ? 1 : -1);
};

//проверь, что две точки равны
G.AI.ROTATE.f_is_eq = function (a, b) {return ((a.x === b.x) && (a.y === b.y));};

//два положительных нечётных числа (координаты центра квадрата 2*2 на плоскости) поверни на 90 градусов
//верни: "блокируется" движущийся (активный) квадрат данной клеткой по ходу пути
G.AI.ROTATE.f_is_block_when_90 = function(start, on_track) {
    var finish = G.AI.ROTATE.f_rot_90(start);
    //отдельно рассмотри случаи, когда точка в начале или в конце
    //начало никак не блокирует. Истинно помешать может лишь конечная точка
    if (G.AI.ROTATE.f_is_eq(on_track, start)) {return false;}
    if (G.AI.ROTATE.f_is_eq(on_track, finish)) {return true;}

    //блокировки нет, если точка (on_track) ниже угла (start, origin_0_0, finish)
    if (G.AI.ROTATE.f_sign_above_line(on_track, start) <= 0) {return false;}
    if (G.AI.ROTATE.f_sign_above_line(on_track, finish) <= 0) {return false;}
    
    //дана точка (центра квадрата) - верни угол квадрата (f_i - внутренний, f_out - внешний)
    function f_in(p) {return ({x: p.x - Math.sign(p.x), y: p.y - Math.sign(p.y)}); };
    function f_out(p){return ({x: p.x + Math.sign(p.x), y: p.y + Math.sign(p.y)}); };

    //если минимальный угол проверяемого квадратика снаружи (или на границе внешней окружности), то нет блокировки
    if (G.AI.ROTATE.f_sign_inside_circle(f_in(on_track), f_out(start)) >= 0) {return false;}

    //если максимальный угол проверяемого квадратика внутри (или на границе внутреннности окружности), то нет блокировки
    if (G.AI.ROTATE.f_sign_inside_circle(f_out(on_track), f_in(start)) <= 0) {return false;}

    return true;
};

//два раза проверь, что поворот на 90 G.AI.ROTATE.f_is_block_when_90 не блокирует
G.AI.ROTATE.f_is_block_when_180 = function(start, on_track) {
    //начало не блокиреут, поворот на 90 в стандартном направлении блокирует, как и на 180 градусов
    if (G.AI.ROTATE.f_is_eq(on_track, start)) {return false;}
    if (G.AI.ROTATE.f_is_eq(on_track, G.AI.ROTATE.f_rot_90(start))) {return true;}
    if (G.AI.ROTATE.f_is_eq(on_track, G.AI.ROTATE.f_rot_180(start))) {return true;}
    
    //если блокируует в первых 90 градусах, то дальше не рассматривай
    if (G.AI.ROTATE.f_is_block_when_90(start, on_track)) {return true;}
    //чтобы проверить вторые 90 градусов, поверни на анти-девяносто (-90 = 270)
    return G.AI.ROTATE.f_is_block_when_90(G.AI.ROTATE.f_rot_270(start), G.AI.ROTATE.f_rot_270(on_track)); 
};

//старт в первой четверти (обе координаты, как и всегда, - нечётны)
G.AI.ROTATE.f_is_block_90_180 = function(start, on_track, degree_step_90 = 1) {
    if (degree_step_90 === 1) {return G.AI.ROTATE.f_is_block_when_90(start, on_track);}
    if (degree_step_90 === 2) {return G.AI.ROTATE.f_is_block_when_180(start, on_track);}
};

//+1 +2 -1 -2 => +1 +2, а при отрицательных направлениях обменяй координаты х,у
G.AI.ROTATE.f_is_block_any_angle = function(start, on_track, degree_step_90 = 1) {
    var swap_start = (degree_step_90 > 0) ? start : G.AI.ROTATE.f_swap_xy(start);
    var swap_on_track = (degree_step_90 > 0) ? on_track : G.AI.ROTATE.f_swap_xy(on_track);
    return G.AI.ROTATE.f_is_block_90_180(swap_start, swap_on_track, Math.abs(degree_step_90));
};

G.AI.ROTATE.f_is_block_slow = function(start, on_track, degree_step_90 = 1) {
    var copy_start = ({x: start.x, y: start.y});
    var copy_on_track = ({x: on_track.x, y: on_track.y});

    //прверни точки, чтобы старт оказался в первой четверти (обе координаты положительные)
    for (let i1234 = 1; i1234 <= 4; i1234++) {
        if ((copy_start.x > 0) && (copy_start.y > 0)) 
            {return G.AI.ROTATE.f_is_block_any_angle(copy_start, copy_on_track, degree_step_90);}
        copy_start = G.AI.ROTATE.f_rot_90(copy_start);
        copy_on_track = G.AI.ROTATE.f_rot_90(copy_on_track);
    }  
};

G.AI.ROTATE.f_196_to_obj_xy = function (n) {var x=n%14; var y = (n-x)/14; return ({x:x*2-13, y:y*2-13}); };
//пара целых чисел -13..+13 с шагом 2 => в индекс от 0..195 
G.AI.ROTATE.f_nx_ny_to_196 = function (nx, ny) {return ((nx+13)/2) + (ny+13)*7; };

//создай срёхмерный массив
G.AI.f_create_3d_array = function(index_0 = 196, index_1 = 196, index_2 = 4, start_value = -1) {
    return new Array(index_0).fill().map(
      () => new Array(index_1).fill().map(
        () => new Array(index_2).fill(start_value)));};

(function f_set_m_196() {
    var arr_deg = [1, 2, -1, -2];
    G.AI.ROTATE.m_196_196 = G.AI.f_create_3d_array();

    for (let ia = 0; ia < 196; ia++)
        for (let ib = 0; ib < 196; ib++)
            for (let i4 = 0; i4 < 4; i4++) {
                let ia_obj = G.AI.ROTATE.f_196_to_obj_xy(ia);
                let ib_obj = G.AI.ROTATE.f_196_to_obj_xy(ib);
                let i4_deg = arr_deg[i4];
                let flag = G.AI.ROTATE.f_is_block_slow(ia_obj, ib_obj, i4_deg);
                //заполни это значение массива: можно ли поворачивать или нельзя
                G.AI.ROTATE.m_196_196[ia][ib][i4] = flag ? 1 : 0;
        }

}());

G.AI.ROTATE.f_is_block_turbo = function(start_x, start_y, on_track_x, on_track_y, degree_step_03_p1_p2_m1_m2 = 0) {

    var start_196 = G.AI.ROTATE.f_nx_ny_to_196(start_x, start_y);
    var on_track_196 = G.AI.ROTATE.f_nx_ny_to_196(on_track_x, on_track_y);
    return G.AI.ROTATE.m_196_196[start_196][on_track_196][degree_step_03_p1_p2_m1_m2];
};