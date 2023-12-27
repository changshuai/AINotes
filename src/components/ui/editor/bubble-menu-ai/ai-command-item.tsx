
import { FC } from "react";

interface AICommandItemProps {
  name: string
  onClick: ()=>void
}

export const AICommandItem: FC<AICommandItemProps> = ({
  name,
  onClick
}) => {

return (
  <button
    onClick={() => onClick() }
    className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
    type="button"
    >
    <div className="flex items-center space-x-2">
      <span>{name}</span>
    </div>
  </button>
);
};
