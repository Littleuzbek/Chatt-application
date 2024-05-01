import "./ChatSection.css";
import Input from "./Input";
import Messages from "./Messages";
import Header from "./Header";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ChatSection() {
  const [progress, setProgress] = useState(null);
  const user = useSelector((state) => state.chat.user);

  return (
    <div className="chatSection">
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
