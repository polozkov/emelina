//Global object for all project
var G = {
  ARR_CUBES_NOW: [],

  //generator of the arrays
  ARR: {},

  MATRIX: {},

  //edge on cube defined by three coordinates -1..+1 and index of neigbour cube
  //when you solve puzzle i_next_cube is static, edge_point rotate (has 12 values)
  F_EDGE: function (edge_point, i_next_cube = 0, edge_face_point = [0,0,0]) {
    //3d point with integer coordinates (relavant to cube's center)
    this.edge_point = edge_point.slice();
    this.i_next_cube = i_next_cube;
    this.edge_face_point = edge_face_point.slice();
  },

  //arr_edges do not changes after rotations 
  F_CUBE: function (
    center = [0, 0, 0],
    n_index = 0,
    arr_edges = []
  ) {
    //3d coord (x,y,z), where values are integers and even (step = 2)
    this.center = center.slice();

    //index of current cube
    this.n_index = n_index;

    //array of edges, that have contact with other cube
    //this.arr_edges = G.ARR.f_op_copy(arr_edges);
    this.arr_edges = G.ARR.f_op_copy(arr_edges);
  },

  AI: {
    ROTATIONS: {},
    ROTATIONS_24: {},
    CONSTANTS: {},
    INPUT: {},
    D2: {},
    MOVE: {},
    SEPARATE: {},
    LEGAL: {}
  },

  DRAW: {
    ELEMENTS: {},
    CALC_3D: {},

    F_STYLE: function (stroke = "black", stroke_width = 4, fill = "gray") {
      this.stroke = stroke;
      this.fill = fill;
      this.stroke_width = stroke_width;
    },

    SETTING: {},

    PRIMITIVES: {},

    CUBES: {}
  },

  TEST: {
    
  }
};