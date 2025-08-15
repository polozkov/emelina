G.DRAW.F_STYLE.prototype.f_get_style_stroke = function () {
  return 'stroke="' + this.stroke + '" ' + 'stroke-width="' + this.stroke_width + '"';
};

G.DRAW.F_STYLE.prototype.f_get_style_stroke_fill = function () {
  return 'fill="' + this.fill + '" ' + 'stroke="' + this.stroke + '" ' + 'stroke-width="' + this.stroke_width + '"';
};

G.DRAW.F_STYLE.prototype.f_op_copy = function () {
  return new G.DRAW.F_STYLE(this.stroke, this.stroke_width, this.fill);
};

G.DRAW.F_STYLE.prototype.f_set_stroke = function (new_stroke) {
  return new G.DRAW.F_STYLE(new_stroke, this.stroke_width, this.fill);
};