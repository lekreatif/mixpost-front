import React, { useRef } from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Field, Textarea } from '@headlessui/react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { GrEmoji } from 'react-icons/gr'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

const emojiesCategories = [
  {
    name: 'Smileys et personnes',
    category: 'smileys_people',
  },
  {
    name: 'Animaux et nature',
    category: 'animals_nature',
  },
  {
    name: 'Nourriture et boissons',
    category: 'food_drink',
  },
  {
    name: 'Activités',
    category: 'activities',
  },
  {
    name: 'Voyage et lieux',
    category: 'travel_places',
  },
  {
    name: 'Objets',
    category: 'objects',
  },
  {
    name: 'Symboles',
    category: 'symbols',
  },
  {
    name: 'Drapeaux',
    category: 'flags',
  },
]

const ContentEditor: React.FC = () => {
  const { content, setContent } = useCreatePost()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertEmoji = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const newContent =
        content.substring(0, start) + emojiData.emoji + content.substring(end)
      setContent(newContent)

      // Mettre à jour la position du curseur
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(
          start + emojiData.emoji.length,
          start + emojiData.emoji.length
        )
        textareaRef.current?.focus()
      }, 0)
    }
  }

  return (
    <div className="mb-4 rounded-xl border bg-primary-100 p-4">
      <h2 className="font-sans text-base font-medium">Contenu du post</h2>
      <p className="mb-2 text-xs font-light">
        Décrivez votre post et ajoutez des hashtags.
      </p>
      <Field className="rounded-md border border-primary-300 bg-primary-50 p-2 text-sm font-light focus-within:border-accent-500 focus-within:outline-none focus-within:ring-primary-500">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 w-full bg-transparent data-[focus]:outline-none"
          placeholder="Écrivez votre contenu ici..."
        />
        <div className="flex items-center justify-end">
          <Popover className="relative">
            <PopoverButton className="rounded-md p-1 text-primary-600 hover:bg-primary-200 focus:outline-none">
              <GrEmoji className="h-5 w-5" />
            </PopoverButton>

            <PopoverPanel className="absolute bottom-full right-0 z-10 mb-2">
              <EmojiPicker
                open={true}
                lazyLoadEmojis={true}
                categories={emojiesCategories}
                onEmojiClick={insertEmoji}
                searchPlaceHolder="Recherche"
              />
            </PopoverPanel>
          </Popover>
        </div>
      </Field>
    </div>
  )
}

export default ContentEditor
