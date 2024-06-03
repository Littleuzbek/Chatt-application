import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useSelector } from "react-redux";

export const UpdateListMessge = async (text) => {
  const user = useSelector((state) => state.chat.user);
  const chatId = useSelector((state) => state.chat.chatId);
  const currentUser = auth.currentUser;
  const ID = user.type === "user" ? chatId : user.value.uid;

  console.log('hella');

  return async()=>{
      if (user.type === "user") {
          await updateDoc(doc(db, "userChats", currentUser.uid), {
      [ID + ".lastMessage"]: {
        text,
    },
      [ID + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.value.uid), {
      [ID + ".lastMessage"]: {
          text,
        },
        [ID + ".date"]: serverTimestamp(),
        [ID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
        },
    });
}
}
};

