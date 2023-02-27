import { useEffect, useState } from "react";
import "./styles.css";

const encodedString = `115 133 127 150 103 126 124 047 164 054 110 131 107 041 164 114 054 160 041 114 050 163 104 072 121 120 057 111 050 057 174 137 045 136 167 047 041 112 133 147 103 045 130 175 147 065 041 136 115 047 041 062 053 127 113 042 106 062 160 124 167 132 052 133 125 151 126 123 166 052 054 122 100 150 124 133 166 175 105 101 043 041 151 112 103 065 041 051 147 173 103 100 112 161 174 053 175 135 104 163 120 123 130 077 156 075 066 075 127 067 107 065 050 147 101 164 150 063 174 074 114 116 174 161 060 126 157 100 045 053 131 053 164 144 077 130 104 130 152 141 056 131 104 111 125 175 154 103 141 047 046 155 047 103 123 175 142 045 144 044 173 141 103 054 100 053 105 055 125 100 111 122 165 176 125 045 162 041 047 121 116 076 154 122 114 056 074 113 053 102 165 131 103 074 124 163 127 055 074 127 145 073 173 141 053 130 074 163 052 135 126 137 043 164 051 104 055 101 126 061 056 157 127 135 116 173 051 156 056 131 132 104 073 141 042 076 167 125 100 126 163 115 136 057 111 067 127 107 132 121 063 121 066 070 106 074 120 066 073 115 045 104 121 061`;

const isValidUrl = (url) => {
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-]*)*$/i;
  return urlRegex.test(url);
};

const App = () => {
  const [listChar, setListChar] = useState("");
  const [decodedUrl, setDecodedUrl] = useState("");
  const [capturedFlag, setCapturedFlag] = useState("");
  const [showFlag, setShowFlag] = useState(false);
  // typewriter effect with a 500ms delay
  // between each character.
  const effectDelay = 500;

  useEffect(() => {
    let encodedArray = encodedString.split(" ");
    let url = decodeString(encodedArray);
    setDecodedUrl(url);
  }, []);

  useEffect(() => {
    if (isValidUrl(decodedUrl)) {
      recursiveListUpdate();
      captureTheFlag(decodedUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedUrl]);

  const captureTheFlag = async (url) => {
    try {
      let { body: stream } = await fetch(url);
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const flag = new TextDecoder("utf-8").decode(value);
        return setCapturedFlag(flag);
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const decodeString = (encodedArray) => {
    let resultString = "";
    encodedArray.forEach((item) => {
      const intValue = parseInt(item, 8);
      let character = String.fromCharCode(intValue);
      if (/[-./0-9:a-z]/.test(character)) {
        resultString += character;
      }
    });
    return resultString;
  };

  const recursiveListUpdate = (index = 0) => {
    if (index === decodedUrl.length) return setShowFlag(true);
    setTimeout(() => {
      setListChar(decodedUrl.slice(0, index + 1));
      recursiveListUpdate(index + 1);
    }, effectDelay);
  };

  return (
    <div className="App">
      <h2>
        <span role="img" aria-label="flag">
          🚩
        </span>{" "}
        Capture The Flag
      </h2>
      <hr />
      <h3 className="flag-info">
        {showFlag && capturedFlag ? (
          <span>{capturedFlag}</span>
        ) : (
          "Loading ...."
        )}
      </h3>
      <hr />
      <ul>
        {[...listChar].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
