import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { MdOutlineMenu } from "react-icons/md";
import "./Search.css";
import { useState } from "react";
import defaultUser from "../../../images/defaultUser.png";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";

export default function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("username", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setError(true);
    }
  };

  const handleKey = (e) => {
    (e.code === "Enter" || e.code === "NumpadEnter") && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const currentUserList = await getDoc(
        doc(db, "userChats", currentUser.uid)
      );
      const otherUserList = await getDoc(doc(db, "userChats", user.uid));
      const combinedChat = await getDoc(doc(db, "chats", combinedId));
      const currentUserHasChatt = Object.keys(currentUserList.data()).find(
        (e) => e === combinedId
      );
      const otherUserHasChatt = Object.keys(otherUserList.data()).find(
        (e) => e === combinedId
      );

      if (!currentUserHasChatt) {
        //create a chat in chats collection

        // if mutual chat was not deleted, if it was create new one
        if (!combinedChat) {
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // if other userList has currentUser, if not create new one in list
        if (!otherUserHasChatt) {
          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
      }
    } catch (err) {
      setError(err);
      console.log(err);
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="searchSection">
      <div className="search">
        <div
          className="menuBtn"
          onClick={() => dispatch(uiActions.setBackDrop(true))}
        >
          <MdOutlineMenu />
        </div>
        <input
          type="text"
          placeholder="Search for friend"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && (
        <p style={{ textAlign: "center", margin: "10px" }}>User not found</p>
      )}
      {user && (
        <div className="userFound" onClick={handleSelect}>
          <img src={user.photoURL ? user.photoURL : defaultUser} alt="" />
          <p>{user.displayName}</p>
        </div>
      )}
    </div>
  );
}
