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

    start(){
        this.playing = true;
        return true
    };

    surrender(){};
    performFire(){};
    performMove(){};
    
    insertShipOnField(ship, position){
        this.tablero.insert(ship, position)
        if (this.isReady()) {
            this.ready = true
        }
    }
    
    isReady(){
        for (const [key, value] of Object.entries(this.naves)) {
            console.log("dfsfssfd")
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
        celdas.forEach( posicion => {
            this.elements[positionToId(posicion)].toggleSelectable(true)
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
    getCruz(position, range){
        const availables = []
        const este = columns.slice(columns.findIndex(p => p === position.x)+1).filter((r,idx) => idx < range)
        var oeste = columns.slice(0, columns.findIndex(p => p === position.x))
        var oeste = oeste.reverse().filter((r,idx) => idx < range)

        var norte = [];
        for (var t = 1; t <= position.y-1; t++) {
            norte.push(t);
        }
        var norte = norte.reverse().filter((r,idx) => idx < range)
        var sur = [];
        for (var d = position.y+1; d <= 10; d++) {
            sur.push(d);
        }
        var sur = sur.filter((r,idx) => idx < range)
        este.concat(oeste).map(x => {
            availables.push({x: x, y: position.y})
        })

        norte.concat(sur).map(y => {
            availables.push({x: position.x, y: y})
        })
        
        return availables
    }

    checkActiveCell(targets){
        var filtered = []
        targets.forEach( posicion => {
            var id = positionToId(posicion)
            if (this.elements[id].active){
                filtered.push(posicion)
            }
        });
        return filtered;
    }
    rangeFire(cell){
        const target = this.getCruz(cell.content.posicion, cell.content.disparo)
        this.cancelTarget()
        this.showTarget(target)
    }
    rangeMove(cell){
        const target = this.getCruz(cell.content.posicion, cell.content.movimiento)
        this.cancelTarget()
        this.showTarget(target)
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


}



