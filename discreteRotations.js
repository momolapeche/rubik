export const quarterTurnRotations = {
    x: [
        new Int8Array([
            1,  0, 0,
            0,  0, 1,
            0, -1, 0,
        ]),
        new Int8Array([
            1,  0,  0,
            0, -1,  0,
            0,  0, -1,
        ]),
        new Int8Array([
            1, 0,  0,
            0, 0, -1,
            0, 1,  0,
        ]),
    ],
    y: [
        new Int8Array([
            0, 0, -1,
            0, 1,  0,
            1, 0,  0,
        ]),
        new Int8Array([
            -1, 0,  0,
            0,  1,  0,
            0,  0, -1,
        ]),
        new Int8Array([
            0,  0, 1,
            0,  1, 0,
            -1, 0, 0,
        ]),
    ],
    z: [
        new Int8Array([
            0, 1, 0,
            -1, 0, 0,
            0, 0, 1,
        ]),
        new Int8Array([
            -1,  0, 0,
            0,  -1, 0,
            0,   0, 1,
        ]),
        new Int8Array([
            0, -1, 0,
            1,  0, 0,
            0,  0, 1,
        ]),
    ],
}
