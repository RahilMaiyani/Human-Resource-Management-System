import { useState } from "react";

export default function HoverItem({ user, content }) {
  const [pos, setPos] = useState(null);

  return (
    <div
      className="flex items-center gap-3 py-1 cursor-default"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          top: rect.top + rect.height / 2,
          left: rect.right - 150
        });
      }}
      onMouseLeave={() => setPos(null)}
    >
      <img
        src={
          user.profilePic ||
          `https://ui-avatars.com/api/?name=${user.name}`
        }
        className="w-10 h-10 rounded-full"
      />
      <p className="font-medium">{user.name}</p>

      {/* FIXED TOOLTIP */}
      {pos && content && (
        <div
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translateY(-50%)"
          }}
          className="z-50 w-64 p-3 rounded-xl shadow-lg bg-gray-900 text-white text-xs"
        >
          {content}
        </div>
      )}
    </div>
  );
}