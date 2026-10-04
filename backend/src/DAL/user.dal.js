import { getDB } from '../db/db.js'
import { ObjectId } from 'mongodb'

export async function insertUser(userData) {
    const db = getDB()
    const result = await db.collection("users").insertOne(userData)
    return result
}

export async function findUserByEmail(email) {
    const db = getDB()
    const user = await db.collection("users").findOne({ email })
    return user
}

export async function findUserById(id) {
    const db = getDB()
    const user = await db.collection("users").findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
    )
    return user
}