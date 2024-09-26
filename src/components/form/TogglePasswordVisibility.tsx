import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface PasswordVisibilityToggleProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const PasswordVisibilityToggle: React.FC<
  PasswordVisibilityToggleProps
> = ({ inputRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (inputRef.current) {
      inputRef.current.type = isVisible ? "password" : "text";
    }
  };

  return (
    <Button
      onClick={toggleVisibility}
      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 focus:outline-none"
      aria-label={
        isVisible ? "Cacher le mot de passe" : "Afficher le mot de passe"
      }
    >
      {isVisible ? (
        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
      ) : (
        <EyeIcon className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
};
