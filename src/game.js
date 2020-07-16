/* eslint-disable array-callback-return */
/* eslint-disable no-redeclare */
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


export default class Battle {
    constructor(){
        this.tablero = new Tablero();
        this.ready = false;
        this.playing = false;
        this.gameId = NaN;
        this.naves = {'P1': new Nave('P1', 'portaviones')};
        for (let i = 1; i < CONFIG['fragata']['cantidad']+1; i++){
            this.naves[`F${i}`] = new Nave(`F${i}`, 'fragata')
        }

        for (let i = 1; i < CONFIG['crucero']['cantidad']+1; i++){
            this.naves[`C${i}`] = new Nave(`C${i}`, 'crucero')
        }

        for (let i = 1; i < CONFIG['destructor']['cantidad']+1; i++){
            this.naves[`D${i}`] = new Nave(`D${i}`, 'destructor')
        }
    }
    
   
    //interno
    
    start(gameId){
        this.playing = true;
        return true
    };
    checkShips(){
        for (const [, value] of Object.entries(this.naves)) {
            if (value.alive) {
                return true
            }
        }
        return false
    }
    receiveFire(id){
        // id de celda
        const cell = this.tablero.getCellById(id)
        if (cell.content) {
            cell.content.alive = false;
            cell.active = false;
            return cell
        }
        return false
    }

    surrender(){};

    accion(data){
        const valid = this.isActionValid(data);
        if (valid){
            this.cancelTarget();
            switch (data.action){
                case 'FIRE':
                    return this.performFire(data);
                    
                case 'MOVE':
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
        const payload = {
            action: {
                type: "FIRE",
                ship: ship.id,
                row: cell.getRow(),
                column: cell.getColumn()
            }
        }
        return payload
    };
    performMove(data){
        // ya debe estar validado
        const {ship, cell} = data;
        const oldCell = this.tablero.getCell(ship.posicion)
        const direction = this.tablero.getMoveDirection(oldCell, cell)
        cell.content = ship
        ship.posicion = cell.getPosition()
        oldCell.removeContent()
        const payload = {
            action: {
                type: "MOVE",
                ship: ship.id,
                ...direction
            }
        }
        return payload
    };
    
    insertShipOnField(ship, position){
        this.tablero.insert(ship, position)
        if (this.isReady()) {
            this.ready = true
        }
    }
    
    isReady(){
        for (const [, value] of Object.entries(this.naves)) {
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
            case 'FIRE':
                this.tablero.rangeFire(cell, action)
                break
            case 'MOVE':
                this.tablero.rangeMove(cell, action)
                break
            default:
               console.log('No action')
        }
        
    }

    showEnemies(){

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
        for (const [, value] of Object.entries(this.elements)) {
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

    showEnemies(celdas){
        celdas.forEach( cell => {
            this.elements[cell.id].toggleLighting(true)
        });
    }
    hideEnemies(){
        for (const [, value] of Object.entries(this.elements)) {
            value.lighting = false;
        }
    }

    cancelTarget(){
        for (const [, value] of Object.entries(this.elements)) {
            value.toggleSelectable(false);
        }
    }
    existe(ship){
        for (const [, value] of Object.entries(this.elements)) {
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
        return [availables, 'NORTH', availables.map(x => positionToId(x))]
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
        return [availables, 'SOUTH', availables.map(x => positionToId(x))];
    }
    getEast(position, range){
        var availables = [];
        const este = columns.slice(columns.findIndex(p => p === position.x)+1).filter((r,idx) => idx < range)
        este.map(x => {
            availables.push({x: x, y: position.y})
        })
        return [availables, 'EAST', availables.map(x => positionToId(x))];
    }
    getWest(position, range){
        var availables = [];
        var oeste = columns.slice(0, columns.findIndex(p => p === position.x))
        var oeste = oeste.reverse().filter((r,idx) => idx < range)
        oeste.map(x => {
            availables.push({x: x, y: position.y})
        })
        return [availables,'WEST', availables.map(x => positionToId(x))]
    }
    getCruz(position, range){
        const availables = [
            ...this.getNorth(position,range)[0],
            ...this.getSouth(position,range)[0],
            ...this.getEast(position,range)[0],
            ...this.getWest(position,range)[0],
        ]
        return availables
    }

    checkCells(targets, tipo = NaN, ship= NaN){
        var filtered = []
        targets.forEach( posicion => {
            var id = positionToId(posicion)
            //if (this.elements[id].active && !this.elements[id].content){
            if (this.elements[id].active){
                filtered.push(this.elements[id])
            }
        });
        if (tipo === 'FIRE' && ship){
            var id = positionToId(ship.posicion)
            filtered.push(this.elements[id])
        }
        return filtered;
    }
    rangeFire(cell){
        const target = this.checkCells(this.getCruz(cell.content.posicion, cell.content.disparo), 'FIRE', cell.content);
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
            case 'FIRE':
                return this.checkCells(this.getCruz(ship.posicion, ship.disparo),'FIRE', ship)
            case 'MOVE':
                return this.checkCells(this.getCruz(ship.posicion, ship.movimiento))
            default:
                return false
        }
    }

    getCell(posicion){
        var id = positionToId(posicion)
        return this.elements[id]
    }
    getCellById(id){
        return this.elements[id]
    }


    getMoveDirection(oldCell, cell){
        const destiny = cell.id
        const origin = {x: oldCell.x, y:oldCell.y}

        var north  = this.getNorth(origin, 10)
        if( north[2].includes(destiny)){
            return {direction: north[1], quantity: north[2].indexOf(destiny)+1 }
        }
        var south  = this.getSouth(origin, 10)

        if( south[2].includes(destiny)){
            return {direction: south[1], quantity: south[2].indexOf(destiny)+1 }
        }
        var east  = this.getEast(origin, 10)

        if( east[2].includes(destiny)){
            return {direction: east[1], quantity: east[2].indexOf(destiny)+1 }
        }
        var west  = this.getWest(origin, 10)

        if( west[2].includes(destiny)){
            return {direction: west[1], quantity: west[2].indexOf(destiny)+1 }
        }
        return false
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
        this.lighting = false;
    }
    isActive (){
        return this.active;
    }
    toggleSelectable(bol){
        if (this.active){
            this.selectable = bol;
        }
    }

    toggleLighting(bol){
        this.lighting = bol;
    }

    removeContent(){
        this.content = NaN
    }
    getPosition(){
        return {x: this.x, y:this.y}
    }
    getRow(){
        return this.y-1
    }
    getColumn(){
        return columns.indexOf(this.x)
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
        if (tipo==='FIRE'){
            return this.disparo
        } else if (tipo==='MOVE'){
            return this.movimiento
        }
    }

}



