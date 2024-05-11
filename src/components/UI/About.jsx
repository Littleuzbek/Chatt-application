import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Backdrop from "./Backdrop";
import "./About.css";
import { db } from "../../firebase";
import { FaAngleDown } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import {  doc, getDoc,  } from "firebase/firestore";
import Media from "./Media";

export default function About() {
  const [chosenUser, setChosenUser] = useState();
  const [media,setMedia] = useState();
  const [toggleSection, setToggleSection] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chat.user);
  const chatId = useSelector((state) => state.chat.chatId);

  useEffect(() => {
    const fetchUserData = async () => {
      await getDoc(doc(db, "users", user.uid)).then((res) =>
        setChosenUser(res.data())
      );
    };
      const searchMedia = async() =>{
        await getDoc(doc(db,'chats', chatId)).then(res=>setMedia(res.data()?.messages));
      }

    return () => {
      searchMedia()
      fetchUserData()
    };
  }, [user,chatId]);

  return (
    <Fragment>
      <Backdrop />
      <div
        className="aboutChosenUser"
        onClick={() => dispatch(uiActions.setAbout(false))}
      >
        <div className="chosenUserInfo" onClick={(e) => e.stopPropagation()}>
          <div>
            <img src={chosenUser?.photoURL} alt="" />
          </div>
          {toggleSection || (
            <div className="infO">
              <div>
                <p>Name</p>
                <p>{chosenUser?.displayName ? chosenUser?.displayName : '...'}</p>
              </div>
              <div>
                <p>Username</p>
                <p>{chosenUser?.username ? chosenUser?.username : '...'}</p>
              </div>
              <div>
                <p>About</p>
                <p>{chosenUser?.about ? chosenUser?.about : '...'}</p>
              </div>
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
                <div>Photo</div>
                <div>Video</div>
                <div>Files</div>
              </div>
              <div className="itemS">
                {media?.map((m) =>(
                  <Media src={m}/>
                ))}
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
