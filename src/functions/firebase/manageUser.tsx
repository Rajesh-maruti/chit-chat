import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from ".";
import { UserDataType } from "../../components/UserContainer/UserList";
import { getDatabase, onChildChanged, ref, set } from "firebase/database";

export const manageUser = {
  auth: getAuth(),
  getCurrentSignedInUser: function (onGetUser: (user: User | null) => void) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        onGetUser(user);
      } else {
        onGetUser(null);
      }
    });
  },

  getUserDataByPhoneNumber: async function (phoneNumber: string) {
    const dataQuery = query(
      collection(db, "users"),
      where("mobileNumber", "==", phoneNumber)
    );
    const data = (await getDocs(dataQuery)).docs;
    return data;
  },

  phoneNumberExist: async function (phoneNumber: string) {
    const isPhoneNumberExistQuery = query(
      collection(db, "users"),
      where("mobileNumber", "==", phoneNumber)
    );
    const phoneNumberExist = (await getDocs(isPhoneNumberExistQuery)).docs
      .length;
    return !!phoneNumberExist;
  },

  isPhoneNumberAddedAlready: async function (uid: string, phoneNumber: string) {
    const phoneNumbers = query(
      collection(db, "chatUsersList" + uid),
      where("mobileNumber", "==", `${phoneNumber}`)
    );
    const users = (await getDocs(phoneNumbers)).docs;
    return users;
  },

  getChatUsers: async function (phoneNumber: string) {
    const usersQuery = query(collection(db, "chatUsersList" + phoneNumber));
    const users = (await getDocs(usersQuery)).docs;
    return users?.map((each) => {
      const data = each.data();
      return {
        name: data.name || data.mobileNumber,
        image: data.image,
        phoneNumber: data.mobileNumber,
        id: each.id,
      } satisfies UserDataType;
    });
  },

  updateUserName: function (
    phoneNumber: string,
    id: string,
    newData: UserDataType
  ) {
    return updateDoc(doc(db, "chatUsersList" + phoneNumber, id), newData);
  },

  addNewUserToChat: async function (
    phoneNumberToWhichUserWillAdd: string,
    phoneNumberOfTheAccountToBeAdded: string,
    name?: string
  ) {
    const usersRef = collection(
      db,
      "chatUsersList" + phoneNumberToWhichUserWillAdd
    );
    await setDoc(doc(usersRef), {
      name: name || phoneNumberOfTheAccountToBeAdded,
      mobileNumber: phoneNumberOfTheAccountToBeAdded,
    });
    return true;
  },

  reloadUserList: (phoneNumber: string) => {
    const db = getDatabase();
    const reference = ref(db, `reload-userlist-${phoneNumber}`);
    set(reference, { reload: true });
  },

  onNewReload: (phoneNumber: string, reloadCallBack: () => void) => {
    const db = getDatabase();
    const reference = ref(db, `reload-userlist-${phoneNumber}`);
    set(reference, { reload: false });
    onChildChanged(reference, (data) => {
      if (data) {
        reloadCallBack();
      }
      set(reference, { reload: false });
    });
  },
};
