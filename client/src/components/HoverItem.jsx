import { useState } from "react";

export default function HoverItem({ user, isCheckedout, content }) {
  const [pos, setPos] = useState(null);
  console.log(isCheckedout)
  return (
    <div
      className="flex items-center gap-3 py-1 cursor-default w-full"
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
      
      {isCheckedout && (
        <div className="ml-auto">
          <svg width="12px" height="12px" viewBox="0 0 20 20" fill="#5c6bc0">
            <g id="layer1">
              <path
                d="M 0 1 L 0 20 L 12 20 L 12 16 L 11 16 L 11 19 L 1 19 L 1 2 L 11 2 L 11 5 L 12 5 L 12 1 L 0 1 z M 15 7 L 18 10 L 5 10 L 5 11 L 18 11 L 15 14 L 16.5 14 L 20 10.5 L 16.5 7 L 15 7 z "
                style={{ fill: "#222222", fillOpacity: 1, stroke: "none", strokeWidth: "0px" }}
              ></path>
            </g>
          </svg>
        </div>
      )}

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