const columns = ['A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J']
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


export default class Battle {
    constructor(){
        this.tablero = new Tablero()
        this.naves = {'P1': new Nave('P1', 'portaviones')}

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

}

class Tablero {
    constructor() {
        this.elements = build()
    }   

    getCruz(position){
        const availables = []
        const right = columns.slice(columns.findIndex(p => p === position.x)+1)
        const left = columns.slice(0, columns.findIndex(p => p === position.x))
        const top = [];
        for (var t = 1; t <= position.y-1; t++) {
            top.push(t);
        }
        const down = [];
        for (var d = position.y+1; d <= 10; d++) {
            down.push(d);
        }
        right.concat(left).map(x => {
            availables.push({x: x, y: position.y})
        })

        top.concat(down).map(y => {
            availables.push({x: position.x, y: y})
        })

        return availables
    }
}

class Celda {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = `${x}${y}`
    }
    isActive (){
        return this.active;
    }

    myId(){
        console.log(this.id)
    }



}; 

class Nave {
    constructor(id, tipo){
        this.id = id;
        this.tipo = tipo;
        this.posicion = {x: NaN, y: NaN }
    };

    setPosition(posicion){
        this.posicion = posicion;
    };



}



