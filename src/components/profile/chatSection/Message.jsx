import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { useEffect, useRef } from "react";
import { uiActions } from "../../../redux/uiSlice";
import defaultUser from "../../../images/defaultUser.png";

export default function Message({ message, onContextMenu }) {
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const owner = message.senderId === currentUser?.uid;
  const ref = useRef();
  const dispatch = useDispatch();

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

  const ViewContentHandler = (e) => {
    dispatch(uiActions.setViewContentValue(e.target.currentSrc));
    
    setTimeout(() => {
      dispatch(uiActions.setViewContent(true));
    }, 100);
  };

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
        {message?.img ? (
          <img
            src={message?.img}
            alt=""
            className="imgMessage"
            onClick={(e) => ViewContentHandler(e)}
            // onLoad={(e) => console.log(e)}
          />
        ) : (
          <p style={style}>{message?.text}</p>
        )}
      </div>
    </div>
  );
}
