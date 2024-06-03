import React, { Fragment, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../../images/defaultUser.png";
import { uiActions } from "../../../redux/uiSlice";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function Header() {
  const [chosenUser, setChosenUser] = useState();
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const displayName = user && user?.value.displayName;
  const dispatch = useDispatch();

  useEffect(() => {
    const FetchUserData = async () => {
      if(user.type === 'user'){
        await getDoc(doc(db, "users", user.value.uid)).then((res) => {
          setChosenUser(res.data());
        });
      };

      if(user.type === 'group'){
        setChosenUser(user.value)
      }

    }
    user?.value.uid && FetchUserData();
  }, [user,currentUser.uid]);

  return (
    <Fragment>
      <div
        className="header"
        onClick={() => dispatch(uiActions.setAbout(true))}
      >
        <img src={chosenUser?.photoURL ? chosenUser?.photoURL : defaultUser} alt="" />
        <div>
          <p>{displayName}</p>
          <p>Online</p>
        </div>
        <IoMdSearch className="btn" />
        <CiMenuKebab className="btn" />
      </div>
    </Fragment>
  );
}
