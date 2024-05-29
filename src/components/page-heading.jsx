// eslint-disable-next-line react/prop-types
const PageHeading = ({ text, subtext = "" }) => {
  return (
    <div className=" mb-8 mt-4">
      <h2 className="text-3xl font-medium mb-2 text-orange-600">{text}</h2>
      <p className="text-sm text-slate-500">{subtext}</p>
    </div>
  );
};

export default PageHeading;
