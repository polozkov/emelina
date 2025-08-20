//стиль: заливка, обводка, толщина обводки
G.F_SVG_STYLE = function (color_fill = "none", color_stroke = "#000", width_stroke = 1.0) {
    this.color_fill = color_fill;
    this.color_stroke = color_stroke;
    this.width_stroke = width_stroke;
};

//копия стиля
G.F_SVG_STYLE.prototype.f_get_copy = function() {
    return new G.F_SVG_STYLE(this.color_fill, this.color_stroke, this.width_stroke);
};

//стиль трансформируй в строку (скругления на сочленениях круглыю)
G.F_SVG_STYLE.prototype.f_get_string_style = function(is_line_join_round = true) {
    var str_color_fill = 'fill="' + this.color_fill + '"';
    var str_color_stroke = 'stroke="' + this.color_stroke + '"';
    var str_width_stroke = 'stroke-width="' + this.width_stroke + '"';
    var str_line_join = is_line_join_round ? ' stroke-linejoin="round"' : "";
    return str_color_fill + ' ' + str_color_stroke + ' ' + str_width_stroke + str_line_join;
};