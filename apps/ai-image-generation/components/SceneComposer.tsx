"use client";

import type { Character } from "./CharacterBuilder";

interface SceneComposerProps {
  characters: Character[];
  selectedCharIds: string[];
  onSelectedCharIdsChange: (ids: string[]) => void;
  setting: string;
  onSettingChange: (val: string) => void;
  mood: string;
  onMoodChange: (val: string) => void;
  timeOfDay: string;
  onTimeOfDayChange: (val: string) => void;
  action: string;
  onActionChange: (val: string) => void;
}

export default function SceneComposer({
  characters,
  selectedCharIds,
  onSelectedCharIdsChange,
  setting,
  onSettingChange,
  mood,
  onMoodChange,
  timeOfDay,
  onTimeOfDayChange,
  action,
  onActionChange,
}: SceneComposerProps) {
  const toggleChar = (id: string) => {
    if (selectedCharIds.includes(id)) {
      onSelectedCharIdsChange(selectedCharIds.filter((c) => c !== id));
    } else {
      onSelectedCharIdsChange([...selectedCharIds, id]);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .scene-box { border: 3px solid #111; border-radius: 8px; background: #fff; padding: 16px; }
        .scene-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .scene-field { display: flex; flex-direction: column; gap: 4px; }
        .scene-label { font-size: 10px; font-weight: 700; color: #E8001C; text-transform: uppercase; letter-spacing: 1px; font-family: 'Comic Neue', cursive; }
        .scene-input { border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #FFF9E6; outline: none; width: 100%; box-sizing: border-box; }
        .scene-select { border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #FFF9E6; outline: none; width: 100%; box-sizing: border-box; }
        .scene-textarea { border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #FFF9E6; outline: none; resize: vertical; min-height: 60px; width: 100%; box-sizing: border-box; }
        .char-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
        .char-chip { padding: 4px 10px; border-radius: 4px; font-family: 'Bangers', cursive; font-size: 13px; letter-spacing: 1px; cursor: pointer; border: 2px solid #111; transition: transform 0.1s; user-select: none; }
        .char-chip:hover { transform: scale(1.05); }
        .char-chip.selected { border: 3px solid #111; }
        .char-chip.unselected { opacity: 0.4; }
        .no-chars { font-size: 12px; font-weight: 700; color: #aaa; font-family: 'Comic Neue', cursive; }
      `}</style>

      <div className="scene-box">
        <div className="scene-grid">
          <div className="scene-field" style={{ gridColumn: "1 / -1" }}>
            <div className="scene-label">Setting — Where does this panel take place?</div>
            <input
              className="scene-input"
              placeholder="e.g. Rooftop of a burning skyscraper, underwater city, dark forest..."
              value={setting}
              onChange={(e) => onSettingChange(e.target.value)}
            />
          </div>

          <div className="scene-field">
            <div className="scene-label">Mood</div>
            <select className="scene-select" value={mood} onChange={(e) => onMoodChange(e.target.value)}>
              <option>Dramatic and intense</option>
              <option>Dark and mysterious</option>
              <option>Epic and heroic</option>
              <option>Funny and lighthearted</option>
              <option>Tense and suspenseful</option>
              <option>Action-packed</option>
              <option>Emotional and sad</option>
            </select>
          </div>

          <div className="scene-field">
            <div className="scene-label">Time of Day</div>
            <select className="scene-select" value={timeOfDay} onChange={(e) => onTimeOfDayChange(e.target.value)}>
              <option>Night with neon lights</option>
              <option>Golden sunset</option>
              <option>Stormy dawn</option>
              <option>Bright midday sun</option>
              <option>Foggy early morning</option>
              <option>Blood red dusk</option>
            </select>
          </div>

          <div className="scene-field" style={{ gridColumn: "1 / -1" }}>
            <div className="scene-label">Action — What is happening in this panel?</div>
            <textarea
              className="scene-textarea"
              placeholder="e.g. Blaze leaps off the building towards Shadow who is escaping with the stolen artifact..."
              value={action}
              onChange={(e) => onActionChange(e.target.value)}
            />
          </div>
        </div>

        <div className="scene-label" style={{ marginBottom: "8px" }}>
          Characters in this panel — tap to include
        </div>
        {characters.length === 0 ? (
          <div className="no-chars">No characters yet — add some in Step 1 above!</div>
        ) : (
          <div className="char-chips">
            {characters.map((char) => {
              const isSelected = selectedCharIds.includes(char.id);
              const roleColors: Record<string, { bg: string; color: string }> = {
                Hero: { bg: "#FFD700", color: "#111" },
                Villain: { bg: "#534AB7", color: "#CECBF6" },
                Sidekick: { bg: "#1D9E75", color: "#fff" },
                Neutral: { bg: "#888", color: "#fff" },
              };
              const style = roleColors[char.role];
              return (
                <div
                  key={char.id}
                  className={`char-chip ${isSelected ? "selected" : "unselected"}`}
                  style={{ background: style.bg, color: style.color }}
                  onClick={() => toggleChar(char.id)}
                >
                  {char.emoji} {char.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}