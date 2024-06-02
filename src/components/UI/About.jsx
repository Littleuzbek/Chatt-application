import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import "./About.css";
import { db } from "../../firebase";
import { FaAngleDown } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import { doc, getDoc } from "firebase/firestore";
import Files from "../profile/chatSection/MediaMessage/Files";
import { chatActions } from "../../redux/ChatSlice";

export default function About() {
  const [chosenUser, setChosenUser] = useState();
  const [media, setMedia] = useState();
  const [section, setSection] = useState("img");
  const [toggleSection, setToggleSection] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chat.user);
  const chatId = useSelector((state) => state.chat.chatId);

  useEffect(() => {
    const FetchUserData = async () => {
      if(user.type === 'user'){
        await getDoc(doc(db, "users", user.value.uid)).then((res) => {
          setChosenUser(res.data());
        });
        
        await getDoc(doc(db, "chats", chatId)).then((res) => {
          setMedia(res.data()?.messages);
        });
      }

      if(user.type === 'group'){
        setChosenUser(user.value)
      }
    };

    user?.value.uid && FetchUserData();
  }, [user, chatId]);

  const ViewContentHandler = (e, type, header) => {
    if (!header) {
      dispatch(chatActions.setViewContentValue(e.target.currentSrc));
    } else {
      dispatch(chatActions.setViewContentValue(e));
    }

    if (document.pictureInPictureElement) {
      document?.exitPictureInPicture();
      dispatch(uiActions.setViewContent(false));
    }

    if (type === "img") {
      dispatch(chatActions.setContentType("Image"));
    }
    if (type === "video") {
      dispatch(chatActions.setContentType("Video"));
    }

    setTimeout(() => {
      dispatch(uiActions.setViewContent(true));
    }, 100);
  };

  return (
    <Fragment>
      <div
        className="aboutChosenUser"
        onClick={() => dispatch(uiActions.setAbout(false))}
      >
        <div className="chosenUserInfo" onClick={(e) => e.stopPropagation()}>
          <div>
            <img
              src={chosenUser?.photoURL}
              alt=""
              onClick={() =>
                ViewContentHandler(chosenUser?.photoURL, "img", "header")
              }
            />
          </div>
          {toggleSection || (
            <div className="infO">
              <div>
                <p>Name</p>
                <p>{user?.value.displayName ? user?.value.displayName : "..."}</p>
              </div>
              {user.type === 'group'?
              ''
              :
                <div>
                <p>Username</p>
                <p>{chosenUser?.username ? chosenUser?.username : "..."}</p>
              </div>
              }
              {user.type === 'group'?
              ''
              :
              <div>
                <p>About</p>
                <p>{chosenUser?.about ? chosenUser?.about : "..."}</p>
              </div>
              }
              <FaAngleDown
                className="toMedia"
                onClick={() => setToggleSection(true)}
              />
            </div>
          )}
          {toggleSection && (
            <div className="mediA">
              <FaAngleDown
                className="toInfo"
                onClick={() => setToggleSection(false)}
              />
              <div className="sectioN">
                <div
                  onClick={() => setSection("img")}
                  style={
                    section === "img"
                      ? { backgroundColor: "black", color: "white" }
                      : {}
                  }
                >
                  Photos
                </div>
                <div
                  onClick={() => setSection("video")}
                  style={
                    section === "video"
                      ? { backgroundColor: "black", color: "white" }
                      : {}
                  }
                >
                  Videos
                </div>
                <div
                  onClick={() => setSection("files")}
                  style={
                    section === "files"
                      ? { backgroundColor: "black", color: "white" }
                      : {}
                  }
                >
                  Files
                </div>
              </div>
              <div className="itemS">
                {section === "img"
                  ? media?.map(
                      (m) =>
                        m?.img && (
                          <img
                            src={m?.img}
                            alt=""
                            id={m?.id}
                            onClick={(e) => ViewContentHandler(e, "img")}
                          />
                        )
                    )
                  : ""}
                {section === "video"
                  ? media?.map(
                      (m) =>
                        m?.video && (
                          <video
                            src={m?.video}
                            id={m?.id}
                            onClick={(e) => ViewContentHandler(e, "video")}
                          ></video>
                        )
                    )
                  : ""}
                {section === "files"
                  ? media?.map(
                      (m) => m?.files && <Files files={m?.files} id={m?.id} />
                    )
                  : ""}
              </div>
            </div>
          )}
          <CgClose
            className="closeAbout"
            onClick={() => dispatch(uiActions.setAbout(false))}
          />
        </div>
      </div>
    </Fragment>
  );
}
