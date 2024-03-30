
import { useState, useEffect } from "react";

const Box = ({ value }) => (
    <div className="p-4 h-full w-full border rounded-xl bg-slate-500">
        <p className="text-white text-center h-14 text-5xl">{value ? value : ''}</p>
    </div>
);

let initialMap = Array(16).fill(0);

// random int de 1 a max
const randomInt = (max) => Math.floor(Math.random() * max) + 1;
// element random d'una llista donada
const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)]
// retorna llista d'indexos lliures (value == 0)
const freePositions = arr => arr.map((e, i) => e ? 0 : i).filter(e => e);

initialMap[randomOf(freePositions(initialMap))] = 2;
initialMap[randomOf(freePositions(initialMap))] = 2;


export default () => {

    const [map, setMap] = useState(initialMap);
    const [size, setSize] = useState(4);

    function gameOver() {
        const up = arrayModify("up");
        const down = arrayModify("down");
        const right = arrayModify("right");
        const left = arrayModify("left");
        if (verify(down) == false && verify(up) == false && verify(right) == false && verify(left) == false) {
            return false
        } else {
            return true
        }
    }

    function win(estatActual) {
        for (let i = 0; i < estatActual.length; i++) {
            if (estatActual[i] == 2048) {
                return true;
            }
        }
    }

    const detectkeydown = (e) => {
        let key = e.key.slice(5).toLowerCase();
        let map2
        if (e.key === "ArrowDown") {
            map2 = arrayModify("down");
        }
        if (e.key === "ArrowUp") {
            map2 = arrayModify("up");
        }
        if (e.key === "ArrowRight") {
            map2 = arrayModify("right");

        }
        if (e.key === "ArrowLeft") {
            map2 = arrayModify("left");
        }
        if (verify(map2)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }

    }

    const verify = (map2) => {
        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            return true
        } else {
            return false
        }
    }

    setTimeout(() => {

    }, 200);

    useEffect(() => {
        if (win(map)) alert("you win")
        if (!gameOver()) alert("game over")
    }, [map]);


    useEffect(() => {
        document.addEventListener('keydown', detectkeydown, true)
        return () => document.removeEventListener('keydown', detectkeydown, true)
    }, [detectkeydown]);

    // optimitzar amb detectkeydown com a useCallback
    const arrayModify = (mov) => {
        let matriz = []
        const numCells = size * size
        if (mov === "right" || mov === "left") {
            for (let j = 0; j < size; j++) {
                matriz[j] = []
                for (let i = (j * size); i < (size + (size * j)); i++) {
                    matriz[j].push(map[i]);
                }
            }
            matriz = moviment2(matriz, mov);
        }

        if (mov === "up" || mov === "down") {
            for (let j = 0; j < size; j++) {
                matriz[j] = []
                for (let i = j; i < numCells; i += 4) {
                    matriz[j].push(map[i])
                }
            }
            matriz = moviment2(matriz, mov);
        }
        return matriz
    }

    function moviment2(arrayEntrada, mov) {
        let arraySortida = [];
        let operacions = []
        let buffer
        let aux = []
        for (let j = 0; j < size; j++) {
            operacions[j] = [];
            aux = arrayEntrada[j].filter(e => e);
            if (mov === "down" || mov === "right") {
                aux = aux.reverse();
            }
            for (let i = 0; i < aux.length; i++) {
                if (aux[i] == aux[i + 1]) {
                    operacions[j].push(aux[i] + aux[i + 1]);
                    i++;
                } else {
                    operacions[j].push(aux[i]);
                }
            }

        }
        if (!operacions) {
            operacions = [...arrayEntrada];
        }
        for (let j = 0; j < size; j++) {
            for (let i = 0; i < size; i++) {
                if (operacions[j][i] == undefined) {
                    operacions[j][i] = 0;
                }
            }
        }

        if (mov === "down" || mov === "right") {
            buffer = operacions.map(e => e.reverse());
        } else {
            buffer = [...operacions]
        }

        if (mov === "down" || mov === "up") {
            for (let j = 0; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    arraySortida.push(operacions[i][j]);
                }
            }
        }
        if (mov === "left" || mov === "right") {
            arraySortida = buffer.flat();
        }
        return arraySortida;
    }



    return (
        <>
            <div className="w-1/2 m-auto grid gap-8 grid-cols-4" >
                {map.map((e, i) => <Box key={i} value={e} />)}
            </div>
        </>
    )
}








