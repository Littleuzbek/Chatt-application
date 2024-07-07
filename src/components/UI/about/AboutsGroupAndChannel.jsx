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
  const [changeLinkName, setChangeLinkName] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingLinkName, setLoadingLinkName] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const nightMode = useSelector((state) => state.menu.nightMode);
  const nameText = useRef();
  const linkName = useRef();
  const currentUser = auth.currentUser;
  const areYouAdmin =
    (chosenUserVal?.groupInfo?.admin || chosenUserVal?.channelInfo?.admin) ===
    currentUser.uid;

  const linkNameChangeHandler = async () => {
    const documentID = user.value.uid;
    const members = existingMembers ? existingMembers : user.members;
    const collection = user.type === "group" ? "userGroups" : "userChannels";
    const infoType = user.type === "group" ? "groupInfo" : "channelInfo";
    const linkNameInLowerCase = linkName?.current?.value.toLowerCase();

    if (linkName?.current?.value !== "") {
      setLoadingLinkName(true);
      for (let i = 0; i < members.length; i++) {
        await updateDoc(doc(db, collection, members[i].uid), {
          [documentID + `.${infoType}`]: {
            linkName: linkNameInLowerCase,
            admin: user.value.admin,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            uid: documentID,
          },
        });
      }

      setLoadingLinkName(false);
      setChangeLinkName(false);
    } else {
      setChangeLinkName(false);
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
            linkName: user.value.linkName,
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
      <div className={nightMode? 'aboutNameNight' : "aboutName"}>
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
      <div className={nightMode? 'aboutLinkNameNight' : "aboutLinkName"}>
        <div>
          <p>{user.type === 'group'? 'About' : 'Linkname'}</p>
          {changeLinkName ? (
            <input type="text" ref={linkName} />
          ) : (
            <p>
              {chosenUserVal?.groupInfo?.about ||
              chosenUserVal?.channelInfo?.linkName
                ? chosenUserVal?.groupInfo?.about ||
                  chosenUserVal?.channelInfo?.linkName
                : "..."}
            </p>
          )}
        </div>
        {areYouAdmin && (
          <div className="changeAboutBtn">
            {changeLinkName ? (
              loadingLinkName ? (
                <AiOutlineLoading className="loader" />
              ) : (
                <GrStatusGood
                  className="icoN"
                  onClick={() => linkNameChangeHandler()}
                />
              )
            ) : (
              <FaPencil className="icoN" onClick={() => setChangeLinkName(true)} />
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
}
