import React, { Suspense, lazy } from "react";
import "./Profile.css";
import ListSection from "./listSection/ListSection";
import ChatSection from "./chatSection/ChatSection";
import { useSelector } from "react-redux";
const Menu = lazy(()=>import('./menu/Menu'))
const ViewContent = lazy(()=>import('./chatSection/MediaMessage/ViewContent'))
const ForwardList = lazy(()=>import('../UI/ForwardList'))
const DoubleDelete = lazy(()=>import('../UI/DoubleDelete'))
const About = lazy(()=>import('../UI/about/About'))
const ChatTheme = lazy(()=>import('./menu/ChatTheme'))
const NewGroup = lazy(()=>import('./menu/NewGroup'))
const AddMembers = lazy(()=>import('../UI/addMembers/AddMembers'))
const NewChannel = lazy(()=>import('./menu/newChannel'))

export default function Profile() {
  const backDrop = useSelector((state) => state.ui.backDrop);
  const viewContnet = useSelector((state) => state.ui.viewContent);
  const forwardList = useSelector((state) => state.ui.forwardList);
  const doubleDelete = useSelector((state) => state.ui.doubleDelete);
  const about = useSelector((state) => state.ui.about);
  const chatTheme = useSelector(state=>state.menu.chatTheme)
  const newGroup = useSelector(state=>state.menu.newGroup);
  const newChannel = useSelector(state=>state.menu.newChannel);
  const addMembers = useSelector(state=>state.ui.addMembers);

  return (
    <div className="mainPage">
      {backDrop && <Suspense><Menu /></Suspense>}
      <ListSection />
      <ChatSection />
      {about && <Suspense fallback='...'><About /></Suspense>}
      {viewContnet && <Suspense fallback='...'><ViewContent /></Suspense>}
      {forwardList && <Suspense fallback='...'><ForwardList /></Suspense>}
      {doubleDelete && <Suspense fallback='...'><DoubleDelete /></Suspense>}
      {chatTheme && <Suspense fallback='...'><ChatTheme /></Suspense>}
      {newGroup && <Suspense fallback='...'><NewGroup /></Suspense>}
      {addMembers && <Suspense fallback='...'><AddMembers /></Suspense>}
      {newChannel && <Suspense fallback='...'><NewChannel /></Suspense>}
    </div>
  );
}
