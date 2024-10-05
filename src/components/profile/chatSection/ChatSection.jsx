import "./ChatSection.css";
import "./ChatSectionNight.css";
import "./ChatSectionMini.css";
import Input from "./Input";
import Messages from "./Messages";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { uiActions } from "../../../redux/uiSlice";
import { chatActions } from "../../../redux/ChatSlice";

export default function ChatSection() {
  const [progress, setProgress] = useState(null);
  const [wallPaper, setWallPaper] = useState();
  const currentUser = auth.currentUser;
  const user = useSelector((state) => state.chat.user);
  const chatThemeValue = useSelector((state) => state.menu.chatThemeValue);
  const selected = useSelector((state) => state.chat.selected);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallPaperInUse = async () => {
      await getDoc(doc(db, "usersWallpapers", currentUser?.uid)).then((res) => {
        if (res?.data()) {
          setWallPaper(res?.data());
        }
      });
    };

    currentUser.uid && fetchWallPaperInUse();
  }, [chatThemeValue, currentUser.uid]);

  const closeContextMenu = () =>{
    dispatch(uiActions.setClickValue({
      type: 'message',
      value: false
    }))
    dispatch(uiActions.setClickValue({
      type: 'list',
      value: false
    }))
    dispatch(chatActions.setHeaderMenu(false))
  }

  return (
    <div
      className={selected? 'chatSection' : "noChatSection"}
      style={{
        backgroundImage: `url(${
          chatThemeValue === "" ? wallPaper?.inUse : chatThemeValue
        })`,
      }}
      onClick={()=>closeContextMenu()}
    >
      {user && (
        <>
          <Header />
          <div className="body" onScroll={()=>{closeContextMenu()}}>
            <Messages progressVal={progress} onProgress={setProgress} />
          </div>
          {user?.type === "channel" ? (
            user?.value?.admin === currentUser?.uid && (
              <Input onProgress={setProgress} />
            )
          ) : (
            <Input onProgress={setProgress} />
          )}
        </>
      )}
    </div>
  );
}
