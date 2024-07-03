import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../../redux/ChatSlice";
import { uiActions } from "../../../redux/uiSlice";

export default function ForwardMessage({ message }) {
  const user = useSelector((state) => state.chat.user);
  const dispatch = useDispatch();

  const ForwardHandler = async () => {
    dispatch(uiActions.setForwardList(true));
    dispatch(chatActions.setForwardingMessage(message));
  };

  return <div onClick={() => ForwardHandler()} style={user?.type === 'channel' ? {color: 'black'} : {}} >Forward Message</div>;
}
