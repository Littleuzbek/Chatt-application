import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { useEffect, useRef } from "react";
import defaultUser from "../../../images/defaultUser.png";
import Media from "./MediaMessage/Media";

export default function Message({ message, onContextMenu }) {
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const owner = message.senderId === currentUser?.uid;
  const ref = useRef();

  const style = owner
    ? {
        borderRadius: "10px 10px 10px 0px",
        backgroundColor: "grey",
        color: "white",
      }
    : { borderRadius: "10px 10px 0px 10px" };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={`message ${owner && "owner"}`} ref={ref}>
      <img
        src={
          message?.senderId === currentUser?.uid
            ? (currentUser?.photoURL || defaultUser)
            : (user?.photoURL || defaultUser)
        }
        alt=""
      />
      <div style={owner ? { flexDirection: "row" } : {}} onContextMenu={(e)=>onContextMenu(e, message)}>
        {(message?.img || message?.video) ? (
          <Media src={message}/>
        ) : (
          <p style={style}>{message?.text}</p>
        )}
      </div>
    </div>
  );
}
