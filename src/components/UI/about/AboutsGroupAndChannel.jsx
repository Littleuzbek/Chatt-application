import React, { Fragment, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { GrStatusGood } from "react-icons/gr";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import AboutMembers from "./AboutMembers";

export default function AboutGroup({
  toggleMemberVal,
  onSetToggleMember,
  chosenUserVal,
  existingMembers,
}) {
  const [changeName, setChangeName] = useState(false);
  const [changeAbout, setChangeAbout] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const nameText = useRef();
  const aboutText = useRef();
  const currentUser = auth.currentUser;
  const areYouAdmin =
    (chosenUserVal?.groupInfo?.admin || chosenUserVal?.channelInfo?.admin) ===
    currentUser.uid;

  const aboutChangeHandler = async () => {
    const documentID = user.value.uid;
    const members = existingMembers ? existingMembers : user.members;
    const collection = user.type === "group" ? "userGroups" : "userChannels";
    const infoType = user.type === "group" ? "groupInfo" : "channelInfo";

    if (aboutText?.current?.value !== "") {
      setLoadingAbout(true);
      for (let i = 0; i < members.length; i++) {
        await updateDoc(doc(db, collection, members[i].uid), {
          [documentID + `.${infoType}`]: {
            about: aboutText?.current?.value,
            admin: user.value.admin,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            uid: documentID,
          },
        });
      }

      setLoadingAbout(false);
      setChangeAbout(false);
    } else {
      setChangeAbout(false);
    }
  };

  const nameChangeHandler = async () => {
    const documentID = user.value.uid;
    const members = existingMembers ? existingMembers : user.members;
    const collection = user.type === "group" ? "userGroups" : "userChannels";
    const infoType = user.type === "group" ? "groupInfo" : "channelInfo";

    if (nameText?.current?.value !== "") {
      setLoadingName(true);
      for (let i = 0; i < members.length; i++) {
        await updateDoc(doc(db, collection, members[i].uid), {
          [documentID + `.${infoType}`]: {
            about: user.value.about,
            admin: user.value.admin,
            displayName: nameText?.current?.value,
            photoURL: user.value.photoURL,
            uid: documentID,
          },
        });
      }

      setLoadingName(false);
      setChangeName(false);
    } else {
      setChangeName(false);
    }
  };

  return (
    <Fragment>
      <div className="aboutName">
        <div>
          <p>Name</p>
          {changeName ? (
            <input type="text" ref={nameText} />
          ) : (
            <p>
              {chosenUserVal?.groupInfo?.displayName ||
              chosenUserVal?.channelInfo?.displayName
                ? chosenUserVal?.groupInfo?.displayName ||
                  chosenUserVal?.channelInfo?.displayName
                : user.value.displayName}
            </p>
          )}
        </div>
        {areYouAdmin && (
          <div className="changeAboutBtn">
            {changeName ? (
              loadingName ? (
                <AiOutlineLoading className="loader" />
              ) : (
                <GrStatusGood
                  className="icoN"
                  onClick={() => nameChangeHandler()}
                />
              )
            ) : (
              <FaPencil className="icoN" onClick={() => setChangeName(true)} />
            )}
          </div>
        )}
      </div>
      <div className="aboutMembers">
        <div>
          <p>Members</p>
          <p>
            {existingMembers ? existingMembers?.length : user?.members?.length}
          </p>
        </div>
        {toggleMemberVal ? (
          <FaSortUp className="icoN" onClick={() => onSetToggleMember(false)} />
        ) : (
          <FaSortDown
            className="icoN"
            onClick={() => onSetToggleMember(true)}
          />
        )}
      </div>
      {toggleMemberVal && (
        <div className="membersList">
          {(chosenUserVal || user)?.members.map((member) => (
            <AboutMembers member={member} existingMembers={existingMembers} areYouAdmin={areYouAdmin} key={member?.uid}/>
          ))}
        </div>
      )}
      <div className="aboutAbout">
        <div>
          <p>About</p>
          {changeAbout ? (
            <input type="text" ref={aboutText} />
          ) : (
            <p>
              {chosenUserVal?.groupInfo?.about ||
              chosenUserVal?.channelInfo?.about
                ? chosenUserVal?.groupInfo?.about ||
                  chosenUserVal?.channelInfo?.about
                : "..."}
            </p>
          )}
        </div>
        {areYouAdmin && (
          <div className="changeAboutBtn">
            {changeAbout ? (
              loadingAbout ? (
                <AiOutlineLoading className="loader" />
              ) : (
                <GrStatusGood
                  className="icoN"
                  onClick={() => aboutChangeHandler()}
                />
              )
            ) : (
              <FaPencil className="icoN" onClick={() => setChangeAbout(true)} />
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
}
