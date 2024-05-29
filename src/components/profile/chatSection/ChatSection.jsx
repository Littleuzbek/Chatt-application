import "./ChatSection.css";
import Input from "./Input";
import Messages from "./Messages";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function ChatSection() {
  const [progress, setProgress] = useState(null);
  const [wallPaper,setWallPaper] = useState()
  const currentUser = auth.currentUser;
  const user = useSelector((state) => state.chat.user);
  const chatThemeValue = useSelector(state=>state.menu.chatThemeValue);

  useEffect(()=>{
    const fetchWallPaperInUse = async() =>{
      await getDoc(doc(db,'usersWallpapers',currentUser?.uid))
      .then((res)=>setWallPaper(res?.data()))
    }

    currentUser.uid && fetchWallPaperInUse()
  },[chatThemeValue,currentUser.uid])

  return (
    <div className="chatSection" style={{backgroundImage: `url(${chatThemeValue === '' ? wallPaper?.inUse : chatThemeValue})`}}>
      {user && (
        <>
          <Header />
          <div className="body">
            <Messages progressVal={progress} onProgress={setProgress} />
          </div>
          <Input onProgress={setProgress} />
        </>
      )}
    </div>
  );
}
