/** @typedef { Float32Array | Int8Array | Int16Array | Int32Array } vec3 */

export const vec3 = {
    /** @returns { vec3 } */
    create() {
        return new Float32Array([0, 0, 0])
    },

    /**
    * @param { number } x
    * @param { number } y
    * @param { number } z
    * @returns { vec3 }
    */
    fromValues(x, y, z) {
        return new Float32Array([x, y, z])
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @returns { vec3 }
    */
    copy(o, v) {
        o[0] = v[0]
        o[1] = v[1]
        o[2] = v[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { number } x
    * @param { number } y
    * @param { number } z
    * @returns { vec3 }
    */
    set(o, x, y, z) {
        o[0] = x
        o[1] = y
        o[2] = z
        return o
    },

    /**
    * @param { vec3 } v
    * @returns { number }
    */
    length(v) {
        return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
    },

    /**
    * @param { vec3 } v
    * @returns { number }
    */
    lengthSquared(v) {
        return v[0]*v[0] + v[1]*v[1] + v[2]*v[2]
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @returns { vec3 }
    */
    normalize(o, v) {
        const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
        v[0] /= len
        v[1] /= len
        v[2] /= len
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { number } s
    * @returns { vec3 }
    */
    scale(o, v, s) {
        o[0] = v[0] * s
        o[1] = v[1] * s
        o[2] = v[2] * s
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    mul(o, a, b) {
        o[0] = a[0] * b[0]
        o[1] = a[1] * b[1]
        o[2] = a[2] * b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    div(o, a, b) {
        o[0] = a[0] / b[0]
        o[1] = a[1] / b[1]
        o[2] = a[2] / b[2]
        return o
    },

    /**
    * @param { vec3 } a 
    * @param { vec3 } b
    * @returns { number }
    */
    dot(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    cross(o, a, b) {
        const x = a[1] * b[2] - a[2] * b[1]
        const y = a[2] * b[0] - a[0] * b[2]
        const z = a[0] * b[1] - a[1] * b[0]

        o[0] = x
        o[1] = y
        o[2] = z

        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    add(o, a, b) {
        o[0] = a[0] + b[0]
        o[1] = a[1] + b[1]
        o[2] = a[2] + b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    sub(o, a, b) {
        o[0] = a[0] - b[0]
        o[1] = a[1] - b[1]
        o[2] = a[2] - b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @param { number } t
    * @returns { vec3 } b
    */
    lerp(o, a, b, t) {
        const s = 1 - t
        o[0] = a[0] * s + b[0] * t
        o[1] = a[1] * s + b[1] * t
        o[2] = a[2] * s + b[2] * t
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat3 } m
    * @returns { vec3 }
    */
    transformMat3(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]
        o[0] = x * m[0] + y * m[3] + z * m[6]
        o[1] = x * m[1] + y * m[4] + z * m[7]
        o[2] = x * m[2] + y * m[5] + z * m[8]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat4 } m
    * @returns { vec3 }
    */
    transformMat4(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]
        o[0] = x * m[ 0] + y * m[ 4] + z * m[ 8] + m[12]
        o[1] = x * m[ 1] + y * m[ 5] + z * m[ 9] + m[13]
        o[2] = x * m[ 2] + y * m[ 6] + z * m[10] + m[14]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat4 } m
    * @returns { vec3 }
    */
    transformMat4ThenDivide(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]

        const w = x * m[3] + y * m[7] + z * m[11] + m[15]

        o[0] = (x * m[ 0] + y * m[ 4] + z * m[ 8] + m[12]) / w
        o[1] = (x * m[ 1] + y * m[ 5] + z * m[ 9] + m[13]) / w
        o[2] = (x * m[ 2] + y * m[ 6] + z * m[10] + m[14]) / w
        return o
    },
}


/** @typedef { Float32Array | Int8Array | Int16Array | Int32Array } mat3 */
export const mat3 = {
    /** @returns { mat3 } */
    create() {
        return new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ])
    },
    
    /**
    * @param { number } a
    * @param { number } b
    * @param { number } c
    * @param { number } d
    * @param { number } e
    * @param { number } f
    * @param { number } g
    * @param { number } h
    * @param { number } i
    * @returns { mat3 }
    */
    fromValues(a, b, c, d, e, f, g, h, i) {
        return new Float32Array([
            a, b, c,
            d, e, f,
            g, h, i,
        ])
    },

    /**
    * @param { mat3 } o
    * @param { mat4 } m
    *
    * @returns { mat3 }
    */
    fromMat4(o, m) {
        o[0] = m[0]
        o[1] = m[1]
        o[2] = m[2]

        o[3] = m[4]
        o[4] = m[5]
        o[5] = m[6]

        o[6] = m[8]
        o[7] = m[9]
        o[8] = m[10]

        return o
    },

    /**
    * @param { mat3 } o
    * @param { mat3 } m
    * @returns { mat3 }
    */
    transpose(o, m) {
        const m0 = m[0]
        const m1 = m[1]
        const m2 = m[2]
        const m3 = m[3]
        const m4 = m[4]
        const m5 = m[5]
        const m6 = m[6]
        const m7 = m[7]
        const m8 = m[8]

        o[0] = m0
        o[1] = m3
        o[2] = m6
        o[3] = m1
        o[4] = m4
        o[5] = m7
        o[6] = m2
        o[7] = m5
        o[8] = m8

        return o
    },

    /**
    * @param { mat3 } o
    * @param { mat3 } a
    * @param { mat3 } b
    * @returns { mat3 }
    */
    mul(o, a, b) {
        const a00 = a[0]
        const a10 = a[1]
        const a20 = a[2]
        const a01 = a[3]
        const a11 = a[4]
        const a21 = a[5]
        const a02 = a[6]
        const a12 = a[7]
        const a22 = a[8]

        const b00 = b[0]
        const b10 = b[1]
        const b20 = b[2]
        const b01 = b[3]
        const b11 = b[4]
        const b21 = b[5]
        const b02 = b[6]
        const b12 = b[7]
        const b22 = b[8]
        
        o[0] = a00*b00 + a01*b10 + a02*b20
        o[1] = a10*b00 + a11*b10 + a12*b20
        o[2] = a20*b00 + a21*b10 + a22*b20
        
        o[3] = a00*b01 + a01*b11 + a02*b21
        o[4] = a10*b01 + a11*b11 + a12*b21
        o[5] = a20*b01 + a21*b11 + a22*b21
        
        o[6] = a00*b02 + a01*b12 + a02*b22
        o[7] = a10*b02 + a11*b12 + a12*b22
        o[8] = a20*b02 + a21*b12 + a22*b22

        return o
    },
}

/** @typedef { Float32Array | Int8Array | Int16Array | Int32Array } mat4 */

export const mat4 = {
    /** @returns { mat4 } */
    create() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } m
    * @returns { mat4 }
    */
    copy(o, m) {
        o[0] = m[0]
        o[1] = m[1]
        o[2] = m[2]
        o[3] = m[3]
        o[4] = m[4]
        o[5] = m[5]
        o[6] = m[6]
        o[7] = m[7]
        o[8] = m[8]
        o[9] = m[9]
        o[10] = m[10]
        o[11] = m[11]
        o[12] = m[12]
        o[13] = m[13]
        o[14] = m[14]
        o[15] = m[15]
        return o
    },

    /**
    * @param { mat4 } o
    * @returns { mat4 }
    */
    identity(o) {
        o[0] = 1
        o[1] = 0
        o[2] = 0
        o[3] = 0
        o[4] = 0
        o[5] = 1
        o[6] = 0
        o[7] = 0
        o[8] = 0
        o[9] = 0
        o[10] = 1
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } a
    * @param { mat4 } b
    * @returns { mat4 }
    */
    mul(o, a, b) {
        const a00 = a[0]
        const a10 = a[1]
        const a20 = a[2]
        const a30 = a[3]
        const a01 = a[4]
        const a11 = a[5]
        const a21 = a[6]
        const a31 = a[7]
        const a02 = a[8]
        const a12 = a[9]
        const a22 = a[10]
        const a32 = a[11]
        const a03 = a[12]
        const a13 = a[13]
        const a23 = a[14]
        const a33 = a[15]

        const b00 = b[0]
        const b10 = b[1]
        const b20 = b[2]
        const b30 = b[3]
        const b01 = b[4]
        const b11 = b[5]
        const b21 = b[6]
        const b31 = b[7]
        const b02 = b[8]
        const b12 = b[9]
        const b22 = b[10]
        const b32 = b[11]
        const b03 = b[12]
        const b13 = b[13]
        const b23 = b[14]
        const b33 = b[15]
        
        o[ 0] = a00*b00 + a01*b10 + a02*b20 + a03*b30
        o[ 1] = a10*b00 + a11*b10 + a12*b20 + a13*b30
        o[ 2] = a20*b00 + a21*b10 + a22*b20 + a23*b30
        o[ 3] = a30*b00 + a31*b10 + a32*b20 + a33*b30
        
        o[ 4] = a00*b01 + a01*b11 + a02*b21 + a03*b31
        o[ 5] = a10*b01 + a11*b11 + a12*b21 + a13*b31
        o[ 6] = a20*b01 + a21*b11 + a22*b21 + a23*b31
        o[ 7] = a30*b01 + a31*b11 + a32*b21 + a33*b31
        
        o[ 8] = a00*b02 + a01*b12 + a02*b22 + a03*b32
        o[ 9] = a10*b02 + a11*b12 + a12*b22 + a13*b32
        o[10] = a20*b02 + a21*b12 + a22*b22 + a23*b32
        o[11] = a30*b02 + a31*b12 + a32*b22 + a33*b32
        
        o[12] = a00*b03 + a01*b13 + a02*b23 + a03*b33
        o[13] = a10*b03 + a11*b13 + a12*b23 + a13*b33
        o[14] = a20*b03 + a21*b13 + a22*b23 + a23*b33
        o[15] = a30*b03 + a31*b13 + a32*b23 + a33*b33

        return o
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } m
    * @returns { mat4 }
    */
    fromMat3(o, m) {
        o[ 0] = m[0]
        o[ 1] = m[1]
        o[ 2] = m[2]
        o[ 3] = 0
        o[ 4] = m[3]
        o[ 5] = m[4]
        o[ 6] = m[5]
        o[ 7] = 0
        o[ 8] = m[6]
        o[ 9] = m[7]
        o[10] = m[8]
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { vec3 } s
    * @returns { mat4 }
    */
    fromTranslation(o, t) {
        o[ 0] = 1
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0
        o[ 4] = 0
        o[ 5] = 1
        o[ 6] = 0
        o[ 7] = 0
        o[ 8] = 0
        o[ 9] = 0
        o[10] = 1
        o[11] = 0
        o[12] = t[0]
        o[13] = t[1]
        o[14] = t[2]
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { vec3 } s
    * @returns { mat4 }
    */
    fromScale(o, s) {
        o[ 0] = s[0]
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0
        o[ 4] = 0
        o[ 5] = s[1]
        o[ 6] = 0
        o[ 7] = 0
        o[ 8] = 0
        o[ 9] = 0
        o[10] = s[2]
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotX(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = 1
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0

        // Y
        o[ 4] = 0
        o[ 5] = c
        o[ 6] = s
        o[ 7] = 0

        // Z
        o[ 8] = 0
        o[ 9] = -s
        o[10] = c
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotY(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = c
        o[ 1] = 0
        o[ 2] = -s
        o[ 3] = 0

        // Y
        o[ 4] = 0
        o[ 5] = 1
        o[ 6] = 0
        o[ 7] = 0

        // Z
        o[ 8] = s
        o[ 9] = 0
        o[10] = c
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotZ(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = c
        o[ 1] = s
        o[ 2] = 0
        o[ 3] = 0

        // Y
        o[ 4] = -s
        o[ 5] = c
        o[ 6] = 0
        o[ 7] = 0

        // Z
        o[ 8] = 0
        o[ 9] = 0
        o[10] = 1
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },

    /** J'avoue celle la je l'ai copiee
    *
    * @param { mat4 } o
    * @param { number } fovy
    * @param { number } aspect
    * @param { number } near
    * @param { number } far
    *
    * @returns { mat4 }
    */
    perspective(o, fovy, aspect, near, far) {
        const f = 1 / Math.tan(fovy / 2)
        const nf = 1 / (near - far)

        o[0] = f / aspect
        o[1] = 0
        o[2] = 0
        o[3] = 0

        o[4] = 0
        o[5] = f
        o[6] = 0
        o[7] = 0

        o[8] = 0
        o[9] = 0
        o[10] = far * nf
        o[11] = -1

        o[12] = 0
        o[13] = 0
        o[14] = far * near * nf
        o[15] = 0

        return o
    },
}
















