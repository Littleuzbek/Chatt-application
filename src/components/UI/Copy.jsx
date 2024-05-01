import CopyToClipboard from "react-copy-to-clipboard";

export default function Copy(text) {
  return (
    <CopyToClipboard  text={text?.copiyingText}>
        <div>Copy</div>
    </CopyToClipboard>
  );
}
