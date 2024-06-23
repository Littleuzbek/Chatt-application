import React, { Fragment, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { GiQueenCrown } from "react-icons/gi";
import defaultUser from "../../../images/defaultUser.png";
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { GrStatusGood } from "react-icons/gr";
import { FiMinusCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { arrayRemove, deleteField, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function AboutChannel({
  toggleMemberVal,
  onSetToggleMember,
  chosenUserVal,
}) {
  const [changeName, setChangeName] = useState(false);
  const [changeAbout, setChangeAbout] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const nameText = useRef();
  const aboutText = useRef();
  const currentUser = auth.currentUser;
  const areYouAdmin = chosenUserVal?.channelInfo?.admin === currentUser.uid;

  const aboutChangeHandler = async () => {
    const channelId = user.value.uid;

    if (aboutText?.current?.value !== "") {
      setLoadingAbout(true);
      for (let i = 0; i < user.members.length; i++) {
        await updateDoc(doc(db, "userChannels", user.members[i].uid), {
          [channelId + ".channelInfo"]: {
            about: aboutText?.current?.value,
            admin: user.value.admin,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            uid: channelId,
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
    const channelId = user.value.uid;

    if (nameText?.current?.value !== "") {
      setLoadingName(true);
      for (let i = 0; i < user.members.length; i++) {
        await updateDoc(doc(db, "userChannels", user.members[i].uid), {
          [channelId + ".channelInfo"]: {
            about: user.value.about,
            admin: user.value.admin,
            displayName: nameText?.current?.value,
            photoURL: user.value.photoURL,
            uid: channelId,
          },
        });
      }

      setLoadingName(false);
      setChangeName(false);
    } else {
      setChangeName(false);
    }
  };

  const deleteFromMembers = async (deletingUser) => {
    const channelId = user?.value?.uid;

    for (let i = 0; i < user?.members?.length; i++) {
      if (deletingUser?.uid !== user?.members[i]?.uid) {
        await updateDoc(doc(db, "userChannels", user?.members[i]?.uid), {
          [channelId + ".members"]: arrayRemove({
            displayName: deletingUser.displayName,
            photoURL: deletingUser.photoURL,
            uid: deletingUser.uid,
          })
        });
      } else {
        console.log('no');
        await updateDoc(doc(db, "userChannels", user?.members[i]?.uid), {
          [channelId]: deleteField(channelId),
        });
      }
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
              {chosenUserVal?.channelInfo?.displayName
                ? chosenUserVal?.channelInfo?.displayName
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
            {chosenUserVal?.members
              ? chosenUserVal?.members?.length
              : user.members.length}
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
            <div className="member" key={member?.uid}>
              <img
                src={member?.photoURL ? member?.photoURL : defaultUser}
                alt=""
              />
              {user?.value?.admin === member?.uid ? (
                <p>
                  {member?.displayName}
                  <GiQueenCrown className="actioN" />
                </p>
              ) : (
                <p>
                  {member?.displayName}
                  {areYouAdmin && <FiMinusCircle
                    className="actioN"
                    onClick={() => deleteFromMembers(member)}
                  />}
                </p>
              )}
            </div>
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
              {chosenUserVal?.channelInfo?.about
                ? chosenUserVal?.channelInfo?.about
                : "..."}{" "}
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
