
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
        verify(map2);
    }

    const verify = (map2) => {
        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }
    }

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

    // funcions funcionals 4x4

    function moviment(arrayEntrada, reverse) {
        let arraySortida = [];
        if (reverse) {
            arrayEntrada.reverse();
        }
        const aux = arrayEntrada.filter(e => e);
        for (let i = 0; i < aux.length; i++) {
            if (aux[i] == aux[i + 1]) {
                arraySortida.push(aux[i] + aux[i + 1]);
                i++;
            } else {
                arraySortida.push(aux[i]);
            }
        }
        if (!arraySortida) {
            arraySortida = [...aux];
        }
        return arraySortida;
    }

    function gameOver() {
        let finish = false;


    }

    function win(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == 2048) {
                return true;
            }
        }
    }



    const up = () => {

        let col1 = [map[0], map[4], map[8], map[12]];
        let col2 = [map[1], map[5], map[9], map[13]];
        let col3 = [map[2], map[6], map[10], map[14]];
        let col4 = [map[3], map[7], map[11], map[15]];

        col1 = moviment(col1, false);
        col2 = moviment(col2, false);
        col3 = moviment(col3, false);
        col4 = moviment(col4, false);

        const map2 = [
            col1[0] ?? 0, col2[0] ?? 0, col3[0] ?? 0, col4[0] ?? 0,
            col1[1] ?? 0, col2[1] ?? 0, col3[1] ?? 0, col4[1] ?? 0,
            col1[2] ?? 0, col2[2] ?? 0, col3[2] ?? 0, col4[2] ?? 0,
            col1[3] ?? 0, col2[3] ?? 0, col3[3] ?? 0, col4[3] ?? 0
        ];

        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }
    }
    const left = () => {
        let row1 = [map[0], map[1], map[2], map[3]];
        let row2 = [map[4], map[5], map[6], map[7]];
        let row3 = [map[8], map[9], map[10], map[11]];
        let row4 = [map[12], map[13], map[14], map[15]];

        row1 = moviment(row1, false);
        row2 = moviment(row2, false);
        row3 = moviment(row3, false);
        row4 = moviment(row4, false);

        const map2 = [
            row1[0] ?? 0, row1[1] ?? 0, row1[2] ?? 0, row1[3] ?? 0,
            row2[0] ?? 0, row2[1] ?? 0, row2[2] ?? 0, row2[3] ?? 0,
            row3[0] ?? 0, row3[1] ?? 0, row3[2] ?? 0, row3[3] ?? 0,
            row4[0] ?? 0, row4[1] ?? 0, row4[2] ?? 0, row4[3] ?? 0
        ];
        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }

    }
    const right = () => {
        let row1 = [map[0], map[1], map[2], map[3]];
        let row2 = [map[4], map[5], map[6], map[7]];
        let row3 = [map[8], map[9], map[10], map[11]];
        let row4 = [map[12], map[13], map[14], map[15]];

        row1 = moviment(row1, true);
        row2 = moviment(row2, true);
        row3 = moviment(row3, true);
        row4 = moviment(row4, true);

        const map2 = [
            row1[3] ?? 0, row1[2] ?? 0, row1[1] ?? 0, row1[0] ?? 0,
            row2[3] ?? 0, row2[2] ?? 0, row2[1] ?? 0, row2[0] ?? 0,
            row3[3] ?? 0, row3[2] ?? 0, row3[1] ?? 0, row3[0] ?? 0,
            row4[3] ?? 0, row4[2] ?? 0, row4[1] ?? 0, row4[0] ?? 0
        ];
        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }

    }

    const down = () => {
        let col1 = [map[0], map[4], map[8], map[12]];
        let col2 = [map[1], map[5], map[9], map[13]];
        let col3 = [map[2], map[6], map[10], map[14]];
        let col4 = [map[3], map[7], map[11], map[15]];

        col1 = moviment(col1, true);
        col2 = moviment(col2, true);
        col3 = moviment(col3, true);
        col4 = moviment(col4, true);

        const map2 = [
            col1[3] ?? 0, col2[3] ?? 0, col3[3] ?? 0, col4[3] ?? 0,
            col1[2] ?? 0, col2[2] ?? 0, col3[2] ?? 0, col4[2] ?? 0,
            col1[1] ?? 0, col2[1] ?? 0, col3[1] ?? 0, col4[1] ?? 0,
            col1[0] ?? 0, col2[0] ?? 0, col3[0] ?? 0, col4[0] ?? 0
        ];
        if (JSON.stringify(map2) !== JSON.stringify(map)) {
            map2[randomOf(freePositions(map2))] = 2;
            setMap(map2);
        }
    }


    return (
        <>
            <div className="w-1/2 m-auto grid gap-8 grid-cols-4" >
                {map.map((e, i) => <Box key={i} value={e} />)}

                <button className="w-full bg-slate-300 rounded-xl h-20 flex justify-center items-center" onClick={left}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-left" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M11 17h6l-4 -5l4 -5h-6l-4 5z" />
                    </svg>
                </button>
                <button className="w-full bg-slate-300 rounded-xl h-20 flex justify-center items-center" onClick={up}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-up" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 11v6l-5 -4l-5 4v-6l5 -4z" />
                    </svg>
                </button>
                <button className="w-full bg-slate-300 rounded-xl h-20 flex justify-center items-center" onClick={down}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-down" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 13v-6l-5 4l-5 -4v6l5 4z" />
                    </svg>

                </button>
                <button className="w-full bg-slate-300 rounded-xl h-20 flex justify-center items-center" onClick={right}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-badge-right" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M13 7h-6l4 5l-4 5h6l4 -5z" />
                    </svg>
                </button>
            </div>
        </>
    )
}








