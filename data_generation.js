"use strict";

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function indexfromrank(rank, resolution) {
    var y = Math.floor(rank / resolution[1]);
    var x = rank % resolution[1];
    return [y, x];
}

function rankfromindex(index, resolution) {
    return index[0] * resolution[1] + index[1];
}


class GoL {
    constructor(board, resolution, formatted=false) {
        this.res = resolution;
        this.neigh_indices = new Map();
        if(board) {
            this.board = this.format_board(Array.from(board), formatted);
        } else {
            drawGrid();
            this.board = this.init_board();
        }
        this.init_neighbours();
    }

    init_board() {
        let brd = new Array(this.res[0] * this.res[1]);
        let r;
        for (let i=0; i<this.res[0] * this.res[1]; i++) {
            r = randomInt(0, 1) * randomInt(0, 1) * randomInt(0, 1);
            brd[i] = r * 10;
            this.neigh_indices.set(i, this.neighboursindices(i));
        }
        return brd;
    }

    format_board(board, formatted) {
        for (let i=0; i<this.res[0] * this.res[1]; i++){
            this.neigh_indices.set(i, this.neighboursindices(i));
            formatted ? 0 : board[i] *= 10;
        }
        return board;
    }

    init_neighbours() {
        for (let i=0; i<this.res[0] * this.res[1]; i++) {
            if (Math.floor(this.board[i] / 10)) {
                this.updateNeighbours(i);
            }   
        }
    }

    neighboursindices (index) {
        let x, y;
        [y, x] = indexfromrank(index, this.res);
        let neigh = new Array(9);

        let Xfirstbound = Math.min(Math.abs(x - 1), Math.abs(x));
        let Xlastbound = Math.min(x + 1, this.res[1] - 1);
        let Yfirstbound = Math.min(Math.abs(y - 1), Math.abs(y));
        let Ylastbound = Math.min(y + 1, this.res[0] - 1);

        let n = 0;
        for (let row=Yfirstbound; row<=Ylastbound; row++) {
            for (let col=Xfirstbound; col<=Xlastbound; col++) {
                if (row == y & col == x) {continue;}
                neigh[n] = rankfromindex([row, col], this.res);
                n++;
            }
        }
        return neigh;
    }

    updateNeighbours (index) {
        let neigh_cells, central_cell;
        central_cell = this.board[index];
    
        neigh_cells = this.neigh_indices.get(index);
        for (let i=0; i<8; i++) {
            this.board[neigh_cells[i]] += Math.floor(central_cell / 10) ? 1 : -1;
        }
    }
    
    getGeneration() {
        let neigh_count, cell, prev_neigh_count;
        let brd = Array.from(this.board);
    
        for (let i=0; i<this.res[0] * this.res[1]; i++) {
            cell = brd[i];
            if (!cell) {
                continue;
            }
            prev_neigh_count = brd[i] % 10;
            neigh_count = this.board[i] % 10;
    
            if (Math.floor(cell / 10)) {
                if (!(prev_neigh_count == 2 || prev_neigh_count == 3)) {
                    this.board[i] = 0 * 10 + neigh_count;
                    this.updateNeighbours(i);
                }
            } else {
                if (prev_neigh_count == 3) {
                    this.board[i] = 1 * 10 + neigh_count;
                    this.updateNeighbours(i);
                }
            }
        }
    }

    get_board(){
        return Array.from(this.board);
    }

    nth_board(iter_num){
        for (var i=0; i<iter_num; i++){
            this.getGeneration();
        }
        return this.get_board();
    }
}

function populate_array(arr, population, density){
    let cells = Math.floor(arr.length * density);
    let indexes = Array.from(Array(arr.length).keys());
    let index, in_in;
    for (let i=0; i<cells; i++){
        index = undefined;
        while(index == undefined){
            in_in = randomInt(0, arr.length);
            index = indexes[in_in];
            indexes[in_in] = undefined;

        }
        arr[index] = population;
    }
}

function count(arr, elt=1){
    var count = 0;
    for(let k=0; k < arr.length; ++k){
        if(arr[k]== elt){
            count++;
        }
    }
    return count;
}

function without_neigh(lst){
    let arr = Array.from(lst);
    for(let n=0; n<arr.length; n++){
        if(arr[n]) {
            arr[n] = Math.floor(arr[n] / 10);
        }
    }
    return arr;
}

var test = new Set();

function generate_data(data_size, resolution){
    var data = Array(data_size);
    var data_index = 0;
    var m = 0;
    
    var lst, X_neigh, Y_neigh, X, Y, game, joined_lst;
    while(m < data_size){
        lst = new Array(resolution[0]*resolution[1]).fill(0);
        populate_array(lst, 10, Math.random());
        game = new GoL(lst, resolution, true);
        X_neigh = game.nth_board(6);
        Y_neigh = game.nth_board(1);
        X = without_neigh(X_neigh);
        joined_lst = X.join("");
        if (test.has(joined_lst)){
            // console.log("repeated");
            continue;
        }
        test.add(joined_lst);
        Y = without_neigh(Y_neigh);
        if (count(Y) != 0){
            (m % 10000) == 0 ? console.log("creating", m + "th sample") : 0;
            data[data_index] = {"start_gen": X,
                                "stop_gen": Y};
            data_index++;
            m++;
        }
    }
    console.log("Done");
    return data;
}

var save_data = (function () { 
    var a = document.createElement("a"); 
    document.body.appendChild(a); 
    a.style = "display: none"; 
    return function (data, fileName) { 
        var json = JSON.stringify(data), 
        blob = new Blob([json], {type: "octet/stream"}), 
        url = window.URL.createObjectURL(blob); 
        a.href = url; 
        a.download = fileName; 
        a.click(); 
        window.URL.revokeObjectURL(url); 
    }; 
}()); 

var Data;
function generate_and_save(){
    var files = ["gol_data_1.json", "gol_data_2.json"];
    for (let fileName of files){
        Data = [];
        Data = generate_data(100000, [25, 25]);
        save_data(Data, fileName); 
    }
}

generate_and_save();
