import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, push, set, get, query, remove } from 'firebase/database';




export function del(user, key) {
  return remove(ref(getDatabase(), `users/${user.uid}/todolist/${key}`));
}

export function setDone(user, key) {
  return set(ref(getDatabase(), `users/${user.uid}/todolist/${key}/done`), true);
}

export async function getList(user) {
  const oSnapshot = await get(query(ref(getDatabase(), `users/${user.uid}/todolist`)));
  const oArr = [];
  let oDeed;
  oSnapshot.forEach((oDoc) => {
    oDeed = oDoc.val();
    oDeed.key = oDoc.key;
    oArr.push(oDeed);
  });
  return oArr;
}

export async function add(user, deed) {
  const oRef = await push(
    ref(
      getDatabase(),
      `users/${user.uid}/todolist`
    )
  );
  await set(oRef, deed);
  const oSnapshot = await get(query(oRef));
  const oDeed = oSnapshot.val();
  oDeed.key = oRef.key;
  return oDeed;
}

export async function register(email, password) {
  try {
    const oUC = await createUserWithEmailAndPassword(
      getAuth(),
      email, password
    )
    return oUC.user;
  }
  catch (err) {
    return err.code;
  }
}

export async function login(email, password) {
  try {
    const oUC = await signInWithEmailAndPassword(
      getAuth(), 
      email, password
    );
    return oUC.code;
  }
  catch(err) {
    return err.code;
  }
}

export async function logout() {
  await signOut(getAuth());
}