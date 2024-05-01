import { useDispatch } from "react-redux";
import { chatActions } from "../../redux/ChatSlice";
import { uiActions } from "../../redux/uiSlice";

export default function ForwardMessage({ message }) {
  const dispatch = useDispatch();

  const ForwardHandler = async () => {
    dispatch(uiActions.setForwardList(true));
    dispatch(chatActions.setForwardingMessage(message));
  };

  return <div onClick={() => ForwardHandler()}>Forward Message</div>;
}
