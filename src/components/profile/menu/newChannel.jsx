import { Fragment, useEffect, useRef, useState } from "react";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import Backdrop from "../../UI/Backdrop";
import defaultUser from "../../../images/defaultUser.png";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { LuImagePlus } from "react-icons/lu";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function ForwardList() {
  const [chats, setChats] = useState([]);
  const [channelImg, setChannelImg] = useState(false);
  const [imgFile, setImgFile] = useState();
  const newChannelMembers = useSelector(
    (state) => state.menu.newChannelMembers
  );
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  const name = useRef();
  const link = useRef();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.data()) {
          setChats(doc.data());
        }
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const newMemberHandler = (e, type) => {
    try {
      if (type === "add") {
        dispatch(
          menuActions.onSetNewChannelMembers({
            type: "add",
            value: e[1]?.userInfo,
          })
        );
      }

      if (type === "remove") {
        dispatch(
          menuActions.onSetNewChannelMembers({
            type: "remove",
            value: e,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const channelImgHandler = (e) => {
    const imgURL = URL.createObjectURL(e);

    setImgFile(e);
    setChannelImg(imgURL);
  };

  const createChannel = async () => {
    const channelId = uuid();
    const channelName = name.current.value;
    const storageRef = ref(storage, uuid());
    try {
      await uploadBytesResumable(storageRef, imgFile).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (res) => {
          await updateDoc(doc(db, "userChannels", currentUser.uid), {
            [channelId + ".channelInfo"]: {
              uid: channelId,
              displayName: channelName,
              photoURL: res,
              admin: currentUser.uid,
              about: "",
              linkName: link.current.value,
            },
            [channelId + ".members"]: [
              ...newChannelMembers,
              {
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                admin: currentUser.uid,
              },
            ],
            [channelId + ".lastMessage"]: {
              text: "",
            },
            [channelId + ".date"]: serverTimestamp(),
          }).then(async () => {
            dispatch(menuActions.onSetNewChannel(false));
            for (let i = 0; i < newChannelMembers.length; i++) {
              await updateDoc(
                doc(db, "userChannels", newChannelMembers[i].uid),
                {
                  [channelId + ".channelInfo"]: {
                    uid: channelId,
                    displayName: channelName,
                    photoURL: res,
                    admin: [currentUser.uid],
                    about: "",
                    linkName: link.current.value,
                  },
                  [channelId + ".members"]: [
                    ...newChannelMembers,
                    {
                      displayName: currentUser.displayName,
                      photoURL: currentUser.photoURL,
                      uid: currentUser.uid,
                      admin: currentUser.uid,
                    },
                  ],
                  [channelId + ".lastMessage"]: {
                    text: "",
                  },
                  [channelId + ".date"]: serverTimestamp(),
                }
                ).catch((err) => console.log(err));
              }
              await setDoc(doc(db, "chats", channelId));
          });

        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Fragment>
      <Backdrop />
      <div className="newGroupList">
        <div>
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <div
                className="newGroupUser"
                key={chat?.[0]}
                onClick={() => newMemberHandler(chat, "add")}
              >
                <img
                  src={
                    chat[1]?.userInfo?.photoURL
                      ? chat[1]?.userInfo?.photoURL
                      : defaultUser
                  }
                  alt=""
                />
                <div className="newGroupUserName">
                  <p>{chat[1]?.userInfo?.displayName}</p>
                  <p>Online</p>
                </div>
              </div>
            ))}
        </div>
        <div className="chosenMembers">
          <p>Chosen Users</p>
          {newChannelMembers !== "" &&
            newChannelMembers.map((newMember) => (
              <div className="newGroupUser" key={newMember?.uid}>
                <img
                  src={newMember?.photoURL ? newMember?.photoURL : defaultUser}
                  alt=""
                />
                <div className="newGroupUserName">
                  <p>{newMember?.displayName}</p>
                  <p>Online</p>
                </div>
                <CgClose
                  className="removeNewMember"
                  onClick={() => newMemberHandler(newMember, "remove")}
                />
              </div>
            ))}
        </div>
        <div className="newChannelDetails">
          <p>Details</p>

          <div className="newChannelPictureContainer">
            <p>Channel picture</p>
            <img src={channelImg ? channelImg : ""} alt="" accept="image/*" />
            <input
              type="file"
              name=""
              id="newChannelImg"
              onChange={(e) => {
                if(e.target.files[0].type.split('/').at(0) === 'image'){
                  channelImgHandler(e.target.files[0])
                }
              }}
            />
            <label htmlFor="newChannelImg">
              Upload Picture
              <LuImagePlus />
            </label>
          </div>

          <div className="newChannelNaming">
            <p>Channel Name</p>
            <input
              type="email"
              name=""
              id=""
              ref={name}
              required
              title="Please fill out requirements"
            />

            <p>Channel Link Name</p>
            <input
              type="text"
              name=""
              id=""
              ref={link}
              placeholder='example: "Stars"'
              required
              title="Please fill out requirements"
            />
          </div>

          <div className="newChannelBtn">
            <button
              onClick={() => {
                dispatch(menuActions.onSetNewChannel(false));
                dispatch(menuActions.onSetNewChannelMembers("clear"));
              }}
            >
              Cancel
            </button>
            <button
              style={
                newChannelMembers.length === 0
                  ? { backgroundColor: "white" }
                  : {
                      backgroundColor: "black",
                      color: "white",
                      cursor: "pointer",
                    }
              }
              onClick={() => {
                name.current.value !== "" &&
                  link.current.value !== "" &&
                  createChannel();
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
