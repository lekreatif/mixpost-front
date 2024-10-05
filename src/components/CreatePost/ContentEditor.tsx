import React, { useRef, useEffect } from "react";
import { Field, Textarea } from "@headlessui/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { GrEmoji } from "react-icons/gr";
import EmojiPicker, { EmojiClickData, Categories } from "emoji-picker-react";
import { usePostCreation } from "@/hooks/usePostCreation";
import { PostType } from "@/types";

const emojiesCategories = [
  {
    name: "Smileys et personnes",
    category: Categories.SMILEYS_PEOPLE,
  },
  {
    name: "Animaux et nature",
    category: Categories.ANIMALS_NATURE,
  },
  {
    name: "Nourriture et boissons",
    category: Categories.FOOD_DRINK,
  },
  {
    name: "Activités",
    category: Categories.ACTIVITIES,
  },
  {
    name: "Voyage et lieux",
    category: Categories.TRAVEL_PLACES,
  },
  {
    name: "Objets",
    category: Categories.OBJECTS,
  },
  {
    name: "Symboles",
    category: Categories.SYMBOLS,
  },
  {
    name: "Drapeaux",
    category: Categories.FLAGS,
  },
];

const ContentEditor: React.FC = () => {
  const { content, setContent, postType } = usePostCreation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const insertEmoji = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent =
        content.substring(0, start) + emojiData.emoji + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(
            start + emojiData.emoji.length,
            start + emojiData.emoji.length
          );
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent =
        content.substring(0, start) + "\n" + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 1;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  if (postType === PostType.STORY) {
    return null;
  }

  return (
    <div className="p-4 mb-4 border rounded-xl bg-primary-100">
      <h2 className="font-sans text-base font-medium">Contenu du post</h2>
      <p className="mb-2 text-xs font-light">
        Décrivez votre post et ajoutez des hashtags.
      </p>
      <Field className="p-2 text-sm font-light border rounded-md border-primary-300 bg-primary-50 focus-within:border-secondary-500 focus-within:outline-none focus-within:ring-primary-500">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="h-auto min-h-[5rem] w-full resize-none bg-transparent text-sm font-light data-[focus]:outline-none"
          placeholder="Écrivez votre contenu ici..."
          onKeyDown={handleKeyDown}
          style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
        />
        <div className="flex items-center justify-end">
          <Popover className="relative">
            <PopoverButton className="p-1 rounded-md text-primary-600 hover:bg-primary-200 focus:outline-none">
              <GrEmoji className="w-5 h-5" />
            </PopoverButton>

            <PopoverPanel className="absolute right-0 z-10 mb-2 bottom-full">
              <EmojiPicker
                open={true}
                lazyLoadEmojis={true}
                categories={emojiesCategories}
                onEmojiClick={insertEmoji}
                searchPlaceHolder="Recherche"
                className=""
              />
            </PopoverPanel>
          </Popover>
        </div>
      </Field>
    </div>
  );
};

export default ContentEditor;
