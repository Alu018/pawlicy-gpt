import React, { useEffect, useState } from "react";

const frames = ["/bird-1.png", "/bird-2.png"]; // paths relative to public/

export default function BirdImageLoader() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 250); // Change frame every 250ms
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={frames[frame]}
      alt="Bird flapping"
      width={32}
      height={32}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
}