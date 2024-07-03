import React, { Fragment, useState } from "react";
import { FiMinusCircle } from "react-icons/fi";
import { GiQueenCrown } from "react-icons/gi";
import { AiOutlineLoading } from "react-icons/ai";
import defaultUser from "../../../images/defaultUser.png";
import { useSelector } from "react-redux";
import { arrayRemove, deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function AboutMembers({ existingMembers, areYouAdmin, member }) {
  const user = useSelector((state) => state.chat.user);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const deleteFromMembers = async (deletingUser) => {
    try {
      setDeleteLoader(true);
      const documentID = user?.value?.uid;
      const members = existingMembers ? existingMembers : user.members;
      const collection = user.type === "group" ? "userGroups" : "userChannels";

      for (let i = 0; i < members?.length; i++) {
        if (deletingUser?.uid !== members[i]?.uid) {
          await updateDoc(doc(db, collection, members[i]?.uid), {
            [documentID + ".members"]: arrayRemove({
              displayName: deletingUser.displayName,
              photoURL: deletingUser.photoURL,
              uid: deletingUser.uid,
            }),
          });
        } else {
          await updateDoc(doc(db, collection, deletingUser.uid), {
            [documentID]: deleteField(documentID),
          });
        }
      }
      setDeleteLoader(false);
    } catch (err) {
      console.log(err);
      setDeleteLoader(false);
    }
  };

  return (
    <Fragment>
      <div className="member" key={member?.uid}>
        <img src={member?.photoURL ? member?.photoURL : defaultUser} alt="" />
        {user?.value?.admin === member?.uid ? (
          <p>
            {member?.displayName}
            <GiQueenCrown className="actioN" style={{ animation: "none" }} />
          </p>
        ) : (
          <p>
            {member?.displayName}
            {areYouAdmin && (deleteLoader ? (
              <AiOutlineLoading
                style={{ animation: "spinn .5s linear infinite" }}
              />
            ) : (
              <FiMinusCircle
                className="actioN"
                onClick={() => deleteFromMembers(member)}
              />
            ))}
          </p>
        )}
      </div>
    </Fragment>
  );
}
