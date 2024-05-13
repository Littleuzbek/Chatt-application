import { GrEmoji } from "react-icons/gr";
import { GoPaperclip } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import BeforeSend from "./BeforeSend";

export default function Input({ onProgress }) {
  const chatId = useSelector((state) => state.chat.chatId);
  const user = useSelector((state) => state.chat.user);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [beforeSend, setBeforeSend] = useState(false);

  const currentUser = auth.currentUser;

  const UpdateUserListMessage = async(text)=>{
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
      [chatId + ".userInfo"]: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      },
    });
  }

  const handler = (e) => {
    if (text !== "" || img) {
      if (e === "Enter" || e === "NumpadEnter" || e === "click") {
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (img) {
      setBeforeSend(true);
    }
  }, [img]);

  const handleSend = async () => {
    setText("");

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      setImg(null);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
          }
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: "Photo",
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              }).catch(err=>console.log(err));
            }
          );
          UpdateUserListMessage('Photo')
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      }).catch(err=>{console.log(err);});
      UpdateUserListMessage(text)
    }
    setText("");
  };
  return (
    <div className="sendMessage">
        <div>
          <GrEmoji className="emoji" />
          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={(e) => handler(e.code)}
          />
          <input
            type="file"
            name=""
            id="fileRecieve"
            style={{ display: "none" }}
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
            value={""}
            accept="image/*"
          />
          <label htmlFor="fileRecieve">
            <GoPaperclip className="clip" />
          </label>
          <IoSend className="send" onClick={(e) => handler(e.type)} />
        </div>
      {beforeSend && (
        <BeforeSend
          beforeSendImg={img}
          onSetBeforeSend={setBeforeSend}
          onSendImg={handleSend}
          onClearBeforeSend={setImg}
        />
      )}
    </div>
  );
}
