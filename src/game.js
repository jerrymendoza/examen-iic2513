export default function getTablero() {
    const items = []
    const columns = ['A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J']
    columns.map( (letter) => {
    for (var i = 1; i < 11; ++i) {
        items.push({x:letter, y:i});
                } 
        }
    )
    return items;
}


