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
import defaultUsers from "../../../images/defaultUsers.jpg";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { LuImagePlus } from "react-icons/lu";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Users from "./Users";
import { uiActions } from "../../../redux/uiSlice";

export default function ForwardList() {
  const [chats, setChats] = useState([]);
  const [channelImg, setChannelImg] = useState(false);
  const [imgFile, setImgFile] = useState();
  const [spinner, setSpinner] = useState(false);
  const newChannelMembers = useSelector(
    (state) => state.menu.newChannelMembers
  );
  const nightMode = useSelector((state) => state.menu.nightMode);
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
        const userExist = newChannelMembers.find(
          (elem) => elem?.uid === e[1]?.userInfo?.uid
        );
        if (userExist) {
          dispatch(
            menuActions.onSetNewChannelMembers({
              type: "remove",
              value: e[1]?.userInfo,
            })
          );
        } else {
          dispatch(
            menuActions.onSetNewChannelMembers({
              type: "add",
              value: e[1]?.userInfo,
            })
          );
        }
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
    setSpinner(true)
    const channelId = uuid();
    const channelName = name.current.value;
    const storageRef = ref(storage, uuid());
    const LinkNameInLowerCase = link?.current?.value.toLowerCase()
    try {
      await setDoc(doc(db, "chats", channelId),{});
      await uploadBytesResumable(storageRef, imgFile).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (res) => {
          await updateDoc(doc(db, "userChannels", currentUser.uid), {
            [channelId + ".channelInfo"]: {
              uid: channelId,
              displayName: channelName === ''? 'Nameless channel' : channelName,
              photoURL: res,
              admin: currentUser.uid,
              linkName: LinkNameInLowerCase,
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
                    displayName: channelName === ''? 'nameless channel' : channelName,
                    photoURL: res,
                    admin: currentUser.uid,
                    linkName: LinkNameInLowerCase || '',
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
              ).then(()=>{
                dispatch(menuActions.onSetNewChannelMembers("clear"));
                setSpinner(false)})
                .catch((err) => console.log(err));
              }
          });
        });
       
      });
    } catch (err) {
      dispatch(menuActions.onSetNewChannelMembers("clear"));
      setSpinner(false)
      console.log(err);
    }
  };
  return (
    <Fragment>
      <Backdrop />
      <div className={nightMode ? "newGroupListNight" : "newGroupList"}>
        <div>
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map(
              (chat) =>
                chat?.[1]?.userInfo && (
                  <Users
                    onNewMemberHandler={newMemberHandler}
                    chatVal={chat}
                    key={chat?.[1]?.userInfo?.uid}
                  />
                )
            )}
        </div>
        <div className="chosenMembers">
          <p>Chosen Users</p>
          {newChannelMembers !== "" &&
            newChannelMembers.map((newMember) => (
              <div
                className={nightMode ? `newGroupUserNight ` : `newGroupUser`}
                key={newMember?.uid}
              >
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
            <img
              src={channelImg ? channelImg : defaultUsers}
              alt=""
              accept="image/*"
              className={channelImg || "miniImg"}
            />
            <input
              type="file"
              name=""
              id="newChannelImg"
              accept="image/*"
              onChange={(e) => {
                if (e?.target?.files[0]?.type.split("/").at(0) !== "image") {
                  dispatch(
                    uiActions.setCondition("Please enter only image file")
                  );
                } else {
                  e?.target?.files[0] && channelImgHandler(e.target.files[0]);
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

          <div className={nightMode? 'newChannelBtnNight' : "newChannelBtn"}>
            <button
              onClick={() => {spinner ||
                dispatch(menuActions.onSetNewChannel(false));
                dispatch(menuActions.onSetNewChannelMembers("clear"));
              }}
            >
              {spinner? 'Waiting' : 'Cancel'}
            </button>
            
            {spinner? 
            <div className="saveORnot">
          <div className="loader"></div>
        </div> 
        : <button
              style={
                newChannelMembers.length === 0
                  ? {}
                  : nightMode
                  ? {
                      backgroundColor: "white",
                      color: "black",
                      cursor: "pointer",
                    }
                  : {
                      backgroundColor: "black",
                      color: "white",
                      cursor: "pointer",
                    }
              }
              onClick={() => {
                  newChannelMembers?.length !== 0 && 
                  createChannel();
              }}
            >
              Create
            </button>}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
