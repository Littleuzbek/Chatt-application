import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import React from 'react'

export default function Emoji({onSetText}) {
  return (
    <div className="emojiBox">
        <EmojiPicker height={350} onEmojiClick={(e)=>onSetText(prevEmoji => prevEmoji + e?.emoji)} emojiStyle={EmojiStyle.NATIVE}/>
    </div>
  )
}
