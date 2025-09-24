import * as argon2 from "argon2";


async function hash(password: string) {
    return await argon2.hash(password, { parallelism: 2 })
}

async function verify(hashed: string, password: string) {
    return await argon2.verify(hashed, password)
}

export { hash, verify }