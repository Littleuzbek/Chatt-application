import { GrEmoji } from "react-icons/gr";
import { GoPaperclip } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import BeforeSend from "./BeforeSend";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
import {chatActions} from '../../../redux/ChatSlice'

export default function Input({ onProgress }) {
  const chatId = useSelector((state) => state.chat.chatId);
  const user = useSelector((state) => state.chat.user);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [beforeSend, setBeforeSend] = useState(false);
  const [emojiBox, setEmojiBox] = useState(false);
  const currentUser = auth.currentUser;
  const ID = user.type === "user" ? chatId : user.value.uid;
  const timeOff = useRef();
  const dispatch = useDispatch()

  const UpdateUserListMessage = async (text) => {
      const collection = user?.type === 'group' ? 'userGroups' : 'userChannels';
      
      if (user?.type === "user") {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [ID + ".lastMessage"]: {
            text,
          },
          [ID + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user?.value?.uid), {
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
    
    if (user.type === "group" || user.type === 'channel') {
      await updateDoc(doc(db, collection, currentUser.uid), {
        [ID + ".lastMessage"]: {
          text,
        },
        [ID + ".date"]: serverTimestamp(),
      });
      
      for (let i = 0; i < user?.members?.length; i++) {
        try{
          await updateDoc(doc(db, collection, user.members[i].uid), {
            [ID + ".lastMessage"]: {
              text,
            },
            [ID + ".date"]: serverTimestamp(),
          });
        }catch(err){
          console.log();
      }
      }
    }
  };

  const handler = (e) => {
    if (text !== "" || media) {
      if (e === "Enter" || e === "NumpadEnter" || e === "click") {
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (media) {
      setBeforeSend(true);
    }
  }, [media]);

  const handleSend = async () => {
    const sourceType = media?.type.split("/");
    setText("");

    if (media) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, media);
      setMedia(null);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
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
              if (sourceType[0] === "image") {
                await updateDoc(doc(db, "chats", ID), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: "Photo",
                    senderPic: currentUser.photoURL,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                })
                  .then(() => UpdateUserListMessage("Photo"))
                  .catch((err) => console.log(err));
              }
              if (sourceType[0] === "video") {
                await updateDoc(doc(db, "chats", ID), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: "Video",
                    senderPic: currentUser.photoURL,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    video: downloadURL,
                  }),
                })
                  .then(() => UpdateUserListMessage("Video"))
                  .catch((err) => console.log(err));
              }
              if (sourceType.at(-1) === "pdf") {
                await updateDoc(doc(db, "chats", ID), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: "PDF file",
                    senderPic: currentUser.photoURL,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    files: {
                      nameOf: media?.name,
                      fileURL: downloadURL,
                    },
                  }),
                })
                  .then(() => UpdateUserListMessage("PDF file"))
                  .catch((err) => console.log(err));
              }
            }
          );
          UpdateUserListMessage("Photo");
        }
      );
    } else {
      await updateDoc(doc(db, "chats", ID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderPic: currentUser.photoURL,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      }).catch((err) => {
        console.log(err);
      });
      UpdateUserListMessage(text);
    }
    setText("");
  };

  const emojiHandler = (key) => {
    setEmojiBox(true);
    clearTimeout(timeOff.current);

    if (key !== "on") {
      if (key !== "mouseIn") {
        timeOff.current = setTimeout(() => {
          setEmojiBox(false);
        }, 300);
      }

      if (key === "mouseOut") {
        setEmojiBox(false);
      }
    }
  };

  // const uploadPic = async()=>{
  //   const sourceType = media?.type.split("/");
  //   const storageRef = ref(storage, uuid());
  //     const uploadTask = uploadBytesResumable(storageRef, media);
  //     setMedia(null);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         onProgress(progress);
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;

  //           default:
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //       async () => {
  //         await getDownloadURL(uploadTask.snapshot.ref).then(
  //           async (downloadURL) => {
  //             if (sourceType[0] === "image") {
  //               console.log(downloadURL);
  //               console.log(sourceType[0]);
  //               await updateDoc(doc(db, "defaultData", 'defaultWallpapers'), {
  //                 wallpapers: arrayUnion({
  //                   id: uuid(),
  //                   wallPaperURL: downloadURL,
  //                 }),
  //               })
  //                 .catch((err) => console.log(err));
  //               }
  //             }
  //           );
  //         }
  //       );
  // }
  return (
    <div className="sendMessage" onFocus={()=>dispatch(chatActions.setHeaderMenu(false))}>
      <div>
        <GrEmoji
          className="emojI"
          onMouseEnter={() => {
            emojiHandler("on");
          }}
          onMouseLeave={() => {
            emojiHandler('off');
          }}
        />
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
            setMedia(e.target.files[0]);
          }}
          value={""}
          accept="video/*,image/*,application/pdf"
        />
        <label htmlFor="fileRecieve">
          <GoPaperclip className="clip" />
        </label>
        <IoSend className="send" onClick={(e) => handler(e.type)} />
      </div>
      {beforeSend && (
        <BeforeSend
          beforeSendValue={media}
          onSetBeforeSend={setBeforeSend}
          onSend={handleSend}
          onClearBeforeSendValue={setMedia}
        />
      )}
      {emojiBox && (
        <div
          className="emojiBox"
          onMouseEnter={() => {
            emojiHandler("mouseIn");
          }}
          onMouseLeave={() => {
            emojiHandler("mouseOut");
          }}
        >
          <EmojiPicker
            height={350}
            onEmojiClick={(e) => setText((prevEmoji) => prevEmoji + e?.emoji)}
            emojiStyle={EmojiStyle.NATIVE}
          />
        </div>
      )}
    </div>
  );
}
