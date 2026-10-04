import { getDB } from '../db/db.js'

export async function insertUser(userData) {
    const db = getDB()
    const result = await db.collection("users").insertOne(userData)
    return result
}

export async function findUserByUsername(username) {
    const db = getDB()
    const user = await db.collection("users").findOne({ username })
    return user
}
