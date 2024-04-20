/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Props {
  src: string;
  href: string;
}

const ImageLink = ({ src, href }: Props) => {
  return (
    <a href={href}>
      <img src={src} alt="example image" />
    </a>
  );
};

export default ImageLink;
