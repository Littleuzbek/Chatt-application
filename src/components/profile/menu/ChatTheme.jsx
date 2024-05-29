import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { LuImagePlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { auth, db, storage } from "../../../firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

export default function ChatTheme() {
  const chatThemeValue = useSelector((state) => state.menu.chatThemeValue);
  const [wallPapers, setWallPapers] = useState(false);
  const [newWallPaper, setNewWallPaper] = useState(false);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchWallPapers = async () => {
      let arr = [];

      await getDoc(doc(db, "defaultData", "defaultWallpapers")).then((res) => {
        arr.push(res.data()?.wallpapers)
      });

      await getDoc(doc(db, "usersWallpapers", currentUser?.uid)).then((res) => {
        arr.push(res.data()?.wallpapers)
      });

      setWallPapers([...arr.at(0),...arr.at(1)])
    };
    currentUser?.uid && fetchWallPapers();
  }, [currentUser]);

  const UploadWallpaper = async (e) => {
    try {
      const newWallpaper = URL.createObjectURL(e);
      dispatch(menuActions.onSetChatThemeValue(newWallpaper));
    } catch (err) {
      console.log(err);
    }
  };

  const SaveWallpaper = async () => {
    if (newWallPaper) {
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, newWallPaper)
        .then(async (snapshot) => {
          await getDownloadURL(snapshot.ref)
            .then(async (res) => {
              await updateDoc(doc(db, "usersWallpapers", currentUser?.uid), {
                wallpapers: arrayUnion({
                  id: uuid(),
                  wallPaperURL: res,
                }),
                inUse: res,
              });
            })
            .then(() => {
              dispatch(menuActions.onSetChatThemeValue(""));
              setNewWallPaper(false);
            });
        })
        .catch((err) => console.log(err));
    } else {
      await updateDoc(doc(db, "usersWallpapers", currentUser?.uid), {
        inUse: chatThemeValue,
      }).then(() => {
        dispatch(menuActions.onSetChatThemeValue(""));
        setNewWallPaper(false);
      });
    }
  };

  return (
    <div className="chatTheme">
      <div>
        <p>Chat Wallpapers</p>
        <CgClose
          className="themeIcon"
          onClick={() => {
            dispatch(menuActions.onSetChatTheme(false));
          }}
        />
      </div>

      <input
        type="file"
        name=""
        accept="image/*"
        value={""}
        id="addWallpaper"
        onChange={(e) => {
          setNewWallPaper(e.target.files[0]);
          UploadWallpaper(e.target.files[0]);
        }}
      />

      {chatThemeValue === "" ? (
        <label htmlFor="addWallpaper">
          <p>Upload Wallpaper</p>
          <LuImagePlus className="themeIcon" />
        </label>
      ) : (
        <div className="saveORnot">
          <button
            onClick={() => {
              setNewWallPaper(false);
              dispatch(menuActions.onSetChatThemeValue(""));
            }}
          >
            Remove
          </button>
          <button onClick={() => SaveWallpaper()}>Save</button>
        </div>
      )}
      <div className="ChooseWallpaper">
        <p>Choose Wallpaper</p>
        <div>
          {wallPapers &&
            wallPapers?.map((wallPapers) => (
              <img
                src={wallPapers?.wallPaperURL}
                alt=""
                key={wallPapers?.id}
                onClick={() => {
                  setNewWallPaper(false);
                  dispatch(
                    menuActions.onSetChatThemeValue(wallPapers?.wallPaperURL)
                  );
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
