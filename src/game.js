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
        this.naves = {'P1': new Nave('P1', 'Portaviones')}

        for (let i = 1; i < 5; i++){
            this.naves[`F${i}`] = new Nave(`F${i}`, 'Fragata')
        }

        for (let i = 1; i < 4; i++){
            this.naves[`C${i}`] = new Nave(`C${i}`, 'Crucero')
        }

        for (let i = 1; i < 3; i++){
            this.naves[`D${i}`] = new Nave(`D${i}`, 'Destructor')
        }
    }

}

class Tablero {
    constructor() {
        this.elements = build()
    }   

    getCruz(position){
        const right = columns.slice(columns.findIndex(p => p === position.x)+1)
        const left = columns.slice(0, columns.findIndex(p => p === position.x))
        const top = [];
        for (var i = 1; i <= position.y-1; i++) {
            top.push(i);
        }

        console.log('######## RIGHT #############')
        console.log(right)
        console.log('#####################')

        console.log('######## LEFT #############')
        console.log(left)
        console.log('#####################')

        console.log('######## TOP #############')
        console.log(top)
        console.log('#####################')

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



