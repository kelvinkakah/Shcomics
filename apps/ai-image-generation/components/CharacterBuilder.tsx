"use client";

import { useState } from "react";

export interface Character {
  id: string;
  name: string;
  role: "Hero" | "Villain" | "Sidekick" | "Neutral";
  appearance: string;
  costume: string;
  emoji: string;
}

const ROLE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Hero: { bg: "#FFD700", color: "#111", border: "#111" },
  Villain: { bg: "#534AB7", color: "#CECBF6", border: "#111" },
  Sidekick: { bg: "#1D9E75", color: "#fff", border: "#111" },
  Neutral: { bg: "#888", color: "#fff", border: "#111" },
};

const ROLE_EMOJIS: Record<string, string> = {
  Hero: "🦸",
  Villain: "🦹",
  Sidekick: "🧝",
  Neutral: "🧑",
};

interface CharacterBuilderProps {
  characters: Character[];
  onChange: (characters: Character[]) => void;
}

export default function CharacterBuilder({ characters, onChange }: CharacterBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Character>>({});

  const openAdd = () => {
    const newChar: Character = {
      id: Math.random().toString(36).slice(2),
      name: "",
      role: "Hero",
      appearance: "",
      costume: "",
      emoji: "🦸",
    };
    setForm(newChar);
    setEditingId(newChar.id);
  };

  const openEdit = (char: Character) => {
    setForm({ ...char });
    setEditingId(char.id);
  };

  const saveChar = () => {
    if (!form.name?.trim()) return;
    const updated = form as Character;
    updated.emoji = ROLE_EMOJIS[updated.role] || "🧑";
    const exists = characters.find((c) => c.id === updated.id);
    if (exists) {
      onChange(characters.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      onChange([...characters, updated]);
    }
    setEditingId(null);
    setForm({});
  };

  const deleteChar = (id: string) => {
    onChange(characters.filter((c) => c.id !== id));
    setEditingId(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .char-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 4px; }
        .char-card { border: 3px solid #111; border-radius: 6px; background: #fff; overflow: hidden; }
        .char-avatar { width: 100%; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 32px; border-bottom: 3px solid #111; }
        .char-body { padding: 8px; }
        .char-name { font-family: 'Bangers', cursive; font-size: 16px; color: #111; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .char-role-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; border: 1.5px solid #111; display: inline-block; margin: 3px 0; }
        .char-desc { font-size: 9px; color: #555; font-weight: 700; line-height: 1.3; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .char-edit-btn { width: 100%; background: #FFD700; border: 2px solid #111; border-radius: 3px; padding: 3px; font-family: 'Bangers', cursive; font-size: 12px; letter-spacing: 1px; cursor: pointer; text-align: center; }
        .add-card { border: 3px dashed #ccc; border-radius: 6px; background: #f9f9f9; display: flex; align-items: center; justify-content: center; min-height: 155px; flex-direction: column; gap: 6px; cursor: pointer; transition: border-color 0.2s; }
        .add-card:hover { border-color: #E8001C; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-box { background: #FFF9E6; border: 4px solid #111; border-radius: 12px; padding: 24px; width: 90%; max-width: 400px; position: relative; font-family: 'Comic Neue', cursive; }
        .modal-title { font-family: 'Bangers', cursive; font-size: 28px; color: #E8001C; letter-spacing: 2px; margin-bottom: 16px; }
        .field-label { font-size: 10px; font-weight: 700; color: #E8001C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .field-input { width: 100%; border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #fff; margin-bottom: 12px; outline: none; box-sizing: border-box; }
        .field-select { width: 100%; border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #fff; margin-bottom: 12px; outline: none; box-sizing: border-box; }
        .field-textarea { width: 100%; border: 2.5px solid #111; border-radius: 6px; padding: 8px 10px; font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 13px; background: #fff; margin-bottom: 12px; outline: none; resize: vertical; min-height: 60px; box-sizing: border-box; }
        .modal-btns { display: flex; gap: 8px; margin-top: 4px; }
        .save-btn { flex: 1; background: #FFD700; border: 3px solid #111; border-radius: 6px; padding: 10px; font-family: 'Bangers', cursive; font-size: 18px; letter-spacing: 1px; cursor: pointer; }
        .delete-btn { background: #E8001C; border: 3px solid #111; border-radius: 6px; padding: 10px 14px; font-family: 'Bangers', cursive; font-size: 18px; letter-spacing: 1px; cursor: pointer; color: #fff; }
        .cancel-btn { background: #fff; border: 3px solid #111; border-radius: 6px; padding: 10px 14px; font-family: 'Bangers', cursive; font-size: 18px; letter-spacing: 1px; cursor: pointer; }
      `}</style>

      <div className="char-grid">
        {characters.map((char) => {
          const roleStyle = ROLE_COLORS[char.role];
          return (
            <div className="char-card" key={char.id}>
              <div className="char-avatar" style={{ background: roleStyle.bg }}>
                {char.emoji}
              </div>
              <div className="char-body">
                <div className="char-name">{char.name}</div>
                <div className="char-role-badge" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                  {char.role}
                </div>
                <div className="char-desc">{char.appearance}</div>
                <button className="char-edit-btn" onClick={() => openEdit(char)}>✏ Edit</button>
              </div>
            </div>
          );
        })}

        {characters.length < 4 && (
          <div className="add-card" onClick={openAdd}>
            <div style={{ fontSize: "28px" }}>➕</div>
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: "14px", color: "#aaa", letterSpacing: "1px" }}>
              Add Character
            </div>
          </div>
        )}
      </div>

      {editingId && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {characters.find((c) => c.id === editingId) ? "Edit Character" : "New Character"}
            </div>

            <div className="field-label">Character Name</div>
            <input
              className="field-input"
              placeholder="e.g. Blaze, Shadow, Lyra..."
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="field-label">Role</div>
            <select
              className="field-select"
              value={form.role || "Hero"}
              onChange={(e) => setForm({ ...form, role: e.target.value as Character["role"] })}
            >
              <option>Hero</option>
              <option>Villain</option>
              <option>Sidekick</option>
              <option>Neutral</option>
            </select>

            <div className="field-label">Appearance</div>
            <textarea
              className="field-textarea"
              placeholder="e.g. Tall warrior with red armor, fire powers and a golden shield..."
              value={form.appearance || ""}
              onChange={(e) => setForm({ ...form, appearance: e.target.value })}
            />

            <div className="field-label">Costume / Style</div>
            <input
              className="field-input"
              placeholder="e.g. Red and gold armored suit with cape..."
              value={form.costume || ""}
              onChange={(e) => setForm({ ...form, costume: e.target.value })}
            />

            <div className="modal-btns">
              <button className="save-btn" onClick={saveChar}>💾 Save</button>
              {characters.find((c) => c.id === editingId) && (
                <button className="delete-btn" onClick={() => deleteChar(editingId)}>🗑</button>
              )}
              <button className="cancel-btn" onClick={() => setEditingId(null)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}