import React from "react";
import { GoHourglass } from "react-icons/go";

type FeatureComingSoonProps = {
  title?: string;
};

const FeatureComingSoon = ({ title }: FeatureComingSoonProps) => {
  return (
    <div className="flex h-[50dvh] items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-20 text-2xl font-bold text-primary">
          {title ?? "New Feature"}
        </h1>
        <GoHourglass className="h-36 w-36 text-primary" />
        <p className="text-2xl font-bold text-primary">Feature coming soon</p>
        <p className="mt-1 text-center text-lg text-primary">
          We are working on this feature :)
        </p>
      </div>
    </div>
  );
};

export default FeatureComingSoon;
