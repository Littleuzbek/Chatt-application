import React from "react";
import "./Profile.css";
import ListSection from "./listSection/ListSection";
import ChatSection from "./chatSection/ChatSection";
import Menu from "./menu/Menu";
import ViewContent from "../UI/ViewContent";
import { useSelector } from "react-redux";
import ForwardList from "../UI/ForwardList";
import DoubleDelete from "../UI/DoubleDelete";
// import Error from '../UI/Error'

export default function Profile() {
  const backDrop = useSelector((state) => state.ui.backDrop);
  const viewContnet = useSelector((state) => state.ui.viewContent);
  const forwardList = useSelector((state) => state.ui.forwardList);
  const doubleDelete = useSelector((state) => state.ui.doubleDelete);

  return (
    <div className="mainPage">
      {backDrop && <Menu />}
      <ListSection />
      <ChatSection />
      {viewContnet && <ViewContent />}
      {/* <Error /> */}
      {forwardList && <ForwardList />}
      {doubleDelete && <DoubleDelete />}
    </div>
  );
}
