import { auth } from "../../../firebase";
import { useEffect, useRef } from "react";
import defaultUser from "../../../images/defaultUser.png";
import Media from "./MediaMessage/Media";
import Files from "./MediaMessage/Files";
import { useSelector } from "react-redux";

export default function Message({ message, onContextMenu }) {
  const currentUser = auth.currentUser;
  const owner = message.senderId === currentUser?.uid;
  const searchResult = useSelector((state) => state.chat.searchResult);
  const ref = useRef();

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

  return (
    <div
      className={`message ${owner && "owner"}`}
      ref={ref}
      name={message?.text}
    >
      <img
        src={
          message?.senderId === currentUser?.uid
            ? currentUser?.photoURL || defaultUser
            : message?.senderPic || defaultUser
        }
        alt=""
      />
      <div
        style={owner ? { flexDirection: "row" } : {}}
        onContextMenu={(e) => onContextMenu(e, message)}
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
