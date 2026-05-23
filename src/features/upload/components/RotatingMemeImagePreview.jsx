import { useEffect, useState } from "react";

const memeSamples = [
  {
    image: "/meme-samples/roast-friend.png",
    caption: "Upload responsibly. Group chats may not recover.",
  },
  {
    image: "/meme-samples/testing-app.png",
    caption: "Side effects may include screenshots and betrayal.",
  },
  {
    image: "/meme-samples/group-chat.png",
    caption: "MemeSense is not liable for friendship damage.",
  },
  {
    image: "/meme-samples/character-development.png",
    caption: "Use responsibly. Or don’t. We’re not your manager.",
  },
];

export function RotatingMemeImagePreview() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const sample = memeSamples[sampleIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSampleIndex((currentIndex) => (currentIndex + 1) % memeSamples.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <aside className="sample-meme-panel" aria-label="Sample meme preview">
      <h2 className="sample-panel-title">Sample damage report</h2>
      <div key={sampleIndex} className="sample-meme-rotation">
        <div className="sample-meme-image-card">
          <img alt="" src={sample.image} />
        </div>
        <p className="sample-warning">{sample.caption}</p>
      </div>
    </aside>
  );
}
