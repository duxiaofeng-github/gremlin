import React from "react";
import { useEffect } from "react";
import { createIcon } from "@download/blockies";
import { useState } from "react";
import { UserCircleOutline } from "antd-mobile-icons";

interface IProps {
  className?: string;
  walletAddress?: string;
  src?: string;
}

export const Avatar: React.SFC<IProps> = (props) => {
  const { className, walletAddress, src } = props;

  const [avatarSrc, setAvatarSrc] = useState(src);

  useEffect(() => {
    if (walletAddress) {
      const icon = createIcon({
        seed: walletAddress.toLowerCase(),
      });

      setAvatarSrc(icon.toDataURL());
    }
  }, [walletAddress]);

  return avatarSrc ? <img className={className} src={avatarSrc} /> : <UserCircleOutline className={className} />;
};
