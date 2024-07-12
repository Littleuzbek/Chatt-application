import { useDispatch } from "react-redux";
import { chatActions } from "../../../redux/ChatSlice";
import { uiActions } from "../../../redux/uiSlice";


export default function DeleteUserFromList({ selectedUser }) {
  const dispatch = useDispatch();
  const DeleteChat = () => {
    dispatch(uiActions.setDoubleDelete(true));
    dispatch(chatActions.setDeletingChat(selectedUser));
    dispatch(
      uiActions.setClickValue({
        type: "list",
        value: false,
      }))
  };

  return <div onClick={() => DeleteChat()}>Delete chat</div>;
}
