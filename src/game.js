/* eslint-disable array-callback-return */
/* eslint-disable no-redeclare */
import { ApiService } from './Api';
import { element } from 'prop-types';
const columns = ['A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J']
const CONFIG = {
    'fragata': { 'cantidad': 4, 'movimiento': 4, 'disparo': 2, 'id':'F'},
    'crucero': { 'cantidad': 3, 'movimiento': 3, 'disparo': 2, 'id':'C'},
    'destructor': { 'cantidad': 2, 'movimiento': 2, 'disparo': 3, 'id':'D'},
    'portaviones': { 'cantidad': 1, 'movimiento': 1, 'disparo': 5, 'id':'P'}
}
function build() {
    const items = {}
    columns.map( (letter) => {
        for (var i = 1; i < 11; ++i) {
            items[`${letter}${i}`] = new Celda(letter, i)
            } 
        }
    )
    return items;
};

function positionToId(position){
    return `${position.x}${position.y}`
}

async function newGameApi(){
    var data = await ApiService().post('/games', {})
    return data.data.gameId
}

export default class Battle {
    constructor(){
        this.tablero = new Tablero();
        this.ready = false;
        this.playing = false;
        this.gameId = NaN;
        this.naves = {'P1': new Nave('P1', 'portaviones')};
        for (let i = 1; i < 5; i++){
            this.naves[`F${i}`] = new Nave(`F${i}`, 'fragata')
        }

        for (let i = 1; i < 4; i++){
            this.naves[`C${i}`] = new Nave(`C${i}`, 'crucero')
        }

        for (let i = 1; i < 3; i++){
            this.naves[`D${i}`] = new Nave(`D${i}`, 'destructor')
        }
    }
    call = (data) =>{
        var response = ApiService().post(`/games/${this.gameId}/action`, data)
        console.log(response);
        return response
    }
    //api
    action(){}
    events(){}
    //interno
    
    start(){
        this.playing = true;
        ApiService().post('/games', {}).then( data => {
            this.gameId = data.data.gameId
        })
        return true
    };
    surrender(){};

    accion(data){
        const valid = this.isActionValid(data);
        console.log(valid)
        if (valid){
            this.cancelTarget();
            switch (data.action){
                case 'fire':
                    return this.performFire(data);
                    
                case 'move':
                    return this.performMove(data);
                    
                default:
                    return false
            }
        }
    }

    isActionValid(data){
        const { action, ship, cell } = data;
        const availables = this.tablero.getCellCruz(ship, action)
        for (var i = 0; i < availables.length; i++) {
            if (availables[i].id === cell.id){
                return true
            }
        }
        return false
    }
    performFire(data){
        // ya debe estar validado
        const {ship, cell} = data;
        
    };
    performMove(data){
        // ya debe estar validado
        const {ship, cell} = data;
        const oldCell = this.tablero.getCell(ship.posicion)
        cell.content = ship
        ship.posicion = cell.getPosition()
        oldCell.removeContent()
        return true
    };
    
    insertShipOnField(ship, position){
        this.tablero.insert(ship, position)
        if (this.isReady()) {
            this.ready = true
        }
    }
    
    isReady(){
        for (const [key, value] of Object.entries(this.naves)) {
            if (!value.positioned) {
                return false
            }
        }
        return true
    }

    makeSelectable(){
        // marcar naves
        this.cancelTarget();
        this.tablero.selectable();
    }
    cancelTarget(){
        this.tablero.cancelTarget();
    }

    activateRange(cell, action){
        // marcar rango
        switch (action){
            case 'fire':
                this.tablero.rangeFire(cell, action)
                break
            case 'move':
                this.tablero.rangeMove(cell, action)
                break
            default:
               console.log('No action')
        }
        
    }

}

class Tablero {
    constructor() {
        this.elements = build()
    }   

    insert(ship, position){
        const id = `${position.x}${position.y}`
        if (!this.existe(ship)) {
            if (!this.elements[id].content) {
                this.elements[id].content = ship
                ship.setPosition(position)
            }
        }
    }
    
    selectable(){
        for (const [key, value] of Object.entries(this.elements)) {
            if (value.content) {
  
                value.toggleSelectable(true);
            }
        };
    }
    showTarget(celdas){
        celdas.forEach( cell => {
            this.elements[cell.id].toggleSelectable(true)
        });
    }
    cancelTarget(){
        for (const [key, value] of Object.entries(this.elements)) {
            value.toggleSelectable(false);
        }
    }
    existe(ship){
        for (const [key, value] of Object.entries(this.elements)) {
            if (value.content === ship) {
                return true
            }
        };
        return false;
    }
    getNorth(position, range){
        var availables = [];
        var north = [];
        for (var t = 1; t <= position.y-1; t++) {
            north.push(t);
        }
        var north = north.reverse().filter((r,idx) => idx < range)
        north.map(y => {
            availables.push({x: position.x, y: y})
        })
        return availables
    }

    getSouth(position, range){
        var availables = [];
        var sur = [];
        for (var d = position.y+1; d <= 10; d++) {
            sur.push(d);
        }
        var sur = sur.filter((r,idx) => idx < range)
        sur.map(y => {
            availables.push({x: position.x, y: y})
        })
        return availables;
    }
    getEast(position, range){
        var availables = [];
        const este = columns.slice(columns.findIndex(p => p === position.x)+1).filter((r,idx) => idx < range)
        este.map(x => {
            availables.push({x: x, y: position.y})
        })
        return availables
    }
    getWest(position, range){
        var availables = [];
        var oeste = columns.slice(0, columns.findIndex(p => p === position.x))
        var oeste = oeste.reverse().filter((r,idx) => idx < range)
        oeste.map(x => {
            availables.push({x: x, y: position.y})
        })
        return availables
    }
    getCruz(position, range){
        const availables = [
            ...this.getNorth(position,range),
            ...this.getSouth(position,range),
            ...this.getEast(position,range),
            ...this.getWest(position,range),
        ]
        return availables
    }

    checkCells(targets){
        var filtered = []
        targets.forEach( posicion => {
            var id = positionToId(posicion)
            if (this.elements[id].active && !this.elements[id].content){
                filtered.push(this.elements[id])
            }
        });
        return filtered;
    }
    rangeFire(cell){
        const target = this.checkCells(this.getCruz(cell.content.posicion, cell.content.disparo));
        this.cancelTarget()
        this.showTarget(target)
        return true
    }
    rangeMove(cell){
        const target = this.checkCells(this.getCruz(cell.content.posicion, cell.content.movimiento));
        this.cancelTarget()
        this.showTarget(target)
    }

    getCellCruz(ship, tipo){
        switch (tipo) {
            case 'fire':
                return this.checkCells(this.getCruz(ship.posicion, ship.disparo))
            case 'move':
                return this.checkCells(this.getCruz(ship.posicion, ship.movimiento))
            default:
                return false
        }
    }

    getCell(posicion){
        var id = positionToId(posicion)
        return this.elements[id]
    }
}

class Celda {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = `${x}${y}`;
        this.content = NaN;
        this.active = true;
        this.selectable = false;
    }
    isActive (){
        return this.active;
    }
    toggleSelectable(bol){
        if (this.active){
            this.selectable = bol;
        }
    }

    removeContent(){
        this.content = NaN
    }
    getPosition(){
        return {x: this.x, y:this.y}
    }
}; 

class Nave {
    constructor(id, tipo){
        this.id = id;
        this.tipo = tipo;
        this.posicion = {x: NaN, y: NaN};
        this.positioned = false;
        this.disparo = CONFIG[tipo]['disparo'];
        this.movimiento = CONFIG[tipo]['movimiento'];
        this.alive = true;
    };

    setPosition(posicion){
        this.posicion = posicion;
        this.positioned = true;
    };

    myRange(tipo){
        if (tipo==='fire'){
            return this.disparo
        } else if (tipo==='move'){
            return this.movimiento
        }
    }

}



