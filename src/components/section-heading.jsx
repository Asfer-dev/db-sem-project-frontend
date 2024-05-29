// eslint-disable-next-line react/prop-types
const SectionHeading = ({ text, className = "" }) => {
  return (
    <h2 className={"text-xl font-medium mb-6 text-center " + className}>
      {text}
    </h2>
  );
};

export default SectionHeading;
