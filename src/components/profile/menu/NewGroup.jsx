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
  const [groupImg, setGroupImg] = useState(false);
  const [imgFile, setImgFile] = useState();
  const newMembers = useSelector((state) => state.menu.newMembers);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  const name = useRef();

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
          menuActions.onSetNewMembers({
            type: "add",
            value: e[1]?.userInfo,
          })
        );
      }

      if (type === "remove") {
        dispatch(
          menuActions.onSetNewMembers({
            type: "remove",
            value: e,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const groupImgHandler = (e) => {
    const imgURL = URL.createObjectURL(e);

    setImgFile(e);
    setGroupImg(imgURL);
  };

  const createGroup = async () => {
    const groupId = uuid();
    const groupName = name.current.value;
    const storageRef = ref(storage, uuid());
    try {
      await uploadBytesResumable(storageRef, imgFile).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (res) => {
          await updateDoc(doc(db, "userGroups", currentUser.uid), {
            [groupId + ".groupInfo"]: {
              uid: groupId,
              displayName: groupName,
              photoURL: res,
              admin: currentUser.uid,
              about: ''
            },
            [groupId + ".members"]: [
              ...newMembers,
              {
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                admin: currentUser.uid,
              },
            ],
            [groupId + ".lastMessage"]: {
              text: "",
            },
            [groupId + ".date"]: serverTimestamp(),
          }).then(async () => {
            dispatch(menuActions.onSetNewGroup(false))
            for (let i = 0; i < newMembers.length; i++) {
              await updateDoc(doc(db, "userGroups", newMembers[i].uid), {
                [groupId + ".groupInfo"]: {
                  uid: groupId,
                  displayName: groupName,
                  photoURL: res,
                  admin: currentUser.uid,
                  about: ''
                },
                [groupId + ".members"]: [
                  ...newMembers,
                  {
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                    uid: currentUser.uid,
                    admin: currentUser.uid,
                  },
                ],
                [groupId + ".lastMessage"]: {
                  text: "",
                },
                [groupId + ".date"]: serverTimestamp(),
              })
                .catch((err) => console.log(err));
            }
          });

          await setDoc(doc(db, "chats", groupId), {});
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
          {newMembers !== "" &&
            newMembers.map((newMember) => (
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
        <div className="newGroupDetails">
          <p>Details</p>

          <div>
            <p>Group picture</p>
            <img src={groupImg ? groupImg : ""} alt="" />
            <input
              type="file"
              name=""
              id="newGroupImg"
              onChange={(e) => groupImgHandler(e.target.files[0])}
            />
            <label htmlFor="newGroupImg">
              Upload Picture
              <LuImagePlus />
            </label>
          </div>

          <div>
            <p>Group name</p>
            <input type="text" name="" id="" ref={name} />
          </div>

          <button
            style={
              newMembers.length === 0
                ? { backgroundColor: "white" }
                : {
                    backgroundColor: "black",
                    color: "white",
                    cursor: "pointer",
                  }
            }
            onClick={() => createGroup()}
          >
            Create
          </button>
          <button
            onClick={() => {
              dispatch(menuActions.onSetNewGroup(false));
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Fragment>
  );
}
