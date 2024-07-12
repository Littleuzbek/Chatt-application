import { auth } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import defaultUser from "../../../images/defaultUser.png";
import defaultUsers from "../../../images/defaultUsers.jpg";
import Media from "./MediaMessage/Media";
import Files from "./MediaMessage/Files";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../../redux/ChatSlice";

export default function Message({ message, onContextMenu }) {
  const [imgError, setImgError] = useState(false);
  const currentUser = auth.currentUser;
  const owner = message.senderId === currentUser?.uid;
  const user = useSelector((state) => state.chat.user);
  const searchResult = useSelector((state) => state.chat.searchResult);
  const ref = useRef();
  const contextRef = useRef()
  const dispatch = useDispatch();

  const style = owner
    ? {
        borderRadius: "0px 10px 10px 10px",
        backgroundColor: "grey",
        color: "white",
      }
    : { borderRadius: "10px 0px 10px 10px" };

  useEffect(() => {
    const text = document.getElementsByName(searchResult[0]?.text);

    if (searchResult) {
      text[0]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [searchResult]);

  useEffect(() => {
    ref.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [ref]);

  const touchContextMenu = (cmd,e)=>{
    if(cmd === 'start'){
      contextRef.current = setInterval(() => {
        onContextMenu(e, message);
        dispatch(chatActions.setHeaderMenu(false))
      }, 1000);
    }

    if(cmd === 'stop'){
      clearInterval(contextRef.current)
    }
}
  
  return (
    <div
    className={
      user.type === "channel"
      ? "message owner"
      : `message ${owner && "owner"}`
    }
    ref={ref}
    name={message?.text}  
    onClick={()=>dispatch(chatActions.setHeaderMenu(false))}  
    onTouchStart={(e)=>{
      touchContextMenu('start', e)
    }}
    onTouchEnd={(e)=>{
      touchContextMenu('stop')
    }}
    onTouchCancel={(e)=>{
      touchContextMenu('stop')
    }}
    >
      <img
        src={
          imgError
            ? user.type === "channel"
              ? defaultUsers
              : defaultUser
            : user.type === "channel"
            ? user?.value?.photoURL
            : message?.senderId === currentUser?.uid
            ? currentUser?.photoURL || defaultUser
            : message?.senderPic || defaultUser
        }
        alt=""
        onError={() => {
          setImgError(true);
        }}
      />
      <div
        style={owner ? { flexDirection: "row" } : {}}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, message)
          dispatch(chatActions.setHeaderMenu(false))
        }}
          
      >
        {message?.img || message?.video ? (
          <Media src={message} />
        ) : message?.files ? (
          <Files owner={owner} files={message?.files} />
        ) : (
          <p style={style}>{message?.text}</p>
        )}
      </div>
    </div>
  );
}
