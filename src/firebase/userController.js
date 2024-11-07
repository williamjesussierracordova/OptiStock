import { set, ref ,get} from "firebase/database";
import { getFirebaseDb } from "../firebase/firebase.js";
// import { v4 as uuidv4 } from 'uuid';

const db = getFirebaseDb();

export async function writeUser(codigoUsuario,email,displayName) {
    try {
        await set(ref(db, 'users/' + codigoUsuario), {
            codigoUsuario: codigoUsuario,
            email: email,
            displayName: displayName,
        });
        console.log("User data saved successfully.");
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
}

export async function readUser(codigoUsuario) {
    const userRFC = ref(db, 'users/' + codigoUsuario);
    try {
        const snapshot = await get(userRFC);
        let data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export function deleteUser(codigoUsuario) {
    set(ref(db, 'users/' + codigoUsuario), null);
}

export async function readUserFromEmail(email) {
    try {
        const users = ref(db, 'users');
        const snapshot = await get(users);
        let data = snapshot.val();
        let user = null;
        for (let key in data) {
            if (data[key].email === email) {
                user = data[key];
            }
        }
        return user;
    } catch (error) {
        console.error(error);
    }
}