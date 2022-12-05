
import isEqual from 'lodash.isequal'
import range from 'lodash.range'
import takeWhile from 'lodash.takewhile'

export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

type Dimension = {
    height: number
    width: number
}

type State<T> = Map<number, T>

type Shifting<T> = {
    state: State<T>
    refilled: boolean
}

export type Board<T> = Dimension & {
    pieces: Map<number, T>
}

export type MatchEffect<T> = {
    kind: "Match"
    match: Match<T>
}

export type RefillEffect = {
    kind: "Refill"
}

// discrimanted union 
export type Effect<T> =
    | MatchEffect<T>
    | RefillEffect


export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}


// projection of position to a index and vice versa 
const PosToIdx = (dim: Dimension, pos: Position) => pos.row * (dim.height * dim.width) + pos.col

const IdxToPos = (dim: Dimension, idx: number): Position => {
    return { row: Math.trunc(idx / (dim.height * dim.width)), col: idx % (dim.height * dim.width) }
}

// helper metod to prints out the board to the console
var dump = <T>(board: Board<T>) => {
    let output = ""
    for (let row = 0; row < board.height; row++) {

        let line = ""
        for (let col = 0; col < board.width; col++) {
            const element = pick(board, board.pieces, { row, col }) ?? "-"
            line += (element + " ")
        }

        output += (line + "\n")
    }
    console.log(output + "\n")
}

// determine distinct matches 
const distinct = <T>(dim: Dimension, matches: Match<T>[]) => matches.reduce((accu, current) =>
    accu.some(x => x.matched === current.matched && isEqual(x.positions, current.positions))
        ? accu : [...accu, current], [] as Match<T>[])

//  pick a item at a given position 
const pick = <T>(dim: Dimension, state: Map<number, T>, p: Position) => state.get(PosToIdx(dim, p))

const allPositions = <T>(dim: Dimension, state: Map<number, T>): Position[] =>
    [...state.keys()].map(idx => IdxToPos(dim, idx))

const emptyPositions = <T>(dim: Dimension, state: Map<number, T>): Position[] => {
    const points = [...range(dim.height)].flatMap(row => [...range(dim.width)]
        .map(col => PosToIdx(dim, { col, row })))
    return points.filter(pt => !state.has(pt)).map(idx => IdxToPos(dim, idx))
}

const swap = <T>(board: Board<T>, first: Position, second: Position) =>
    new Map<number, T>(board.pieces)
        .set(PosToIdx(board, first), piece(board, second)!)
        .set(PosToIdx(board, second), piece(board, first)!)

// find match in a row starting from a given column
const findMatchesInRow = <T>(dim: Dimension, state: Map<number, T>, row: number, startCol: number): Match<T> | undefined => {
    const matched = pick(dim, state, { row: row, col: startCol })!
    const columns = range(startCol, dim.width).map(col => ({ row, col }))
    const positions = takeWhile(columns, p => pick(dim, state, p) === matched)
    return positions.length >= 3 ? { matched, positions } : undefined

    //  A C D D D X
    //  0 1 2 3 4 5 
    //    ^
    //    1 2 3 4 5  => range(1,5) => [1..5]
    //    C 
    //    C -> [1]
    //      2 3 4 5 
    //      ^
    //      D 
    //      D D D  -> [2,3,4] => [2..4]
}

// which is the maximum match in a row 
const findMaxMatchesInRow = <T>(dim: Dimension, state: Map<number, T>, row: number): number =>
    [...range(dim.width)]
        .map(col => findMatchesInRow(dim, state, row, col)?.positions.length ?? 0)
        .reduce((acc, cur) => Math.max(acc, cur), 0)


// find match in a column starting from a given row
const findMatchesInCol = <T>(dim: Dimension, state: Map<number, T>, col: number, startRow: number): Match<T> | undefined => {
    const matched = pick(dim, state, { row: startRow, col: col })!
    const rows = range(startRow, dim.height).map(row => ({ row, col }))
    const positions = takeWhile(rows, p => pick(dim, state, p) === matched)
    return positions.length >= 3 ? { matched, positions } : undefined
}

// which is the maximum match in a column
const findMaxMatchesInCol = <T>(dim: Dimension, state: Map<number, T>, col: number): number =>
    [...range(dim.height)]
        .map(row => findMatchesInCol(dim, state, col, row)?.positions.length ?? 0)
        .reduce((acc, cur) => Math.max(acc, cur), 0)

// TODO: this can be done more functional ?

const findMatches = <T>(dim: Dimension, state: Map<number, T>, p: Position): Match<T>[] => {
    const matches = []

    let c = 0
    while (c < dim.width) {
        const match = findMatchesInRow(dim, state, p.row, c)
        if (match) {
            matches.push(match)
            break
        }
        c++
    }
    let r = 0
    while (r < dim.height) {
        const match = findMatchesInCol(dim, state, p.col, r)
        if (match) {
            matches.push(match)
            break
        }
        r++
    }
    return matches
}

const shiftTilesRecurse = <T>(dim: Dimension, generator: Generator<T>, state: Shifting<T>): Shifting<T> => {
    dump({ ...dim, pieces: state.state })
    var result = state.refilled

    let pieces = state.state

    var dropPositions = allPositions(dim, state.state)
        .filter(pos => pos.row !== dim.height - 1)
        .filter(pos => !pieces.has(PosToIdx(dim, { row: pos.row + 1, col: pos.col })))

    var emptyFirstRow = emptyPositions(dim, state.state)
        .filter(pos => pos.row === 0)

    const positions = emptyFirstRow
        .concat(dropPositions)
        .sort((a, b) => PosToIdx(dim, a) - PosToIdx(dim, b))

    if (positions.length > 0) {

        positions.forEach(pos => {
            const item = pick(dim, pieces, pos)

            // first row 
            if (!item) {
                pieces.set(PosToIdx(dim, pos), generator.next())
                result = true
            }
            else
            // drop below 
            {
                pieces.set(PosToIdx(dim, { row: pos.row + 1, col: pos.col }), item)
                if (pos.row === 0) {
                    pieces.set(PosToIdx(dim, pos), generator.next())
                    result = true
                } else {
                    pieces.delete(PosToIdx(dim, pos))
                }
            }
        });
        return shiftTilesRecurse(dim, generator, { state: pieces, refilled: result })
    }
    return state
}

const shiftTiles = <T>(dim: Dimension, generator: Generator<T>, state: Shifting<T>): Shifting<T> =>
    shiftTilesRecurse(dim, generator, state)

const removeMatch = <T>(dim: Dimension, matches: Match<T>[], state: Map<number, T>): Map<number, T> => {
    const positions = matches.flatMap(match => match.positions).map(p => PosToIdx(dim, p))

    return positions.reduce((acc, cur) => {
        acc.delete(cur)
        return acc
    }, state)

}

const resolve = <T>(moveResult: MoveResult<T>, generator: Generator<T>): MoveResult<T> => {

    const dim: Dimension = moveResult.board

    let result = moveResult

    dump(result.board)

    const shifting = shiftTiles(dim, generator, { state: moveResult.board.pieces, refilled: false })

    if (shifting.refilled) {
        const newEffects = [...moveResult.effects, { kind: "Refill" } as RefillEffect]
        result = { ...result, board: { ...result.board, pieces: shifting.state }, effects: newEffects }
    }

    return result
}

export function create<T>(generator: Generator<T>, width: number, height: number) {
    const dimension = { height, width }
    const allPositions = [...range(height)].flatMap(row => [...range(width)].map(col => PosToIdx(dimension, { col, row })))
    const pieces = allPositions.reduce((acc, cur) => acc.set(cur, generator.next()), new Map<number, T>())

    return { ...dimension, pieces }
}

// reduce example 
// [2,5,6].reduce( (acc,cur) => acc + cur, 0) => 
//    1.  acc = 0, cur = 2   0+2=2 
//    2.  acc = 2, cur = 5   2+5=7
//    3.  acc = 7, cur = 6   7+6=
// 13
// [2,5,6].sum() 

// [1,2,3] 
// [2,4,5] 

// [1,2,3].flatMap( x => [2,4,5].map( y => {x,y})) => [{x:1,y:2}, {x:1,y:4}, ...., {x:3,y:5}] .length=9 
// 
// parent , children  -> flatMap => {......} 

//
//
// 'B', 'C', 'D','A', 'B', 'A','D', 'B', 'C','C', 'A', 'C'

// height=3, width=4  3x4 = 12

//  1.  acc={} , cur= (x=0 y=0)=0,  acc.set(0, 'B') 
//  2.  acc={0:'B'}, cur= (x=1, y=0)=1, acc.set(1,'C')
//  3.  acc={0:'B', 1:'C'}, ... 
//  ...
//  12  acc={0:B, ....,11:'A'} , cur ={x=2,y=3}, acc.set(12,'C')  ==> 


// map   f(x) -> y  - Transformation  
// reduce
// flatMap 


export function piece<T>(board: Board<T>, p: Position): T | undefined {
    return pick(board, board.pieces, p)
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {

    const isVert = first.col === second.col && first.row !== second.row
    const isHori = first.row === second.row && first.col !== second.col

    const isInRange = (x1: number, x2: number, n: number) => (x1 >= 0 && x1 < n && x2 >= 0 && x2 < n)

    const moveIsValid = () => {
        const next = swap(board, first, second)

        const matches = Math.max(
            findMaxMatchesInRow(board, next, first.row), findMaxMatchesInRow(board, next, second.row),
            findMaxMatchesInCol(board, next, first.col), findMaxMatchesInCol(board, next, second.col))

        return matches >= 3
    }

    const isNotSame = () => !(isVert && isHori)
    const doCross = () => (isVert || isHori)

    return isNotSame() && doCross()
        && isInRange(first.col, second.col, board.width)
        && isInRange(first.row, second.row, board.height)
        && moveIsValid()
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {

    if (canMove(board, first, second)) {
        // the real move (exchange)
        const pieces = swap(board, first, second)

        const dim = board

        const newBoard: Board<T> = { ...board, pieces }

        // Initial matches found on both positions
        let matches = distinct(dim, [
            ...findMatches(newBoard, pieces, first),
            ...findMatches(newBoard, pieces, second)
        ])

        // do this loop in a recurse manner  
        let moveResult = { board: newBoard, effects: matches.map(match => ({ kind: "Match", match })) } as MoveResult<T>
        while (matches.length > 0) {
            // Remove Tiles
            moveResult = {...moveResult, board: {...moveResult.board, pieces: removeMatch(dim,matches,moveResult.board.pieces)}}

            moveResult = resolve(moveResult, generator)

            const pieces = moveResult.board.pieces
            const positions = allPositions(dim, pieces)
            const nextMatches = distinct(dim, positions.reduce((acc, cur) => [...acc, ...findMatches(dim, pieces, cur)], [] as Match<T>[]))
            const newEffects = nextMatches.map(match => ({ kind: "Match", match } as MatchEffect<T>))
            moveResult = {
                ...moveResult, effects:
                    [...moveResult.effects, ...newEffects]
            }
            matches = nextMatches
        }
        return moveResult
    }

    return { board, effects: [] }
}
