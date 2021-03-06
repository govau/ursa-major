import React from "react";

interface Props {
  children: React.ReactElement;
  alt?: boolean;
}

const Section: React.FC<Props> = ({ children, alt = false }) => {
  return (
    <>
      <section className={`au-body ${alt ? "au-body--alt" : ""}`}>
        {children}
      </section>
    </>
  );
};

export default Section;
