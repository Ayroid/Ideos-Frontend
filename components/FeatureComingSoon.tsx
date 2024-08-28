import { AiFillHourglass } from "react-icons/ai";

type FeatureComingSoonProps = {
  title?: string;
  height?: number;
};

const FeatureComingSoon = ({ title, height }: FeatureComingSoonProps) => {
  return (
    <div
      className={`flex items-center justify-center`}
      style={{ height: height ? height + "dvh" : "50dvh" }}
    >
      <div className="flex flex-col items-center">
        <h1 className="mb-20 text-2xl font-bold text-primary">
          {title ?? "New Feature"}
        </h1>
        <AiFillHourglass className="h-36 w-36 text-primary" />
        <p className="text-2xl font-bold text-primary">Feature coming soon</p>
        <p className="mt-1 text-center text-lg text-primary">
          We are working on this feature :)
        </p>
      </div>
    </div>
  );
};

export default FeatureComingSoon;
