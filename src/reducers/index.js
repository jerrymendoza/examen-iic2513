import Battle from '../game'; 
const initialState = {
    message: `IIC2513 - EXAMEN`,
    battle: new Battle()
};

function reducer(state = initialState) {
    return state;
}
  
export default reducer;